import React, { useEffect, useState } from 'react'
import postRequest from './postRequest'
import PropTypes from 'prop-types'

const authContext = React.createContext()

function useAuth() {
  const [user, setUser] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  let cb = () => {}

  function setCb(cb1) {
    cb = cb1
  }
  
  useEffect(refreshUser, [])

  const isAuthed = (user1 = user) => user1 !== undefined && Object.keys(user1).length !== 0

  function refreshUser() {
    fetch('/api/user/getUser')
      .then(res => res.json())
      .then(res => {
        setUser(res)
        setIsLoading(false)
        cb(isAuthed(res))
      })
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
