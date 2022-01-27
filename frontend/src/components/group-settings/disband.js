import React from 'react'
import { useNavigate, useOutletContext, useParams } from 'react-router-dom'
import app from '../../utils/axiosConfig'
import useAuth from '../../utils/useAuth'

export default function Disband() {
  const { groupId } = useParams()
  const navigate = useNavigate()
  const [input, setInput] = React.useState('')
  const { group } = useOutletContext()
  const { user } = useAuth()

  const handleInputChange = e => {
    setInput(e.target.value)
  }

  const handleDisbandClick = async (e) => {
    e.preventDefault()
    const { result } = await app.delete(`group/${groupId}`)
    if (result) {
      navigate('/dashboard/groups')
    }
  }

  React.useEffect(() => { if (user._id !== group.admin) navigate('..') }, [])

  return (
    <form>
      <div className="flex justify-between mb-2">
        <p className="text-3xl font-bold">Disband Group</p>
      </div>
      <hr />
      <div className="my-4">
        <p className="text-2xl font-light">Disbanding the group will remove all members of the group. Conversations from the group will no longer be
          visible to anyone. This process cannot be reverted.
        </p>
        <br />
        <div>
          <label className="text-xl font-normal" htmlFor="confirm">Please type <b>{group.name}</b> to confirm</label>
          <input className="w-full border-gray-300 border text-xl py-1 px-2" id="confirm" autoComplete="false" type="text" value={input} onChange={handleInputChange} />
        </div>
      </div>
      <button className="bg-red-500 hover:bg-error-600 transition-colors btn text-white py-2 px-10 text-xl m-auto tracking-wider"
        onClick={handleDisbandClick} disabled={input !== group.name}>DISBAND</button>
    </form>
  )
}