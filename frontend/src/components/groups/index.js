import React, { useEffect } from 'react'
import GroupList from './group-list'
import InvitationList from './invitation-list'
import MyGroupList from './my-group-list'
import useAuth from '../../utils/useAuth'

export default function Groups() {
  const { user, refreshGroups } = useAuth()
  const [, forceUpdate] = React.useReducer(x => x + 1, 0)

  useEffect(() => refreshGroups().then(forceUpdate), [])

  return (
    <div>
      <GroupList groups={user?.groups?.filter(g => g.accepted)} />
      <div className="grid grid-cols-3 mt-6 gap-8">
        <div className="col-span-1">
          <InvitationList />
        </div>
        <div className="col-span-2">
          <MyGroupList groups={user.myGroups} />
        </div>
      </div>
    </div>
  )
}