import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export default function Disband() {
  const { groupId } = useParams()
  const navigate = useNavigate()

  const handleDisbandClick = async () => {
    const { result } = await (await fetch(`/api/group/${groupId}`, { method: 'DELETE', })).json()
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
        <p className="text-2xl font-light">Are you sure you want to proceed?</p>
      </div>
      <button className="bg-red-500 hover:bg-error-600 transition-colors btn text-white py-2 px-10 text-xl m-auto tracking-wider"
        onClick={handleDisbandClick}>DISBAND</button>
    </div>
  )
}