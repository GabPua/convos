import React, { useState } from 'react'
import PropTypes from 'prop-types'
import postRequest from '../utils/postRequest'
import { isValidEmail } from 'convos-validator'

export default function AddContact(props) {
  const [error, setError] = useState('')

  const handleFormSubmit = e => {
    e.preventDefault()
    const { contactId } = Object.fromEntries(new FormData(e.target))

    if (isValidEmail(contactId)) {
      postRequest('/api/contact/addContact', { contactId })
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
              <input className="input w-full text-center" type="text" id="contact-name" name="contactId" />
              <p className="help-text">{error}</p>
            </div>
          </div>
          <div className="p-3  mt-2 text-center space-x-4 md:block">
            <input type="submit" className="mb-2 md:mb-0 bg-white px-5 py-2 text-sm shadow-sm font-medium tracking-wider border text-gray-600 rounded-full hover:shadow-lg hover:bg-gray-100" value="Add" />
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