import React from 'react'
import { isValidName } from 'convos-validator'
import PropTypes from 'prop-types'
import postRequest from '../utils/postRequest'

function ChangeUsername(props) {
  const [error, setError] = React.useState('')

  function handleFormSubmit(e) {
    e.preventDefault()
    const { username } = Object.fromEntries(new FormData(e.target))
    if (isValidName(username)) {
      postRequest('/api/user/updateName', { name: username })
    } else {
      setError('Invalid username!') // TODO: better error message
    }
  }

  function clearError() {
    setError('')
  }

  return (
    <div>
      <div className="text-secondary">
        <p className="font-keep-calm text-3xl text-center mt-3 mb-5">Edit Username</p>
 
        <form onSubmit={handleFormSubmit}>
          <div className="field">
            <div className="w-full">
              <input className="input w-full text-center" type="text" id="change-username" name="username" defaultValue={props.username} onChange={clearError} />
              <p className="help-text">{error}</p>
            </div>
          </div>
          <div className="p-3  mt-2 text-center space-x-4 md:block">
            <button type="submit" className="mb-2 md:mb-0 bg-white px-5 py-2 text-sm shadow-sm font-medium tracking-wider border text-gray-600 rounded-full hover:shadow-lg hover:bg-gray-100"> Submit </button>
          </div>
        </form>
      </div>
    </div>
  )
}

ChangeUsername.propTypes = {
  username: PropTypes.string.isRequired,
}

export default ChangeUsername
