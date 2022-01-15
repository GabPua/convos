import React from 'react'
import PropTypes from 'prop-types'
// import GroupItem from './group-item'

export default function GroupList() {
  // const groupItems = groups.map(g => <GroupItem key={g.id} props={g} />)

  return (
    <div className="grid gap-4 auto-cols-min mx-auto" style={{'gridTemplateColumns': 'repeat(auto-fit, 16rem)'}}>
      {/* {groupItems} */}
    </div>
  )
}

GroupList.propTypes = {
  handleChangeClick: PropTypes.func,
}