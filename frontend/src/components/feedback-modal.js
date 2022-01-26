import React from 'react'
import PropTypes from 'prop-types'

export default function Feedback({ isSuccess, text, closeHandler }) {
  const icon = isSuccess? ['/green-check.png', 'Check Mark'] : ['/red-x.png', 'X Mark']

  return (
    <div className="text-secondary flex flex-col items-center w-64">
      <img src={`/assets/${icon[0]}`} alt={icon[1]} />
      <p className="font-light my-5">{text}</p>
      <button className="btn" onClick={closeHandler}>CLOSE</button>
    </div>
  )
}

Feedback.propTypes = {
  isSuccess: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired,
  closeHandler: PropTypes.func,
}
