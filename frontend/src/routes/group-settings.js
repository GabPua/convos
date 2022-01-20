import React, { useEffect } from 'react'
import useAuth from '../utils/useAuth'
import { Outlet, useNavigate, useParams, Link } from 'react-router-dom'

export default function GroupSettings() {
  const { logout } = useAuth()
  const { groupId } = useParams()
  const navigate = useNavigate()

  useEffect(async () => {
    const result = await fetch(`/api/group/${groupId}`)
    console.log(result)
  }, [])

  function handleLogoutClick() {
    logout()
      .then(() => navigate('/', { replace: true }))
      .catch(() => alert('An error has occured!'))
  }

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
              <img alt="Profile Picture" className="cursor-pointer h-full rounded-full" />
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
          <div className="my-4 text-right">
            <Link to="." className="text-gray-600 font-bold text-3xl cursor-pointer hover:text-primary select-none">General</Link>
          </div>

          <div className="my-4 text-right">
            <Link to="members" className="text-gray-600 font-bold text-3xl cursor-pointer hover:text-primary select-none">Members</Link>
          </div>

          <div className="my-4 text-right">
            <Link to="disband" className="text-gray-600 font-bold text-3xl cursor-pointer hover:text-primary select-none">Disband</Link>
          </div>
        </div>
        <div className="ml-96 h-full p-14" style={{ 'width': 'calc(100vw - 24rem)', 'max-width': '70rem' }}>
          <Outlet />
        </div>
      </main>
    </div>
  )
}