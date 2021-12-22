import React from 'react'
import PropTypes from 'prop-types'
import postRequest from '../utils/postRequest'

export default function CloudinaryUploadWidget(props) {
  React.useEffect(async () => {
    const response = await fetch('/api/storage/details')
    const data = await response.json()

    function generateSignature(callback, paramsToSign) {
      postRequest('/api/storage/sign', paramsToSign)
        .then(signature => callback(signature))
    }

    const options = {
      cloudName: data.cloudName,
      apiKey: data.apiKey,
      uploadSignature: generateSignature,
      cropping: false,
      folder: 'user_dps',
    }

    const myWidget = window.cloudinary.createUploadWidget(options, (err, result) => {
      if (err) {
        console.log('An error has occured: ', err)
      } else if (result.event === 'success') {
        console.log('Success!\n', result)
      }
    })
    document.getElementById('upload_widget').addEventListener('click', () => myWidget.open(), false)
  }, [])

  return (
    <button id='upload_widget' className='btn primary mt-4 text-xl h-10 w-40'>
      {props.text}
    </button>
  )
}

CloudinaryUploadWidget.propTypes = {
  text: PropTypes.string.isRequired,
}