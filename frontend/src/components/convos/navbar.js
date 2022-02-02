import React from 'react'
import PropTypes from 'prop-types'

function NavBarItem({ text }) {
  return (
    <div className="w-48 mx-10">
      <p className="text-2xl select-none text-center text-gray-500 hover:cursor-pointer hover:text-primary">{text}</p>
    </div>
  )
}

NavBarItem.propTypes = {
  text: PropTypes.string.isRequired,
}

export default function NavBar() {
  return (
    <nav className="flex mb-5">
      <NavBarItem text="School" />
      <NavBarItem text="Gaming" />
      <NavBarItem text="Social" />
      <input className="bg-gray-300 text-gray-900 placeholder-gray-700 py-1 px-2 rounded-lg text-lg" type="search" name="" id="" placeholder="Search convo..." />
    </nav>
  )
}