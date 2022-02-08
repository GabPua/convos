import React from 'react'
import PropTypes from 'prop-types'
import app from '../utils/axiosConfig'

export default function UploadWidget({ id, text, onSuccessHandler, publicId, uploadPreset, aspectRatio  }) {

  React.useEffect(async () => {
    const data = await app.post('storage/details')

    function generateSignature(callback, paramsToSign) {
      app.post('storage/sign', paramsToSign)
        .then(signature => callback(signature))
    }

    const options = {
      cloudName: data.cloudName,
      apiKey: data.apiKey,
      publicId,
      uploadSignature: generateSignature,
      uploadPreset,
      cropping: true,
      croppingAspectRatio: aspectRatio,
      showSkipCropButton: false,
      multiple: false,
      maxFiles: 1,
      sources: ['local', 'camera', 'url'],
      clientAllowedFormats: 'image',
      styles: {
        fonts: {
          default: null,
          '"Poppins", sans-serif': {
            url: 'https://fonts.googleapis.com/css?family=Poppins',
            active: true
          }
        }
      },
    }

    const myWidget = window.cloudinary.createUploadWidget(options, (err, result) => {
      if (err) {
        console.log('An error has occured: ', err)
      } else if (result.event === 'success') {
        onSuccessHandler(result.info)
      }
    })
    document.getElementById(id)?.addEventListener('click', () => myWidget.open())
  }, [])

  return (
    <button id={id} className='btn primary mt-4 text-xl h-10 w-40'>
      {text}
    </button>
  )
}

UploadWidget.propTypes = {
  id: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  onSuccessHandler: PropTypes.func.isRequired,
  publicId: PropTypes.any,
  uploadPreset: PropTypes.string.isRequired,
  aspectRatio: PropTypes.number.isRequired,
}