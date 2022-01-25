import React, { useEffect, useReducer, useState } from 'react'
import postRequest from './postRequest'
import PropTypes from 'prop-types'

const authContext = React.createContext()

function useAuth() {
  const [user, setUser] = useState({ contacts: [], invitations: [], groups: [], myGroups: [] })
  const [isLoading, setIsLoading] = useState(true)
  const [, forceUpdate] = useReducer(x => x + 1, 0)
  let cb = () => { }

  function setCb(cb1) {
    cb = cb1
  }

  useEffect(refreshUser, [])

  const isAuthed = (user1 = user) => !!user1?._id

  function refreshUser() {
    setIsLoading(true)
    fetch('/api/user/getUser')
      .then(res => res.json())
      .then(res => {
        setUser(Object.assign(user, res))
        forceUpdate()
        cb(isAuthed(res))
        setIsLoading(false)
      })
  }

  async function refreshContacts() {
    const res = await (await fetch('/api/contact/getContacts')).json()
    return setUser(Object.assign(user, res))
  }

  async function refreshGroups() {
    const res = await (await fetch('/api/group/all')).json()
    const groups = [], myGroups = []

    for (let i = 0; i < res.groups.length; i++) {
      (res.groups[i].admin === user._id ? myGroups : groups ).push(res.groups[i])
    }

    return setUser(Object.assign(user, { groups, myGroups, invitations: res.invitations }))
  }

  function addContact(c) {
    setUser(Object.assign(user, { contacts: user.contacts.concat(c) }))
  }

  async function login(_id, password) {
    const res = await postRequest('/api/user/login', { _id, password })
    setUser(res)
    return Object.keys(res).length !== 0
  }

  async function logout() {
    const res = await postRequest('/api/user/logout')
    setUser({})
    return res
  }

  return {
    user,
    isLoading,
    setCb,
    isAuthed,
    refreshUser,
    refreshContacts,
    refreshGroups,
    addContact,
    login,
    logout,
  }
}

export function AuthProvider({ children }) {
  const auth = useAuth()

  return (
    <authContext.Provider value={auth}>
      {children}
    </authContext.Provider>
  )
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
}

export default function AuthConsumer() {
  return React.useContext(authContext)
}
