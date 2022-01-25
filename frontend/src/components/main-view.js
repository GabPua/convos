import React from 'react'
import PropTypes from 'prop-types'
import useAuth from '../utils/useAuth'
import { useNavigate, Link } from 'react-router-dom'

export default function MainView({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogoutClick() {
    logout()
      .then(() => navigate('/', { replace: true }))
      .catch(() => alert('An error has occured!'))
  }

  return (
    <div>
      <header className="bg-primary fixed w-full z-50">
        <nav className="max-w-screen-2xl p-2 flex justify-between h-16 m-auto">
          <Link className="flex flex-shrink-0 items-center" to="/dashboard">
            <img src="/assets/logo-white.png" alt="Convos Logo" className="w-[50px] inline-block mr-3" />
            <span className="heavy text-secondary text-3xl font-keep-calm align-middle select-none">CONVOS</span>
          </Link>
          <div className="flex justify-end">
            <div className="group relative w-12">
              <img src={user.dpUri} alt="Profile Picture" className="cursor-pointer rounded-full" />
              <div className="group-hover:block dropdown-menu absolute hidden h-auto bg-secondary p-2">
                <button className="top-0 bg-primary text-secondary font-medium hover:bg-primary-hover p-2 w-20"
                  onClick={handleLogoutClick}>Log Out</button>
              </div>
            </div>
          </div>
        </nav>
      </header>

      <main className="main-content pt-16">
        {children}
      </main>
    </div>
  )
}

MainView.propTypes = {
  children: PropTypes.node.isRequired,
}
