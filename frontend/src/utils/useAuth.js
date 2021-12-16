import React, { useEffect, useState } from 'react'
import postRequest from './postRequest'
import PropTypes from 'prop-types'

const authContext = React.createContext()

function useAuth() {
  const [user, setUser] = useState({})
  
  useEffect(refreshUser, [])

  const isAuthed = () => user !== undefined && Object.keys(user).length !== 0

  function refreshUser() {
    fetch('/api/user/getUser')
      .then(res => res.json())
      .then(res => setUser(res))
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
    isAuthed,
    refreshUser,
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
