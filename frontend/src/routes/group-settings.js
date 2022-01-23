import React, { useEffect, useState } from 'react'
import useAuth from '../utils/useAuth'
import { Outlet, useNavigate, useParams, Link, useLocation } from 'react-router-dom'
import Modal from '../components/modal'
import Feedback from '../components/feedback-modal'
import postRequest from '../utils/postRequest'

export default function GroupSettings() {
  const { logout, user } = useAuth()
  const { groupId } = useParams()
  const navigate = useNavigate()
  const loc = useLocation()
  const [group, setGroup] = useState({ _id: groupId })
  const [modal, setModal] = useState(null)

  const closeModal = () => setModal(null)

  function setFeedback(isSuccess, feedbackText) {
    setModal(<Feedback isSuccess={isSuccess} text={feedbackText} />)
  }

  useEffect(async () => {
    const { group: g } = await (await fetch(`/api/group/${groupId}`)).json()
    setGroup(g)
  }, [])

  function handleLogoutClick() {
    logout()
      .then(() => navigate('/', { replace: true }))
      .catch(() => alert('An error has occured!'))
  }

  function updateDp(picUri) {
    setGroup(Object.assign(group, { picUri }))
  }

  function updateCover(coverUri) {
    setGroup(Object.assign(group, { coverUri }))
  }

  function updateDetails(details) {
    setGroup(Object.assign(group, details))
  }

  const removeMember = async userId => {
    const { result } = await postRequest(`/api/group/${groupId}/remove`, { userId })

    if (result) {
      setGroup(Object.assign(group, { members: group.members.filter(m => m._id !== userId) }))
      setFeedback(true, 'Member successfult removed!')
    } else {
      setFeedback(false, 'An error has occured!')
    }
  }

  async function addMember(userId) {
    // if not in contacts
    if (group.members.find(m => m._id === userId) === undefined) {
      const { result, user, error } = await postRequest(`/api/group/${groupId}/add`, { userId })
      if (result) {
        setFeedback(result, result? 'Member added!' : error)
        setGroup(Object.assign(group, { members: group.members.concat([user]) }))
      }

      return { error }
    }
    
    return { error: 'Account is already a member of the group!' }
  }

  const handleExitClick = () => navigate('/dashboard/groups')

  return (
    <div>
      <header className="bg-primary fixed w-full z-50">
        <nav className="max-w-screen-2xl p-2 flex items-stretch h-16 m-auto">
          <div className="flex flex-shrink-0 items-center">
            <img src="/assets/logo-white.png" alt="Convos Logo" className="w-[50px] inline-block mr-3" />
            <span className="heavy text-secondary text-3xl font-keep-calm align-middle">CONVOS</span>
          </div>
          <div className="flex justify-end flex-grow">
            <div className="group relative">
              <img src={user.dpUri} alt="Profile Picture" className="cursor-pointer h-full rounded-full" />
              <div className="group-hover:block dropdown-menu absolute hidden h-auto bg-secondary p-2">
                <button className="top-0 bg-primary text-secondary font-medium hover:bg-primary-hover p-2 w-20"
                  onClick={handleLogoutClick}>Log Out</button>
              </div>
            </div>
          </div>
        </nav>
      </header>

      <main className="main-content pt-16">
        <div className="fixed top-16 left-0 h-screen w-96 m-0 p-5 bg-gray-300 border border-gray border-t-0">
          <div>
            <i className="fas fa-times fa-lg cursor-pointer text-gray-600 hover:text-black" onClick={handleExitClick}></i>
          </div>
          <div className="my-4 text-right">
            <Link to="." className={'font-bold text-3xl cursor-pointer hover:text-primary select-none ' + (loc.pathname.match(/^(\/[^/]+){2}$/g) ? 'text-primary' : 'text-gray-600')}>General</Link>
          </div>

          <div className="my-4 text-right">
            <Link to="members" className={'font-bold text-3xl cursor-pointer hover:text-primary select-none ' + (loc.pathname.match(/(members)$/) ? 'text-primary' : 'text-gray-600')}>Members</Link>
          </div>

          <div className="my-4 text-right">
            <Link to="disband" className={'font-bold text-3xl cursor-pointer hover:text-primary select-none ' + (loc.pathname.match(/(disband)$/) ? 'text-primary' : 'text-gray-600')}>Disband</Link>
          </div>
        </div>
        <div className="ml-96 h-full p-14" style={{ 'width': 'calc(100vw - 24rem)', 'maxWidth': '70rem' }}>
          <Outlet context={{ group, removeMember, addMember, setModal, updateDp, updateCover, updateDetails }} />
        </div>
      </main>
      <Modal component={modal} closeHandler={closeModal} setFeedback={setFeedback} changeHandler={() => { }} />
    </div>
  )
}