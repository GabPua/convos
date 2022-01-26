import React from 'react'
import PropTypes from 'prop-types'
import { useOutletContext } from 'react-router-dom'
import RemoveMember from './remove-member'
import InviteMember from './invite-member'

function MemberItem({ id, name, dpUri }) {
  const { setModal, removeMember, group: { admin, isAdmin } } = useOutletContext()

  let elem = <></>
  let btn = (
    <i className="text-error-500 invisible group-hover:visible fas fa-times fa-lg hover:text-error-600"
      onClick={() => setModal(<RemoveMember id={id} name={name} dpUri={dpUri} removeMember={removeMember} />)}></i>
  )

  if (id === admin) {
    elem = (<span className="text-xl ml-2 text-gray-400">(Admin)</span>)
    btn = <></>
  }

  return (
    <div className="flex justify-between items-center hover:bg-gray-200 rounded-2xl cursor-pointer select-none my-2 p-2 group transition-colors">
      <div>
        <img src={dpUri} alt="dp" className="inline mr-4 w-12 rounded-full" />
        <span className="text-xl">{name}</span>
        {elem}
      </div>
      {isAdmin ?
        <span className="mx-4">
          {btn}
        </span> : <></>
      }
    </div>
  )
}

MemberItem.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  dpUri: PropTypes.string.isRequired,
}

export default function Members() {
  const { group: { members, isAdmin }, inviteMembers, setModal } = useOutletContext()
  const handleAddClick = () => setModal(<InviteMember inviteMembers={inviteMembers} members={members} />)

  return (
    <div>
      <div className="flex justify-between mb-2">
        <p className="text-3xl font-bold">Group Members</p>
        {isAdmin ? <i className="fas fa-2x fa-user-plus text-primary cursor-pointer hover:text-primary-hover" onClick={handleAddClick}></i> : <></>}
      </div>
      <hr />
      <div className="overflow-y-scroll px-2">
        {members?.map(m => <MemberItem key={m._id} id={m._id} name={m.name} dpUri={m.dpUri} />)}
      </div>
    </div>
  )
}
