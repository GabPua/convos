import React from 'react'
import ContactItem from './contact-item'
import useAuth from '../../utils/useAuth'

export default function ContactList() {
  const { user, refreshContacts } = useAuth()
  const [, forceUpdate] = React.useReducer(x => x + 1, 0)

  React.useEffect(() => {
    refreshContacts().then(forceUpdate)
  }, [])

  const list = user.contacts?.map(c => <ContactItem key={c._id} name={c.name} dpUri={c.dpUri} />)

  return (
    <div className="p-5">
      {list}
    </div>
  )
}
