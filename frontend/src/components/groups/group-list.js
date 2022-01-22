import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import GroupItem from './group-item'
import useAuth from '../../utils/useAuth'

export default function GroupList() {
  const { user, refreshGroups } = useAuth()
  const [, forceUpdate] = React.useReducer(x => x + 1, 0)

  useEffect(() => refreshGroups().then(forceUpdate), [])

  const groupItems = user.groups?.map(g => (
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