import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import app from '../../utils/axiosConfig'
import NavBar from './navbar'
import useAuth from '../../utils/useAuth'

function ConvoItem({ id, topic, link, name, creator, coverUri, count, picUri, deleteConvo }) {
  const { user: { _id }, updateConvoCount } = useAuth()

  const handleLinkClick = async () => {
    const { result, count } = await app.post(`convo/join/${id}`)

    if (result) {
      updateConvoCount(id, count)
    }
  }

  const handleDeleteClick = e => {
    deleteConvo(id)
    e.preventDefault()
  }

  return (
    <a
      href={link} target="_blank" rel="noreferrer" onClick={handleLinkClick}
      className="group select-none shadow-lg rounded-lg flex flex-col items-center justify-end h-64 relative bg-no-repeat bg-contain hover:cursor-pointer pb-5 w-64 transition-all hover:scale-105"
      style={{ backgroundImage: `url(${coverUri}` }}>
      {creator === _id &&
        <span className="absolute top-3 w-6 h-6 right-3 invisible group-hover:visible
         text-red-600 hover:text-red-200 text-center" onClick={handleDeleteClick}>
          <i className="fas fa-times"></i>
        </span>
      }
      <img src={picUri} className="rounded-full w-14 border-4 border-white" alt="Group Picture" />
      <p className="font-medium text-lg">{topic}</p>
      <p className="-mt-1">{name}</p>
      <span>
        <i className="fas fa-user mr-2"></i>
        {count}
      </span>
    </a>
  )
}

ConvoItem.propTypes = {
  id: PropTypes.string.isRequired,
  topic: PropTypes.string.isRequired,
  creator: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  coverUri: PropTypes.string.isRequired,
  picUri: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  deleteConvo: PropTypes.func.isRequired,
}

export default function Convos() {
  const { user, refreshConvos } = useAuth()
  const [tag, setTag] = useState('')
  const [search, setSearch] = useState('')

  const deleteConvo = async id => {
    await app.delete(`convo/${id}`)
    refreshConvos()
  }

  const handleNavClick = tag => setTag(tag.toLowerCase())
  const handleSearch = e => setSearch(e.target.value.toLowerCase())

  useEffect(refreshConvos, [])

  let convos = user?.convos

  if (convos) {
    if (tag) convos = convos.filter(c => c.group.tag === tag)
    if (search) convos = convos.filter(c => c.group.name.toLowerCase().includes(search) || c.topic.toLowerCase().includes(search))
  }

  return (
    <div>
      <NavBar handleNavClick={handleNavClick} selectedTag={tag} onSearchChange={handleSearch} />
      <div className="grid gap-4 auto-cols-min mx-auto 2xl:grid-rows-2 w-full"
        style={{ gridTemplateColumns: 'repeat(auto-fit, 16rem)' }}>
        {convos?.length ? convos.map(c => <ConvoItem
          key={c._id}
          id={c._id}
          topic={c.topic}
          link={c.link}
          creator={c.creator}
          name={c.group.name}
          picUri={c.group.picUri}
          coverUri={c.group.coverUri}
          count={c.count}
          deleteConvo={deleteConvo}
        />) : <p>No convos found!</p>}
      </div>
    </div>
  )
}