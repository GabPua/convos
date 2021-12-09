import React from 'react'


export default function ChangePassword() {
  return (
    <div className="text-secondary">
      <p className="font-keep-calm text-3xl text-center mt-3 mb-10">Change Password</p>
      <form>
        <div className="field">
          <label htmlFor="old-password" className="mb-6">Old Password</label>
          <div>
            <input className="input" type="text" id="old-password" name="oldPassword" />
            <p className="help-text">Sample</p>
          </div>
        </div>
        <div className="field">
          <label htmlFor="new-password">New Password</label>
          <div>
            <input className="input" type="password" id="new-password" name="newPassword" />
          </div>
        </div>
        <div className="field">
          <label htmlFor="confirm-password" className="mb-6">Confirm Password</label>
          <div>
            <input className="input" type="password" id="confirm-password" name="confirmPassword" />
            <p className="help-text">Sample</p>
          </div>
        </div>
        <div className="p-3  mt-2 text-center space-x-4 md:block">
          <button type="submit" className="mb-2 md:mb-0 bg-white px-5 py-2 text-sm shadow-sm font-medium tracking-wider border text-gray-600 rounded-full hover:shadow-lg hover:bg-gray-100">
            Submit
          </button>
        </div>
      </form>
    </div>
  )
}
