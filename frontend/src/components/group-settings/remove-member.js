import React from 'react'
import PropTypes from 'prop-types'
import { useOutletContext } from 'react-router-dom'

export default function RemoveMember({ closeHandler, id, name, dpUri }) {
  const { removeMember } = useOutletContext()

  const handleRemoveClick = () => {
    removeMember(id)
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <p className="font-light text-lg my-2">Are you sure you want to remove this user?</p>
      <img src={dpUri} className="rounded-full w-28 my-4" />
      <p className="text-xl font-light">{name}</p>
      <div className="p-3 mt-4 text-center space-x-4 md:block">
        <button type="button" onClick={handleRemoveClick}>Yes</button>
        <button type="button" className="mb-2 md:mb-0 bg-error-500 px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-secondary rounded-full hover:shadow-lg hover:bg-error-600" onClick={closeHandler}>No</button>
      </div>
    </div>
  )
} 

RemoveMember.propTypes = {
  closeHandler: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  dpUri: PropTypes.string.isRequired,
}