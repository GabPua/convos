import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import useAuth from '../utils/useAuth'
import { Outlet, useNavigate, useParams, Link, useLocation } from 'react-router-dom'
import Modal from '../components/modal'
import Feedback from '../components/feedback-modal'
import Loading from '../components/loading'
import app from '../utils/axiosConfig'

function SideBarItem({ to, text, patt }) {
  const loc = useLocation()
  return (
    <div className="my-4 text-right">
      <Link to={to} className={'font-bold text-3xl cursor-pointer hover:text-primary select-none ' + (loc.pathname.match(patt) ? 'text-primary' : 'text-gray-600')}>{text}</Link>
    </div>
  )
}

SideBarItem.propTypes = {
  to: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  patt: PropTypes.instanceOf(RegExp).isRequired,
}

export default function GroupSettings() {
  const { user, socket } = useAuth()
  const { groupId } = useParams()
  const navigate = useNavigate()
  const [group, setGroup] = useState({ _id: groupId })
  const [modal, setModal] = useState(null)

  const closeModal = () => setModal(null)

  function setFeedback(isSuccess, feedbackText) {
    setModal(<Feedback isSuccess={isSuccess} text={feedbackText} />)
  }

  async function refreshGroup() {
    const { group: g } = await app.get(`group/${groupId}`)
    if (g != null) {
      g.isAdmin = user._id === g?.admin
    }
    setGroup(g)
  }

  useEffect(refreshGroup, [])

  useEffect(() => {
    if (socket) {
      socket.on('update group', refreshGroup)
      socket.emit('join room', group._id)
      return () => {
        socket.off('update group')
        socket.emit('leave room', group._id)
      }
    }
  }, [socket])

  function updateDp(picUri) {
    setGroup(Object.assign(group, { picUri }))
  }

  function updateCover(coverUri) {
    setGroup(Object.assign(group, { coverUri }))
  }

  function updateDetails(details) {
    setGroup(Object.assign(group, details))
  }

  const removeMember = async (userId, isInvited) => {
    const { result } = await app.post(`group/${groupId}/remove`, { userId })

    if (result) {
      if (isInvited) setGroup(Object.assign(group, { invitations: group.invitations.filter(m => m._id !== userId) }))
      else setGroup(Object.assign(group, { members: group.members.filter(m => m._id !== userId), }))
      setFeedback(true, 'User successfully removed!')
    } else {
      setFeedback(false, 'An error has occured!')
    }
  }

  async function inviteMembers(userIds) {
    const { result, error } = await app.put(`group/${groupId}/invite`, { userIds })
    if (result) {
      refreshGroup()
      setFeedback(result, result ? 'Users have been invited!' : error)
    }
    return { error }
  }

  const handleExitClick = () => navigate('/dashboard/groups')

  if (group === null) {
    return (
      <div className="grid items-center justify-center h-full">
        <div>
          <p className="text-3xl font-medium mb-4">Group not found!</p>
          <Link className="btn primary text-center" to="/dashboard/groups">Go back to groups</Link>
        </div>
      </div>
    )
  } else if (group.picUri) {
    return (
      <div>
        <div className="fixed top-16 left-0 h-screen w-60 m-0 p-5 border border-gray border-t-0">
          <div>
            <i className="fas fa-times fa-lg cursor-pointer text-gray-600 hover:text-black" onClick={handleExitClick}></i>
          </div>

          <SideBarItem to="." text="General" patt={/^(\/[^/]+){2}$/g} />
          <SideBarItem to="members" text="Members" patt={/(members)$/} />
          {group.isAdmin ?
            <SideBarItem to="disband" text="Disband" patt={/(disband)$/} /> :
            <SideBarItem to="leave" text="Leave" patt={/(leave)$/} />
          }
        </div>

        <div className="ml-72 h-full p-14" style={{ 'width': 'calc(100vw - 24rem)', 'maxWidth': '70rem' }}>
          <Outlet context={{ group, removeMember, inviteMembers, setModal, updateDp, updateCover, updateDetails }} />
        </div>
        <Modal component={modal} closeHandler={closeModal} setFeedback={setFeedback} changeHandler={() => { }} />
      </div>
    )
  } else {
    return <Loading show={true} />
  }
}