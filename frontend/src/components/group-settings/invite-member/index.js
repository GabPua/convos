import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { isValidEmail } from 'convos-validator'
import useAuth from '../../../utils/useAuth'
import { Contacts, ToAdd } from './contact-lists'
import app from '../../../utils/axiosConfig'

export default function InviteMember({ members, inviteMembers, closeHandler }) {
  const [email, setEmailInput] = useState('')
  const [error, setError] = useState('')
  const { user, refreshContacts } = useAuth()
  const [contacts, setContacts] = useState([])
  const [toAdd, setToAdd] = useState([])

  useEffect(async () => {
    if (!user.contacts.length) {
      await refreshContacts()
    }
    setContacts(user.contacts.filter(x => !members.find(y => y._id == x._id)))
  }, [])

  const handleChange = e => {
    setEmailInput(e.target.value)
    setError('')
  }

  const handleFormSubmit = async e => {
    e.preventDefault()

    const value = email.toLowerCase()

    if (!isValidEmail(value)) {
      return setError('Invalid email format!')
    } else if (members.find(m => m._id == value)) {
      return setError('User already invited to or part of the group!')
    } else if (toAdd.find(m => m._id == value)) {
      return setError('User already in list to invite!')
    }

    const user = await app.get(`user/getUser/${value}`)
    if (user._id) {
      setContacts(contacts.filter(c => c._id !== user._id))
      setToAdd(toAdd.concat(user))
      setEmailInput('')
    } else {
      setError('User does not exist!')
    }
  }

  const moveToAdd = (id) => {
    let index
    const contactTemp = contacts.filter((c, i) => {
      if (c._id === id) {
        index = i
        return false
      }
      return true
    })
    setContacts(contactTemp)
    setToAdd(toAdd.concat(contacts[index]))
  }

  const moveToContacts = (id) => {
    let index
    const toAddTemp = toAdd.filter((c, i) => {
      if (c._id === id) {
        index = i
        return false
      }
      return true
    })

    setContacts(contacts.concat(toAdd[index]))
    setToAdd(toAddTemp)
  }

  const handleInviteClick = () => {
    if (toAdd.length) {
      inviteMembers(toAdd.map(c => c._id))
    } else {
      closeHandler()
    }
  }

  return (
    <div className="w-2xl">
      <div className="text-secondary">
        <p className="font-keep-calm text-3xl text-center mt-3 mb-5">Invite User</p>

        <form onSubmit={handleFormSubmit}>
          <div className="field">
            <div className="w-full relative">
              <span className="absolute text-primary w-6 top-4 right-7 cursor-pointer" onClick={handleFormSubmit}><i className="fas fa-plus fa-lg"></i></span>
              <input className="input w-full text-center" value={email} onChange={handleChange} type="text" id="contact-name" placeholder="Add by email address" />
              <p className="help-text">{error}</p>
            </div>
          </div>
        </form>
        <div className="flex h-60 items-center">
          <Contacts contacts={contacts} onClick={moveToAdd} />
          <i className="fas fa-chevron-right fa-lg mx-2 text-white"></i>
          <ToAdd contacts={toAdd} onClick={moveToContacts} />
        </div>
        <div className="p-3  mt-2 text-center space-x-4 md:block">
          <button type="button" className="cancel" onClick={closeHandler}>Cancel</button>
          <input type="submit" value="Invite" disabled={!toAdd.length} onClick={handleInviteClick}/>
        </div>
      </div>
    </div>
  )
}

InviteMember.propTypes = {
  closeHandler: PropTypes.func,
  inviteMembers: PropTypes.func.isRequired,
  members: PropTypes.array.isRequired,
}