import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import postRequest from '../utils/postRequest'
import { isValidGroupName, groupNameErrorMessage } from 'convos-validator'

export default function CreateGroup(props) {
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = () => setError('')

  const handleFormSubmit = async e => {
    e.preventDefault()

    const { groupName: name, tag } = Object.fromEntries(new FormData(e.target))

    if (isValidGroupName(name)) {
      const { result } = await postRequest('/api/group/createGroup', { name, tag })
      if (result) {
        navigate(`/groups/${result}`)
      } else {
        setError('A server error has occured!')
      }
    } else {
      setError(groupNameErrorMessage)
    }
  }

  return (
    <div>
      <div className="text-secondary">
        <p className="font-keep-calm text-3xl text-center mt-3 mb-5">Create Group</p>

        <form onSubmit={handleFormSubmit}>
          <div className="field">
            <label className="mb-6" htmlFor="group-name">Name</label>
            <div className="w-72">
              <input className="input w-full text-center" onChange={handleChange} type="text" id="group-name" name="groupName" placeholder="Input Group Name" autoComplete="off" />
              <p className="help-text">{error}</p>
            </div>
          </div>
          <div className="field">
            <label className="mb-6" htmlFor="group-tag">Tag</label>
            <div>
              <select className="w-72 p-3 text-gray-700 rounded-lg text-center text-xl cursor-pointer" id="group-tag" name="tag">
                <option value="Social">Social</option>
                <option value="School">School</option>
                <option value="Work">Work</option>
                <option value="Hobby">Hobby</option>
              </select>
            </div>
          </div>
          <div className="p-3 mt-4 text-center space-x-4 md:block">
            <input type="submit" value="Create" />
            <button type="button" className="mb-2 md:mb-0 bg-error-500 px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-secondary rounded-full hover:shadow-lg hover:bg-error-600" onClick={props.closeHandler}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

CreateGroup.propTypes = {
  closeHandler: PropTypes.func,
}