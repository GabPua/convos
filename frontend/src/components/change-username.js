import React from 'react'
import { isValidName, usernameErrorMessage } from 'convos-validator'
import PropTypes from 'prop-types'
import app from '../utils/axiosConfig'

function ChangeUsername(props) {
  const [username, setUsername] =  React.useState(props.username)
  const [error, setError] = React.useState('')

  function handleFormSubmit(e) {
    e.preventDefault()
    const { username } = Object.fromEntries(new FormData(e.target))
    if (isValidName(username)) {
      app.post('user/updateName', { name: username })
        .then(() => {
          props.setFeedback(true, 'Changed username successfully!')
          props.changeHandler()
        })
        .catch(() => props.setFeedback(false, 'A server error was encountered.'))
    } else {
      setError(usernameErrorMessage)
    }
  }

  function handleChange(e) {
    setUsername(e.target.value)
    setError('')  
  }

  return (
    <div className="w-xl">
      <div className="text-secondary">
        <p className="font-keep-calm text-3xl text-center mt-3 mb-5">Edit Username</p>
 
        <form onSubmit={handleFormSubmit}>
          <div className="field">
            <div className="w-full">
              <input className="input w-full text-center" type="text" id="change-username" name="username" value={username} onChange={handleChange} />
              <p className="help-text">{error}</p>
            </div>
          </div>
          <div className="p-3  mt-2 text-center space-x-4 md:block">
            <button type="button" className="cancel" onClick={props.closeHandler}>Cancel</button>
            <input type="submit" value="Change Username" disabled={username === props.username} />
          </div>
        </form>
      </div>
    </div>
  )
}

ChangeUsername.propTypes = {
  username: PropTypes.string.isRequired,
  setFeedback: PropTypes.func,
  changeHandler: PropTypes.func,
  closeHandler: PropTypes.func,
}

export default ChangeUsername
