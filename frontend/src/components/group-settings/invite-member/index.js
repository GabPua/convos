import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { isValidEmail } from 'convos-validator'
import useAuth from '../../../utils/useAuth'
import { Contacts, ToAdd } from './contact-lists'

export default function InviteMember({ inviteMember, closeHandler }) {
  const [email, setEmailInput] = useState('')
  const [error, setError] = useState('')
  const { user } = useAuth()
  const [contacts, setContacts] = useState([...user.contacts])
  const [toAdd, setToAdd] = useState([])

  const handleChange = e => {
    setEmailInput(e.target.value)
    setError('')
  }

  const handleFormSubmit = async e => {
    e.preventDefault()

    if (isValidEmail(email)) {
      const { error } = await inviteMember(email)
      if (error) setError(error)
    } else {
      setError('Invalid email!')
    }
  }

  const moveToAdd = (id) => {
    const i = contacts.findIndex(c => c._id === id)
    const addTemp = toAdd.concat(contacts[i])

    setContacts(contacts.splice(i, 1))
    setToAdd(addTemp)
  }

  return (
    <div>
      <div className="text-secondary">
        <p className="font-keep-calm text-3xl text-center mt-3 mb-5">Invite User</p>

        <form onSubmit={handleFormSubmit}>
          <div className="field">
            <div className="w-full">
              <input className="input w-full text-center" value={email} onChange={handleChange} type="text" id="contact-name" placeholder="Input Email Address" />
              <p className="help-text">{error}</p>
            </div>
          </div>
        </form>
        <div className="flex h-60 items-center">
          <Contacts contacts={contacts} onClick={moveToAdd} />
          <i className="fas fa-chevron-right fa-lg mx-2 text-white"></i>
          <ToAdd contacts={toAdd} />
        </div>
        <div className="p-3  mt-2 text-center space-x-4 md:block">
          <input type="submit" value="Invite" disabled={email.toLowerCase() === user._id.toLowerCase()} />
          <button type="button" className="mb-2 md:mb-0 bg-error-500 px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-secondary rounded-full hover:shadow-lg hover:bg-error-600" onClick={closeHandler}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

InviteMember.propTypes = {
  closeHandler: PropTypes.func,
  inviteMember: PropTypes.func.isRequired,
}