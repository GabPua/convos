import { Link, useNavigate } from 'react-router-dom'
import React from 'react'
import { isValidEmail, isValidPassword } from 'convos-validator'
import Loading from '../components/loading'

export default function Landing() {
  let navigate = useNavigate()
  let [error, setError] = React.useState(false)
  let [loading, setLoading] = React.useState(true)

  function handleSubmit(e) {
    e.preventDefault()
    const { email, password } = Object.fromEntries(new FormData(e.target))

    if (!isValidEmail(email) || !isValidPassword(password)) {
      setError(true)
    } else {
      const _id = email.toString().trim().toLowerCase()
      fetch('/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ _id, password })
      })
        .then(res => res.json())
        .then(res => {
          if (res.result) {
            setError(false)
            navigate('/dashboard', { state: { _id } })
          } else {
            setError(true)
          }
        })
    }
  }

  // check cookie validity and login automatically
  fetch('/api/user/getUser')
    .then(res => res.json())
    .then(res => {
      if (res._id) navigate('/dashboard')
      else setLoading(false)
    })

  return (
    <div>
      <Loading show={loading} />

      <div className="flex min-h-screen items-stretch">
        <div className="w-[51vw] m-auto flex-grow-[0.25] flex-shrink-0">
          <form className="flex flex-col items-center justify-center w-3/4 max-w-[500px] m-auto" onSubmit={handleSubmit}>
            <figure className="mb-3">
              <img src="/assets/logo-purple.png" alt="Convos Logo" className="w-1/2 mb-5 m-auto" />
              <figcaption className="text-[4vw] font-medium font-keep-calm text-center">CONVOS</figcaption>
            </figure>
            <div className="field w-2/3">
              <input type="email" name="email" className="input w-full" placeholder="Email" />
            </div>
            <div className="field w-2/3">
              <input type="password" name="password" className="input w-full" placeholder="Password" />
              <p className="help-text">{error ? 'Invalid credentials' : ''}</p>
            </div>
            <input type="submit" className="btn primary max-w-sm w-1/2 text-xl mt-2" value="Log In" />
            <Link to="reset" className="text-primary mt-2 hover:text-primary-hover">Forgot your password?</Link>
          </form>
        </div>
        <div className="bg-primary shadow-2xl flex items-center flex-auto">
          <div className="flex flex-col items-center justify-center w-7/12 m-auto">
            <figure>
              <img src="/assets/speech-bubbles.png" alt="Speech bubbles" />
              <figcaption className="text-secondary font-keep-calm text-3xl text-center mt-4">Join the conversation!</figcaption>
            </figure>
            <Link to="/register" className="block w-full">
              <button className="btn primary w-1/2 text-xl mt-24 m-auto">Register</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
