import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { isBlank } from 'convos-validator'
import app from '../utils/axiosConfig'
import useAuth from '../utils/useAuth'

export default function CreateConvo(props) {
  const [error, setError] = useState('')
  const { user: { groups, myGroups }, refreshConvos } = useAuth()

  const handleChange = () => setError({})

  const handleFormSubmit = async e => {
    e.preventDefault()

    const { groupName: groupId, topic, link } = Object.fromEntries(new FormData(e.target))
    const error = {}

    if (isBlank(topic)) {
      error.topic = 'Topic cannot be blank!'
    }
    
    if (isBlank(link)) {
      error.url = 'Link cannot be blank!'
    }

    setError(error)
    if (!Object.keys(error).length) {
      const { result, err } = await app.post(`/convo/${groupId}/startConvo`, { topic, link })

      if (result) {
        props.setFeedback(true, 'A convo was started!')
        refreshConvos()
      } else {
        props.setFeedback(false, err)
      }
    }
  }

  return (
    <div className="w-96">
      <div className="text-secondary">
        <p className="font-keep-calm text-3xl text-center mt-3 mb-5">Create Convo</p>

        <form onSubmit={handleFormSubmit}>
          <div className="field">
            <label className="mb-3" htmlFor="group-name">Group</label>
            <div className="w-72">
              <select className="input w-full text-center" onChange={handleChange} type="text" id="group-name" name="groupName">
                {groups.filter(g => g.accepted).concat(myGroups).map(g => <option key={g._id} value={g._id}>{g.name}</option>)}
              </select>
            </div>
          </div>
          <div className="field">
            <label className="mb-6" htmlFor="convo-topic">Topic</label>
            <div className="w-72">
              <input type="text" className="input w-full text-gray-700 text-center" id="convo-topic" name="topic" />
              <p className="help-text">{error.topic}</p>
            </div>
          </div>
          <div className="field">
            <label className="mb-6" htmlFor="convo-link">Link</label>
            <div className="w-72">
              <input type="url" className="input w-full text-gray-700 text-center" id="convo-link" name="link" />
              <p className="help-text">{error.url}</p>
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

CreateConvo.propTypes = {
  closeHandler: PropTypes.func,
  setFeedback: PropTypes.func,
}