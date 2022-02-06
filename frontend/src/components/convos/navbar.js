import React from 'react'
import PropTypes from 'prop-types'
import { tags } from 'convos-validator'

function NavBarItem({ tag, onClick, isSelected }) {
  return (
    <div className={'w-48 mx-10' + (isSelected ? ' border-b-2 border-primary' : '')} onClick={() => onClick(tag)}>
      <p className={'text-2xl select-none text-center text-gray-500 hover:cursor-pointer capitalize '
        + (isSelected ? 'text-primary' : 'hover:text-primary')}>{tag}</p>
    </div>
  )
}

NavBarItem.propTypes = {
  isSelected: PropTypes.bool.isRequired,
  tag: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
}

export default function NavBar({ handleNavClick, selectedTag, onSearchChange }) {
  return (
    <nav className="flex mb-5">
      {tags.map(t => <NavBarItem key={t} tag={t} onClick={handleNavClick} isSelected={selectedTag == t.toLowerCase()} />)}
      <input className="bg-gray-300 text-gray-900 placeholder-gray-700 py-1 px-2 rounded-lg text-lg" type="search" placeholder="Search convo..."
        onChange={onSearchChange} />
    </nav>
  )
}

NavBar.propTypes = {
  selectedTag: PropTypes.string.isRequired,
  handleNavClick: PropTypes.func.isRequired,
  onSearchChange: PropTypes.func.isRequired,
}