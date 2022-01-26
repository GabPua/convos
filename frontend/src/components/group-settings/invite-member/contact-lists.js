import React, { useState } from 'react'
import PropTypes from 'prop-types'

function ContactItem({ _id, isAdded, name, dpUri, clickHandler }) {
  function handleClick() {
    clickHandler(_id)
  }

  return (
    <div className="flex items-center justify-between select-none hover:bg-gray-300 p-1 rounded-md overflow-y-auto group">
      <div>
        <img className="inline-block w-8 mr-2 rounded-full" src={dpUri} alt="profile picture" />
        <span className="text-gray-700">{name}</span>
      </div>
      <span className="cursor-pointer w-6 invisible group-hover:visible disappearing" onClick={handleClick}>
        <i className={'fas disappearing ' + (isAdded ? 'fa-times text-red-500' : 'fa-arrow-right text-blue-500')}></i>
      </span>
    </div>
  )
}

ContactItem.propTypes = {
  _id: PropTypes.string.isRequired,
  isAdded: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  dpUri: PropTypes.string.isRequired,
  clickHandler: PropTypes.func.isRequired,
}

export function Contacts({ contacts, onClick }) {
  const [search, setSearch] = useState('')

  return (
    <div className="h-full bg-white rounded-lg w-full p-2">
      <input className="font-light w-full p-2 border-gray-300 border rounded-lg focus:outline-none" type="search"
        value={search} onChange={e => setSearch(e.target.value)} placeholder="Name of contact" />
      <div className="mt-2">
        {contacts
          .filter(c => { return !search ? true : c.name.toLowerCase().includes(search) })
          .map(c => <ContactItem key={c._id} _id={c._id} name={c.name} dpUri={c.dpUri} isAdded={false} clickHandler={onClick} />)}
      </div>
    </div>
  )
}

Contacts.propTypes = {
  contacts: PropTypes.array.isRequired,
  onClick: PropTypes.func.isRequired,
}

export function ToAdd({ contacts, onClick }) {
  return (
    <div className="h-full bg-white rounded-lg w-full p-2">
      {contacts.map(c => <ContactItem key={c._id} _id={c._id} name={c.name} dpUri={c.dpUri} isAdded={true} clickHandler={onClick} />)}
    </div>
  )
}

ToAdd.propTypes = {
  contacts: PropTypes.array.isRequired,
  onClick: PropTypes.func.isRequired,
}


export default {
  Contacts,
  ToAdd,
}