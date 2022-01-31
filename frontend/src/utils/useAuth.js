import React, { useEffect, useReducer, useState } from 'react'
import PropTypes from 'prop-types'
import app from './axiosConfig'
import { io } from 'socket.io-client'

const authContext = React.createContext()

function useAuth() {
  const [user, setUser] = useState({ contacts: [], invitations: [], groups: [], myGroups: [] })
  const [socket, setSocket] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [, forceUpdate] = useReducer(x => x + 1, 0)
  let cb = () => { }

  function setCb(cb1) {
    cb = cb1
  }

  useEffect(refreshUser, [])

  const isAuthed = (user1 = user) => !!user1?._id

  const createSocketConnection = (_id) => {
    const socket = io(process.env.REACT_APP_BACKEND_SERVER, {
      auth: { _id },
      withCredentials: true,
    })
    socket.on('connect', () => console.log(socket.id))
    socket.on('connect_error', (err) => console.log(err))
    socket.on('invite', refreshGroups)
    setSocket(socket)
  }

  function refreshUser() {
    setIsLoading(true)
    app.get('user/getUser')
      .then(res => {
        setUser(Object.assign(user, res))
        forceUpdate()
        cb(isAuthed(res))
        setIsLoading(false)
        if (Object.keys(res).length && socket == null) createSocketConnection(res._id)
      })
  }

  async function refreshContacts() {
    const res = await app.get('contact/getContacts')
    return setUser(Object.assign(user, res))
  }

  async function refreshGroups() {
    console.log('refreshing gorupsss')
    const res = await app.get('group/all')
    const groups = [], myGroups = []

    for (let i = 0; i < res.groups.length; i++) {
      (res.groups[i].admin === user._id ? myGroups : groups ).push(res.groups[i])
    }

    setUser(Object.assign(user, { groups, myGroups, invitations: res.invitations }))
    return forceUpdate()
  }

  function addContact(c) {
    setUser(Object.assign(user, { contacts: user.contacts.concat(c) }))
  }

  async function login(_id, password) {
    const res = await app.post('user/login', { _id, password })
    setUser(res)
    if (Object.keys(res).length && socket == null) createSocketConnection(res._id)
    return Object.keys(res).length !== 0
  }

  async function logout() {
    const res = await app.post('user/logout')
    setUser({})
    socket?.disconnect()
    setSocket(null)
    return res
  }

  return {
    user,
    socket,
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
