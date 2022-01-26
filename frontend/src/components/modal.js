import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
// eslint-disable-next-line no-unused-vars
import styles from './modal.css'

export default function Modal(props) {
  useEffect(() => {
    if (props.component == null) {
      document.removeEventListener('click', handleClick)
      document.removeEventListener('keydown', handleEscapePress)
    } else {
      document.addEventListener('click', handleClick)
      document.addEventListener('keydown', handleEscapePress)
    }
    
    return () => {
      document.removeEventListener('click', handleClick)
      document.removeEventListener('keydown', handleEscapePress)
    }
  }, [props.component])

  const node = useRef()

  const handleClick = e => {
    if (node.current?.contains(e.target)) {
      return
    }
    props.closeHandler()
  }

  const handleEscapePress = e => {
    if (e.key === 'Escape') {
      props.closeHandler()
    }
  }

  if (!props.component) {
    return <></>
  }

  return (
    <div className="absolute bg-black bg-opacity-80 inset-0 z-0">
      <div ref={node}
        className="w-full max-w-2xl py-5 px-7 relative mx-auto my-auto rounded-xl shadow-lg  bg-primary center top-1/2 -translate-y-1/2">
        <div className="modal">{React.cloneElement(props.component, { closeHandler: props.closeHandler, setFeedback: props.setFeedback, changeHandler: props.changeHandler })}</div>
      </div>
    </div>
  )
}

Modal.propTypes = {
  component: PropTypes.node,
  closeHandler: PropTypes.func,
  setFeedback: PropTypes.func,
  changeHandler: PropTypes.func,
}
