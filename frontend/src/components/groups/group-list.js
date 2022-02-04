import React from 'react'
import PropTypes from 'prop-types'
import GroupItem from './group-item'

export default function GroupList({ groups }) {

  const groupItems = groups?.map(g => (
    <GroupItem key={g._id}
      id={g._id}
      picUri={g.picUri}
      coverUri={g.coverUri}
      name={g.name}
      tag={g.tag}
      count={g.memCount}
    />)
  )
  
  return (
    <div className="grid gap-4 auto-cols-min mx-auto 2xl:grid-rows-2 w-full min-h-[240px]" style={{ 'gridTemplateColumns': 'repeat(auto-fit, 16rem)' }}>
      {groupItems?.length ? groupItems : <p>You are not part of any external groups!</p>}
    </div>
  )
}

GroupList.propTypes = {
  groups: PropTypes.array,
}