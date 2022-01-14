import React from 'react'
import PropTypes from 'prop-types'

export default function GroupItem({ name, count, coverUri, dpUri }) {
  return (
    <div className="shadow-lg rounded-lg flex flex-col items-center justify-end h-60 relative bg-no-repeat bg-contain hover:cursor-pointer pb-5 w-64 transition-all hover:scale-105" style={{'background-image': `url(${coverUri})`}}>
      <img src={dpUri} className="rounded-full w-14 border-4 border-white" alt="Group Picture" />
      <p>{name}</p>
      <span>
        <i className="fas fa-user"></i>
        {count}
      </span>
    </div>
  )
}

GroupItem.propTypes = {
  name: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  coverUri: PropTypes.string.isRequired,
  dpUri: PropTypes.string.isRequired,
}