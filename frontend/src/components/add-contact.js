import React, { useState } from 'react'
import PropTypes from 'prop-types'
import postRequest from '../utils/postRequest'
import { isValidEmail } from 'convos-validator'
import useAuth from '../utils/useAuth'

export default function AddContact(props) {
  const [input, setInput] = useState('')
  const [error, setError] = useState('')

  const { user } = useAuth()

  const handleChange = e => setInput(e.target.value)

  const handleFormSubmit = e => {
    e.preventDefault()

    if (isValidEmail(input)) {
      postRequest('/api/contact/addContact', { input })
        .then(res => {
          if (res.err) {
            setError(res.err)
          } else {
            props.addContact(res.user)
            props.closeHandler()
          }
        })
    } else {
      setError('Invalid email!')
    }
  }

  return (
    <div>
      <div className="text-secondary">
        <p className="font-keep-calm text-3xl text-center mt-3 mb-5">Add Contact</p>

        <form onSubmit={handleFormSubmit}>
          <div className="field">
            <div className="w-full">
              <input className="input w-full text-center" value={input} onChange={handleChange} type="text" id="contact-name" name="contactId" placeholder="Input Email Address" />
              <p className="help-text">{error}</p>
            </div>
          </div>
          <div className="p-3  mt-2 text-center space-x-4 md:block">
            <input type="submit" value="Add" disabled={input === user._id} />
            <button type="button" className="mb-2 md:mb-0 bg-error-500 px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-secondary rounded-full hover:shadow-lg hover:bg-error-600" onClick={props.closeHandler}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

AddContact.propTypes = {
  closeHandler: PropTypes.func,
  addContact: PropTypes.func.isRequired,
}