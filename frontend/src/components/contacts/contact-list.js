import React from 'react'
import PropTypes from 'prop-types'
import ContactItem from './contact-item'

export default function ContactList({ contacts }) {
  const list = contacts.map(c => <ContactItem key={c._id} name={c.name} dpUri={c.dpUri} />)

  return (
    <div className="p-5">
      {list}
    </div>
  )
}

ContactList.propTypes = {
  contacts: PropTypes.array.isRequired,
}