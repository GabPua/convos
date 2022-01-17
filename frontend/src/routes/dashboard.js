import React, { useState } from 'react'
// eslint-disable-next-line no-unused-vars
import styles from '../dashboard.css'
import Modal from '../components/modal'
import { Outlet, useNavigate } from 'react-router-dom'
import Feedback from '../components/feedback-modal'
import useAuth from '../utils/useAuth'
import SideBarItem from '../components/side-bar-item'
import CreateGroup from '../components/create-group'

export default function Dashboard() {
  const [modal, setModal] = useState(null)
  const navigate = useNavigate()
  const { user, refreshUser, logout } = useAuth()

  function handleChangeClick(component, event) {
    event.preventDefault()
    setModal(component)
  }

  function handleLogoutClick() {
    logout()
      .then(() => navigate('/', { replace: true }))
      .catch(() => alert('An error has occured!'))
  }

  function setFeedback(isSuccess, feedbackText) {
    setModal(<Feedback isSuccess={isSuccess} text={feedbackText} />)
  }

  const closeModal = () => setModal(null)

  return (
    <div>
      <header className="bg-primary fixed w-full">
        <nav className="max-w-screen-2xl p-2 flex items-stretch h-16 m-auto">
          <div className="flex flex-shrink-0 items-center">
            <img src="/assets/logo-white.png" alt="Convos Logo" className="w-[50px] inline-block mr-3" />
            <span className="heavy text-secondary text-3xl font-keep-calm align-middle">CONVOS</span>
          </div>
          <div className="flex justify-end flex-grow">
            <div className="group relative">
              <img src={user.dpUri} alt="Profile Picture" className="cursor-pointer h-full rounded-full" />
              <div className="group-hover:block dropdown-menu absolute hidden h-auto bg-secondary p-2">
                <button className="top-0 bg-primary text-secondary font-medium hover:bg-primary-hover p-2 w-20" onClick={handleLogoutClick}>Log Out</button>
              </div>
            </div>
          </div>
        </nav>
      </header>

      <main className="main-content pt-16">
        <div className="fixed top-16 left-0 w-60 m-0 p-5 flex flex-col justify-between border border-gray border-t-0" style={{'height': 'calc(100vh - 4rem)' }}>
          <div>
            <SideBarItem title="Account" to="/dashboard" className="fas fa-user fa-lg" />
            <SideBarItem title="My Groups" to="/dashboard/groups" className="fas fa-users fa-lg" />
            <SideBarItem title="Dashboard" to="/dashboard/groups" className="fas fa-chalkboard fa-lg" />
          </div>
          <button className="btn primary" onClick={() => setModal(<CreateGroup closeHandler={closeModal} />)}>New Convo</button>
        </div>
        <div className="ml-60 h-full p-5" style={{'width': 'calc(100vw - 15rem)'}}>
          <Outlet context={handleChangeClick} />
        </div>
      </main>
      <Modal component={modal} closeHandler={closeModal} setFeedback={setFeedback} changeHandler={refreshUser} />
    </div>
  )
}
