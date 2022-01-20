import React from 'react'

export default function Members() {
  return (

    <div>
      <div className="flex justify-between mb-2">
        <p className="text-3xl font-bold">Group Members</p>
        <i className="fas fa-2x fa-user-plus text-primary cursor-pointer hover:text-primary-hover"></i>
      </div>
      <hr />
      <div className="overflow-y-scroll px-2">
        <div className="flex justify-between items-center hover:bg-gray-200 rounded-2xl cursor-pointer select-none my-2 p-2 group transition-colors">
          <div>
            <img src="./assets/hans.png" alt="Hans dp" className="inline mr-4" />
            <span className="text-xl">SPADE</span>
          </div>
          <span className="mx-4">
            <i className="text-error-500 invisible group-hover:visible fas fa-times fa-lg hover:text-error-600"></i>
          </span>
        </div>
      </div>
    </div>
  )
}