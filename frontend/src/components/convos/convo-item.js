import React from 'react'

export default function ConvoItem() {
  return (
    <Link to={`/groups/${id}`}>
      <div className="shadow-lg rounded-lg flex flex-col items-center justify-end h-60 relative bg-no-repeat bg-contain hover:cursor-pointer pb-5 w-64 transition-all hover:scale-105" style={{ 'backgroundImage': `url(${coverUri})` }}>
        <img src={picUri} className="rounded-full w-14 border-4 border-white" alt="Group Picture" />
        <p>{name}</p>
        <span>
          <i className="fas fa-user mr-2"></i>
          {count}
        </span>
      </div>
    </Link>
  )
}