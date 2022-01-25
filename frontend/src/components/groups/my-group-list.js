import React from 'react'
import PropTypes from 'prop-types'
import GroupItem from './group-item'

export default function MyGroupList({ groups }) {
  return (
    <div>
      <p className="text-2xl">My Created Groups</p>
      <hr className="mb-2" />
      <div className="grid auto-cols-min grid-flow-col gap-4 w-full overflow-x-scroll" style={{ 'gridTemplateColumns': 'repeat(auto-fit, 16rem)'}}>
        {groups?.map(g => <GroupItem key={g._id} id={g._id} name={g.name} count={g.members} picUri={g.picUri} coverUri={g.coverUri} />)}
      </div>
    </div>
  )
}

MyGroupList.propTypes = {
  groups: PropTypes.array.isRequired,
}