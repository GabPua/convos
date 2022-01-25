import React from 'react'
import PropTypes from 'prop-types'
import useAuth from '../../utils/useAuth'

function Invitation({ name, picUri }) {
  return (
    <div className="py-2 px-4 hover:bg-gray-200 group rounded-lg">
      <div className="flex justify-between transition-colors">
        <div className="flex items-center">
          <img className="rounded-max w-12 mr-4" src={picUri} alt="Group Photo" />
          <span className="text-xl">{name}</span>
        </div>
        <div className="flex items-center invisible group-hover:visible">
          <span className="w-8 text-center mx-2">
            <i className="fas fa-check fa-2x scale-90 text-green-600 cursor-pointer"></i></span>
          <span className="w-8 text-center mx-2">
            <i className="fas fa-times fa-2x scale-90 text-red-600 cursor-pointer"></i></span>
        </div>
      </div>
    </div>
  )
}

Invitation.propTypes = {
  name: PropTypes.string.isRequired,
  picUri: PropTypes.string.isRequired,
}

export default function InvitationList() {
  const { user: { invitations } } = useAuth()

  return (
    <div>
      <p className="text-2xl">Invitations</p>
      <hr className="mb-2" />
      <div className="overflow-y-scroll max-h-[250px]">
        {invitations?.map(i => <Invitation key={i._id} id={i._id} name={i.name} picUri={i.picUri} />)}
      </div>
    </div>
  )
}