import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import GroupItem from './group-item'

export default function GroupList() {
  const [groups, setGroups] = useState([])

  useEffect(async () => {
    const result = await (await fetch('/api/group/all')).json()
    console.log(result)
    setGroups(result)
  }, [])

  const groupItems = groups.map(g => (
    <GroupItem key={g._id}
      id={g._id}
      picUri={g.picUri}
      coverUri={g.coverUri}
      name={g.name}
      tag={g.tag}
      count={g.members}
    />)
  )

  if (groupItems.length) {
    return (
      <div className="grid gap-4 auto-cols-min mx-auto" style={{ 'gridTemplateColumns': 'repeat(auto-fit, 16rem)' }}>
        {groupItems}
      </div>
    )
  }

  return (
    <p>You have no groups!</p>
  )
}

GroupList.propTypes = {
  handleChangeClick: PropTypes.func,
}