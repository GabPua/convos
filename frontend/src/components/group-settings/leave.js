import React from 'react'
import { useNavigate, useOutletContext, useParams } from 'react-router-dom'
import app from '../../utils/axiosConfig'
import useAuth from '../../utils/useAuth'

export default function Leave() {
  const { groupId } = useParams()
  const navigate = useNavigate()
  const [input, setInput] = React.useState('')
  const [newAdmin, setNewAdmin] = React.useState('')
  const { group } = useOutletContext()
  const { user } = useAuth()

  const handleInputChange = e => {
    setInput(e.target.value)
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    await app.post(`group/${groupId}/remove`, { userId: user._id, newAdmin })
    navigate('/dashboard/groups')
  }

  return (
    <form onSubmit={handleFormSubmit}>
      <div className="flex justify-between mb-2">
        <p className="text-3xl font-bold">Leave Group</p>
      </div>
      <hr />
      <div className="my-4">
        <p className="text-2xl font-light">Leaving the group will no longer make related conversations be visible to you. This process cannot be reverted.
        </p>
        <br />
        {group.admin === user._id &&
          <div className="my-4">
            <label className="text-xl font-normal" htmlFor="new-admin">New admin:</label>
            <select className="w-full p-2 cursor-pointer text-xl border border-gray-300" id="new-admin" name="newAdmin" value={newAdmin} onChange={e => setNewAdmin(e.target.value)}>
              <option value="">Select new admin</option>
              {group.members.filter(m => m.accepted && m._id !== user._id).map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
            </select>
          </div>
        }
        <div>
          <label className="text-xl font-normal" htmlFor="confirm">Please type <b>{group.name}</b> to confirm</label>
          <input className="w-full border-gray-300 border text-xl py-1 px-2" id="confirm" autoComplete="false" type="text" value={input} onChange={handleInputChange} />
        </div>
      </div>
      <button type="submit" className="bg-red-500 hover:bg-error-600 transition-colors btn text-white py-2 px-10 text-xl m-auto tracking-wider"
        disabled={input !== group.name || newAdmin === ''}>LEAVE</button>
    </form>
  )
}