import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import useAuth from '../../utils/useAuth'
import app from '../../utils/axiosConfig'

function Invitation({ acceptInvitation, rejectInvitation, id, name, picUri }) {
  const handleAcceptClick = () => acceptInvitation(id)
  const handleRejectClick = () => rejectInvitation(id)

  return (
    <div className="py-2 px-4 hover:bg-gray-200 group rounded-lg">
      <div className="flex justify-between transition-colors">
        <div className="flex items-center">
          <img className="rounded-full w-12 mr-4" src={picUri} alt="Group Photo" />
          <span className="text-xl">{name}</span>
        </div>
        <div className="flex items-center invisible group-hover:visible">
          <span className="w-8 text-center mx-2 cursor-pointer" onClick={handleAcceptClick}>
            <i className="fas fa-check fa-2x scale-90 text-green-600"></i>
          </span>
          <span className="w-8 text-center mx-2 cursor-pointer group-foo" onClick={handleRejectClick}>
            <i className="fas fa-times fa-2x scale-90 text-red-600"></i>
          </span>
        </div>
      </div>
    </div>
  )
}

Invitation.propTypes = {
  name: PropTypes.string.isRequired,
  picUri: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  acceptInvitation: PropTypes.func.isRequired,
  rejectInvitation: PropTypes.func.isRequired,
}

export default function InvitationList() {
  const { user: { groups }, refreshGroups } = useAuth()
  const [invitations, setInvitations] = useState()

  useEffect(() => setInvitations(groups?.filter(g => !g.accepted)), [groups])

  function acceptInvitation(id) {
    app.post(`group/${id}/add`)
      .then(res => {
        if (res.result) {
          refreshGroups()
        } else {
          console.log(res.error)
        }
      })
  }

  function rejectInvitation(id) {
    app.delete(`user/reject/${id}`)
      .then(res => {
        if (res.result) {
          refreshGroups()
        } else {
          console.log(res.error)
        }
      })
  }

  return (
    <div>
      <p className="text-2xl">Invitations</p>
      <hr className="mb-2" />
      { invitations?.length ?
        <div className="overflow-y-scroll max-h-[250px]">
          {invitations?.map(i => <Invitation
            key={i._id}
            id={i._id}
            name={i.name}
            picUri={i.picUri}
            acceptInvitation={acceptInvitation}
            rejectInvitation={rejectInvitation}
          />)}
        </div> : <p>No invitations here!</p>
      }
    </div>
  )
}