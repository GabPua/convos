import { Link, useNavigate } from 'react-router-dom'
import React from 'react'
import { isValidEmail, isValidName, isValidPassword } from 'convos-validator'
import postRequest from '../utils/postRequest'

export default function Register() {
  let navigate = useNavigate()
  let [error, setError] = React.useState({})

  function handleSubmit(e) {
    e.preventDefault()
    const { email, name, password, confirm } = Object.fromEntries(new FormData(e.target))
    let tempError = {}

    if (!isValidName(name)) { tempError.name = 'Invalid name' }

    if (!isValidPassword(password)) {
      tempError.password = 'Invalid password'
    } else if (password !== confirm) {
      tempError.password = 'Passwords do not match'
    }

    if (!isValidEmail(email)) {
      tempError.email = 'Invalid email'
      setError(tempError)
    } else {
      fetch(`/api/user/checkEmail?_id=${encodeURIComponent(email.toString().toLowerCase())}`)
        .then(res => res.json())
        .then(res => {
          if (!res.result) tempError.email = 'Email is taken'

          if (Object.keys(tempError).length) {
            setError(tempError)
          } else {
            createAccount(email.toString().toLowerCase(), name, password)
          }
        })
    }
  }

  function createAccount(_id, name, password) {
    postRequest('/api/user/register', { _id, name, password })
      .then(res => {
        if (res.result) {
          navigate('/dashboard', { state: { _id: res.result._id } })
        } else {
          alert('An error was encountered!')
        }
      })
      .catch(e => alert(e))
  }

  return (
    <div className="flex min-h-screen items-stretch">
      <div className="w-[51vw] flex-grow-[0.25] flex-shrink-0 bg-primary shadow-2xl min-h-screen flex flex-col justify-center">
        <div className="flex flex-col items-center justify-center">
          <figure className="mb-5">
            <img src="/assets/logo-white.png" alt="Convos Logo" className="mb-10 m-auto" />
            <figcaption className="text-8xl font-medium font-keep-calm text-secondary">CONVOS</figcaption>
          </figure>
          <Link to="/" className="block w-full">
            <button className="btn primary max-w-sm w-1/2 font-medium text-xl mt-3 m-auto">Log In</button>
          </Link>
        </div>
      </div>
      <div className="flex-auto">
        <form className="flex flex-col items-center justify-center h-full w-5/6 m-auto" onSubmit={handleSubmit}>
          <div className="field w-5/6 lg:w-3/4">
            <input type="email" name="email" className="input max-w-lg w-full" placeholder="Email" />
            <p className="help-text">{error.email}</p>
          </div>
          <div className="field w-5/6 lg:w-3/4">
            <input type="text" name="name" className="input max-w-lg w-full" placeholder="Display name" />
            <p className="help-text">{error.name}</p>
          </div>
          <div className="field w-5/6 lg:w-3/4">
            <input type="password" name="password" className="input max-w-lg w-full" placeholder="Password" />
          </div>
          <div className="field w-5/6 lg:w-3/4">
            <input type="password" name="confirm" className="input max-w-lg w-full" placeholder="Confirm password" />
            <p className="help-text">{error.password}</p>
          </div>
          <input type="submit" className="btn primary w-full max-w-sm font-medium text-xl mt-12" value="Register" />
        </form>
      </div>
    </div>
  )
}
