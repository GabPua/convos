import React from 'react'
import PropTypes from 'prop-types'

function Loading({ show }) {
  if (show) {
    return (
      <div className="absolute bg-white bg-opacity-80 inset-0 z-10">
        <div className="abs-center">
          <div style={ {'border-top-color': 'transparent'} }
            className="w-16 h-16 border-8 border-primary border-solid rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  return <></>
}
Loading.propTypes = {
  show: PropTypes.bool.isRequired,
}

export default Loading