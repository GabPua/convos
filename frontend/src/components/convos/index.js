import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import app from '../../utils/axiosConfig'
import NavBar from './navbar'

function ConvoItem({ topic, link, name, coverUri, picUri }) {
  return (
    <a
      href={link} target="_blank" rel="noreferrer"
      className="select-none shadow-lg rounded-lg flex flex-col items-center justify-end h-64 relative bg-no-repeat bg-contain hover:cursor-pointer pb-5 w-64 transition-all hover:scale-105"
      style={{ backgroundImage: `url(${coverUri}` }}>
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
  topic: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  coverUri: PropTypes.string.isRequired,
  picUri: PropTypes.string.isRequired,
}

export default function Convos() {
  const [convos, setConvos] = useState()

  useEffect(async () => {
    const { convos } = await app.get('convo/all')
    setConvos(convos)
  }, [])

  return (
    <div>
      <NavBar />

      <div className="grid gap-4 auto-cols-min mx-auto 2xl:grid-rows-2 w-full"
        style={{ gridTemplateColumns: 'repeat(auto-fit, 16rem)' }}>
        {convos?.length ?
          convos.map(c => <ConvoItem
            key={c._id}
            topic={c.topic}
            link={c.link}
            creator={c.creator}
            name={c.group.name}
            picUri={c.group.picUri}
            coverUri={c.group.coverUri}
          />) :
          <p>You have no convos yet!</p>}
      </div>
    </div>
  )
}