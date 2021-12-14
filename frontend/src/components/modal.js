import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
// eslint-disable-next-line no-unused-vars
import styles from './modal.css'

export default function Modal(props) {
  useEffect(() => {
    if (props.component == null) {
      document.removeEventListener('click', handleClick)
    } else {
      document.addEventListener('click', handleClick)
    }
    
    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [props.component])

  const node = useRef()

  const handleClick = e => {
    if (node.current.contains(e.target)) {
      return
    }

    props.closeHandler()
  }

  if (!props.component) {
    return <></>
  }

  return (
    <div className="absolute bg-black bg-opacity-80 inset-0 z-0">
      <div ref={node}
        className="w-full max-w-xl py-5 px-7 relative mx-auto my-auto rounded-xl shadow-lg  bg-primary center top-1/2 -translate-y-1/2">
        <div className="modal">{React.cloneElement(props.component, { closeHandler: props.closeHandler })}</div>
      </div>
    </div>
  )
}

Modal.propTypes = {
  component: PropTypes.node,
  closeHandler: PropTypes.func,
}