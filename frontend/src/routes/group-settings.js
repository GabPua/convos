import React, { useEffect } from 'react'
import useAuth from '../utils/useAuth'
import { useNavigate, useParams } from 'react-router-dom'

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
          <div className="my-4">
            <p className="text-gray-600 font-bold text-3xl text-right cursor-pointer hover:text-primary select-none">General</p>
          </div>

          <div className="my-4">
            <p className="text-gray-600 font-bold text-3xl text-right cursor-pointer hover:text-primary select-none">Members</p>
          </div>

          <div className="my-4">
            <p className="text-gray-600 font-bold text-3xl text-right cursor-pointer hover:text-primary select-none">Disband</p>
          </div>
        </div>
        <div className="ml-96 h-full p-14" style={{'width': 'calc(100vw - 24rem)', 'max-width': '70rem'}}>
          <div>
            <div className="flex justify-between mb-2">
              <p className="text-3xl font-bold">Group Members</p>
              <i className="fas fa-2x fa-user-plus text-primary cursor-pointer hover:text-primary-hover"></i>
            </div>
            <hr />
            <div className="overflow-y-scroll px-2">
              <div className="flex justify-between items-center hover:bg-gray-200 rounded-2xl cursor-pointer select-none my-2 p-2 group transition-colors">
                <div>
                  <img src="./assets/hans.png" alt="Hans dp" className="inline mr-4" />
                  <span className="text-xl">SPADE</span>
                </div>
                <span className="mx-4">
                  <i className="text-error-500 invisible group-hover:visible fas fa-times fa-lg hover:text-error-600"></i>
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}