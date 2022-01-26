import React from 'react'
import { isValidPassword, passwordErrorMessage } from 'convos-validator'
import PropTypes from 'prop-types'
import app from '../utils/axiosConfig'

function ChangePassword(props) {
  const [error, setError] = React.useState({})

  function handleSubmit(e) {
    e.preventDefault()
    const { oldPassword, newPassword, confirmPassword } = Object.fromEntries(new FormData(e.target))
    const errors = {}

    if (isValidPassword(newPassword)) {
      if (newPassword !== confirmPassword) {
        errors.new = 'Passwords do not match'
      }
    } else {
      errors.new = passwordErrorMessage
    }

    setError(errors)

    if (!errors.new) {
      app.post('user/changePassword', { oldPassword, newPassword })
        .then(res => {
          if (res.result) {
            props.setFeedback(true, 'Password was changed successfully!')
          } else {
            setError(res)
          }
        })
    }
  }

  return (
    <div className="text-secondary">
      <p className="font-keep-calm text-3xl text-center mt-3 mb-10">Change Password</p>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="old-password" className="mb-6">Old Password</label>
          <div className="w-72">
            <input className="input" type="password" id="old-password" name="oldPassword" />
            <p className="help-text">{error.old}</p>
          </div>
        </div>
        <div className="field">
          <label htmlFor="new-password">New Password</label>
          <div className="w-72">
            <input className="input" type="password" id="new-password" name="newPassword" />
          </div>
        </div>
        <div className="field">
          <label htmlFor="confirm-password" className="mb-6">Confirm Password</label>
          <div className="w-72">
            <input className="input" type="password" id="confirm-password" name="confirmPassword" />
            <p className="help-text">{error.new}</p>
          </div>
        </div>
        <div className="p-3  mt-2 text-center space-x-4 md:block">
          <input type="submit" value="Change Password" className="mb-2 md:mb-0 bg-white px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-gray-600 rounded-full hover:shadow-lg hover:text-gray-900" />
          <button type="button" className="mb-2 md:mb-0 bg-error-500 px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-secondary rounded-full hover:shadow-lg hover:bg-error-600" onClick={props.closeHandler}>Cancel</button>
        </div>
      </form>
    </div>
  )
}

ChangePassword.propTypes = {
  closeHandler: PropTypes.func,
  setFeedback: PropTypes.func,
}

export default ChangePassword
