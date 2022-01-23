import React from 'react'
import { useOutletContext } from 'react-router-dom'
import PropTypes from 'prop-types'
import UploadWidget from '../../components/upload-widget'
import postRequest from '../../utils/postRequest'
import Loading from '../loading'
import EditGroupDetails from './edit-group-details'

export default function Overview() {
  const { group, updateDp, updateCover, updateDetails, setModal } = useOutletContext()
  const [, forceUpdate] = React.useReducer(x => x + 1, 0)

  const handleChangeDetailsClick = () => setModal(<EditGroupDetails id={group._id} name={group.name} tag={group.tag} updateDetails={updateDetails} />)

  function handleDpChange({ url }) {
    postRequest(`/api/group/${group._id}/updatePic`, { picUri: url })
      .then(res => {
        if (res) {
          updateDp(url)
          forceUpdate()
        } else {
          console.log('An error has occured!')
        }
      })
  }

  function handleCoverChange({ url }) {
    postRequest(`/api/group/${group._id}/updateCover`, { coverUri: url })
      .then(res => {
        if (res) {
          updateCover(url)
          forceUpdate()
        } else {
          console.log('An error has occured')
        }
      })
  }

  if (group.picUri) {
    return (
      <div>
        <div className="flex justify-between mb-2">
          <p className="text-3xl font-bold">Group Overview</p>
        </div>
        <hr />
        <div className="grid grid-cols-2 place-items-center h-auto gap-y-4 mt-4" style={{ 'gridTemplateRows': 'auto' }} >
          <div className="flex justify-between items-center my-5 w-full">
            <div>
              <p className="text-xl">{group.name}</p>
              <p className="text-gray-500 capitalize">{group.tag}</p>
            </div>
            <button className="btn primary w-40 text-xl h-10" onClick={handleChangeDetailsClick}>CHANGE</button>
          </div>

          <div className="mb-4">
            <p className="text-2xl font-medium">Preview</p>
            <div className="shadow-lg rounded-lg flex flex-col items-center justify-end h-60 relative bg-no-repeat bg-contain hover:cursor-pointer pb-5 w-64" style={{ 'backgroundImage': `url(${group.coverUri})` }}>
              <img src={group.picUri} className="rounded-full w-14 border-4 border-white" alt="Group Picture" />
              <p>{group.name}</p>
              <span>
                <i className="fas fa-cog mr-1"></i>
                Settings
              </span>
            </div>
          </div>

          <p className="text-2xl font-medium">Photo</p>
          <p className="text-2xl font-medium">Banner</p>

          <img src={group.picUri} alt="Group Photo" className="rounded-full w-36" />
          <img src={group.coverUri} alt="Cover Photo" className="h-36 rounded-lg" />

          <UploadWidget id="change-dp" text="CHANGE" onSuccessHandler={handleDpChange} publicId={group._id} uploadPreset="gc_dps" aspectRatio={1} />
          <UploadWidget id="change-cover" text="CHANGE" onSuccessHandler={handleCoverChange} publicId={group._id} uploadPreset="gc_covers" aspectRatio={2} />
        </div>
      </div>
    )
  } else {
    return <Loading show={true} />
  }
}

Overview.propTypes = {
  name: PropTypes.string,
  tag: PropTypes.string,
  dpUri: PropTypes.string,
  coverUri: PropTypes.string,
}
