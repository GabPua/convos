import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import { isValidGroupName, groupNameErrorMessage, tags } from 'convos-validator'
import app from '../utils/axiosConfig'

export default function CreateGroup(props) {
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = () => setError('')

  const handleFormSubmit = async e => {
    e.preventDefault()

    const { groupName: name, tag } = Object.fromEntries(new FormData(e.target))

    if (isValidGroupName(name)) {
      const { result } = await app.post('group/createGroup', { name, tag })
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
    <div className="w-96">
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
                {tags.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="p-3 mt-4 text-center space-x-4 md:block">
            <button type="button" className="cancel" onClick={props.closeHandler}>Cancel</button>
            <input type="submit" value="Create" />
          </div>
        </form>
      </div>
    </div>
  )
}

CreateGroup.propTypes = {
  closeHandler: PropTypes.func,
}