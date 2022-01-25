import React, { useState } from 'react'
// eslint-disable-next-line no-unused-vars
import styles from '../dashboard.css'
import Modal from '../components/modal'
import { Outlet } from 'react-router-dom'
import Feedback from '../components/feedback-modal'
import useAuth from '../utils/useAuth'
import SideBarItem from '../components/side-bar-item'
import CreateGroup from '../components/create-group'

export default function Dashboard() {
  const [modal, setModal] = useState(null)
  const { refreshUser } = useAuth()

  function handleChangeClick(component, event) {
    event.preventDefault()
    setModal(component)
  }

  function setFeedback(isSuccess, feedbackText) {
    setModal(<Feedback isSuccess={isSuccess} text={feedbackText} />)
  }

  const closeModal = () => setModal(null)

  return (
    <div>
      <div className="fixed top-16 left-0 w-60 m-0 p-5 flex flex-col justify-between border border-gray border-t-0" style={{ 'height': 'calc(100vh - 4rem)' }}>
        <div>
          <SideBarItem title="Account" to="/dashboard" className="fas fa-user fa-lg" />
          <SideBarItem title="My Groups" to="/dashboard/groups" className="fas fa-users fa-lg" />
          <SideBarItem title="Convos" to="/dashboard/convos" className="fas fa-chalkboard fa-lg" />
        </div>
        <button className="btn primary" onClick={() => setModal(<CreateGroup closeHandler={closeModal} />)}>
          <i className="fas fa-plus mr-2"></i>
          New Group
        </button>
      </div>
      <div className="ml-60 h-full p-5" style={{ 'width': 'calc(100vw - 15rem)' }}>
        <Outlet context={handleChangeClick} />
      </div>
      <Modal component={modal} closeHandler={closeModal} setFeedback={setFeedback} changeHandler={refreshUser} />
    </div>
  )
}
