import React from 'react'
import PropTypes from 'prop-types'

function ContactItem({ _id, isAdded, name, dpUri }) {
  function handleClick() {
    console.log(_id)
  }

  return (
    <div className="flex items-center justify-between select-none hover:bg-gray-300 p-1 rounded-md" onClick={handleClick}>
      <div>
        <img className="inline-block w-8 mr-2" src={dpUri} alt="profile picture" />
        <span>{name}</span>
      </div>
      {isAdded ?
        <span className="cursor-pointer w-6">
          <i className="fas fa-times"></i>
        </span> : <></>
      }
    </div>
  )
}

ContactItem.propTypes = {
  _id: PropTypes.string.isRequired,
  isAdded: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  dpUri: PropTypes.string.isRequired,
}

export function Contacts({ contacts }) {
  return (
    <div className="h-full bg-white rounded-lg w-full p-2">
      <input className="font-light w-full p-2 border-gray-300 border rounded-lg focus:outline-none" type="search"
        placeholder="Name of contact" />
      <div className="mt-2">
        {contacts.map(c => <ContactItem key={c._id} _id={c._id} name={c.name} dpUri={c.dpUri} isAdded={false} />)}
      </div>
    </div>
  )
}

Contacts.propTypes = {
  contacts: PropTypes.array.isRequired,
}

export function ToAdd({ contacts }) {
  return (
    <div className="h-full bg-white rounded-lg w-full p-2">
      {contacts.map(c => <ContactItem key={c._id} _id={c._id} name={c.name} dpUri={c.dpUri} isAdded={true} />)}
    </div>
  )
}

ToAdd.propTypes = {
  contacts: PropTypes.array.isRequired,
}


export default {
  Contacts,
  ToAdd,
}