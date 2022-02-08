import React from 'react'
import PropTypes from 'prop-types'

export default function ContactItem({ name, dpUri }) {
  return (
    <div className="flex items-center py-1">
      <figure className="mr-6 w-14">
        <img src={dpUri} alt="profile picture" className="rounded-full" />
      </figure>
      <p className="text-xl">{name}</p>
    </div>
  )
}

ContactItem.propTypes = {
  name: PropTypes.string.isRequired,
  dpUri: PropTypes.string.isRequired,
}
