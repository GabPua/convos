import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'

export default function SideBarItem({ title, to, className}) {
  const loc = useLocation()

  return (
    <Link to={to} className={'sidebar-item' + (loc.pathname === to ? ' selected' : '') }>
      <span className="flex-center w-14"><i className={className}></i></span>
      <span className="flex-center flex-grow"> {title} </span>
    </Link>
  )
}

SideBarItem.propTypes = {
  title: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
}
