import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { isValidEmail } from 'convos-validator'
import useAuth from '../utils/useAuth'
import app from '../utils/axiosConfig'

export default function AddContact(props) {
  const [input, setInput] = useState('')
  const [error, setError] = useState('')

  const { user, addContact } = useAuth()

  const handleChange = e => {
    setInput(e.target.value)
    setError('')
  }

  const handleFormSubmit = e => {
    e.preventDefault()

    if (isValidEmail(input)) {
      app.post('contact/addContact', { contactId: input.toLowerCase() })
        .then(res => {
          if (res.err) {
            setError(res.err)
          } else {
            addContact(res.user)
            props.closeHandler()
          }
        })
    } else {
      setError('Invalid email!')
    }
  }

  return (
    <div className="w-xl">
      <div className="text-secondary">
        <p className="font-keep-calm text-3xl text-center mt-3 mb-5">Add Contact</p>

        <form onSubmit={handleFormSubmit}>
          <div className="field">
            <div className="w-full">
              <input className="input text-center w-full" value={input} onChange={handleChange} type="text" id="contact-name" placeholder="Input Email Address" />
              <p className="help-text">{error}</p>
            </div>
          </div>
          <div className="p-3 mt-2 text-center space-x-4 md:block">
            <input type="submit" value="Add" disabled={input.toLowerCase() === user._id.toLowerCase()} />
            <button type="button" className="cancel" onClick={props.closeHandler}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

AddContact.propTypes = {
  closeHandler: PropTypes.func,
}