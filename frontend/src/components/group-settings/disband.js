import React from 'react'

export default function Disband() {
  const handleDisandClick = () => {
    alert('Group deleted!') // TODO: fix
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
        onClick={handleDisandClick}>DISBAND</button>
    </div>
  )
}