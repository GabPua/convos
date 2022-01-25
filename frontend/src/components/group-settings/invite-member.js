import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { isValidEmail } from 'convos-validator'
import useAuth from '../../utils/useAuth'

export default function InviteMember({ inviteMember, closeHandler }) {
  const [input, setInput] = useState('')
  const [error, setError] = useState('')

  const { user } = useAuth()

  const handleChange = e => {
    setInput(e.target.value)
    setError('')
  }

  const handleFormSubmit = async e => {
    e.preventDefault()

    if (isValidEmail(input)) {
      const { error } = await inviteMember(input)
      if (error) setError(error)
    } else {
      setError('Invalid email!')
    }
  }

  return (
    <div>
      <div className="text-secondary">
        <p className="font-keep-calm text-3xl text-center mt-3 mb-5">Add Member</p>

        <form onSubmit={handleFormSubmit}>
          <div className="field">
            <div className="w-full">
              <input className="input w-full text-center" value={input} onChange={handleChange} type="text" id="contact-name" placeholder="Input Email Address" />
              <p className="help-text">{error}</p>
            </div>
          </div>
          <div className="p-3  mt-2 text-center space-x-4 md:block">
            <input type="submit" value="Invite" disabled={input.toLowerCase() === user._id.toLowerCase()} />
            <button type="button" className="mb-2 md:mb-0 bg-error-500 px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-secondary rounded-full hover:shadow-lg hover:bg-error-600" onClick={closeHandler}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

InviteMember.propTypes = {
  closeHandler: PropTypes.func,
  inviteMember: PropTypes.func.isRequired,
}