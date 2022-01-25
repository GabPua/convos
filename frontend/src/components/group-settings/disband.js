import React from 'react'
import { useNavigate, useOutletContext, useParams } from 'react-router-dom'
import app from '../../utils/axiosConfig'

export default function Disband() {
  const { groupId } = useParams()
  const navigate = useNavigate()
  const [input, setInput] = React.useState('')
  const { group } = useOutletContext()

  const handleInputChange = e => {
    setInput(e.target.value)
  }

  const handleDisbandClick = async () => {
    const { result } = await app.delete(`group/${groupId}`)
    if (result === true) {
      navigate('/dashboard/groups')
    }
  }

  return (
    <div>
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
          <p className="text-xl font-normal">Please type <b>{group.name}</b> to confirm</p>
          <input className="w-full border-gray-300 border text-xl p-1 text-center" type="text" value={input} onChange={handleInputChange} />
        </div>
      </div>
      <button className="bg-red-500 hover:bg-error-600 transition-colors btn text-white py-2 px-10 text-xl m-auto tracking-wider"
        onClick={handleDisbandClick} disabled={input !== group.name}>DISBAND</button>
    </div>
  )
}