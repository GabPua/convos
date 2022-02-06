import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import app from '../../utils/axiosConfig'
import NavBar from './navbar'
import useAuth from  '../../utils/useAuth'

function ConvoItem({ id, topic, link, name, coverUri, picUri, deleteConvo }) {

  const handleDeleteClick = e => {
    deleteConvo(id)
    e.preventDefault()
  }

  return (
    <a
      href={link} target="_blank" rel="noreferrer"
      className="group select-none shadow-lg rounded-lg flex flex-col items-center justify-end h-64 relative bg-no-repeat bg-contain hover:cursor-pointer pb-5 w-64 transition-all hover:scale-105"
      style={{ backgroundImage: `url(${coverUri}` }}>
      <span className="absolute top-3 right-5 shadow-md" onClick={handleDeleteClick}>
        <i className="fas fa-times text-red-600"></i>
      </span>
      <img src={picUri} className="rounded-full w-14 border-4 border-white" alt="Group Picture" />
      <p className="font-medium text-lg">{topic}</p>
      <p className="-mt-1">{name}</p>
      <span>
        <i className="fas fa-user mr-2"></i>
        46
      </span>
    </a>
  )
}

ConvoItem.propTypes = {
  id: PropTypes.string.isRequired,
  topic: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  coverUri: PropTypes.string.isRequired,
  picUri: PropTypes.string.isRequired,
  deleteConvo: PropTypes.func.isRequired,
}

export default function Convos() {
  const { user, refreshConvos } = useAuth()

  const deleteConvo = async id => {
    await app.delete(`convo/${id}`)
    refreshConvos()
  }

  useEffect(refreshConvos, [])

  return (
    <div>
      <NavBar />

      <div className="grid gap-4 auto-cols-min mx-auto 2xl:grid-rows-2 w-full"
        style={{ gridTemplateColumns: 'repeat(auto-fit, 16rem)' }}>
        {user.convos?.length ?
          user.convos.map(c => <ConvoItem
            key={c._id}
            id={c._id}
            topic={c.topic}
            link={c.link}
            creator={c.creator}
            name={c.group.name}
            picUri={c.group.picUri}
            coverUri={c.group.coverUri}
            deleteConvo={deleteConvo}
          />) :
          <p>You have no convos yet!</p>}
      </div>
    </div>
  )
}