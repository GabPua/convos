import React from 'react'
import { useOutletContext } from 'react-router-dom'
import PropTypes from 'prop-types'
import UploadWidget from '../../components/upload-widget'
import EditGroupDetails from './edit-group-details'
import app from '../../utils/axiosConfig'

export default function Overview() {
  const { group, updateDp, updateCover, updateDetails, setModal } = useOutletContext()
  const [, forceUpdate] = React.useReducer(x => x + 1, 0)

  const handleChangeDetailsClick = () => setModal(<EditGroupDetails id={group._id} name={group.name} tag={group.tag} updateDetails={updateDetails} />)

  function handleDpChange({ url }) {
    app.post(`group/${group._id}/updatePic`, { picUri: url })
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
    app.post(`group/${group._id}/updateCover`, { coverUri: url })
      .then(res => {
        if (res) {
          updateCover(url)
          forceUpdate()
        } else {
          console.log('An error has occured')
        }
      })
  }

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
          { group.isAdmin ? <button className="btn primary w-40 text-xl h-10" onClick={handleChangeDetailsClick}>CHANGE</button> : '' }
        </div>

        <div className="mb-4">
          <p className="text-2xl font-medium">{ group.isAdmin ? 'Preview' : '' }</p>
          <div className="shadow-lg rounded-lg flex flex-col items-center justify-end h-60 relative bg-no-repeat bg-contain hover:cursor-pointer pb-5 w-64" style={{ 'backgroundImage': `url(${group.coverUri})` }}>
            <img src={group.picUri} className="rounded-full w-14 border-4 border-white" alt="Group Picture" />
            <p className="mb-7">{group.name}</p>
          </div>
        </div>

        { group.isAdmin ? <p className="text-2xl font-medium">Photo</p> : '' }
        { group.isAdmin ? <p className="text-2xl font-medium">Banner</p> : '' }

        { group.isAdmin ? <img src={group.picUri} alt="Group Photo" className="rounded-full w-36" /> : '' }
        { group.isAdmin ? <img src={group.coverUri} alt="Cover Photo" className="h-36 rounded-lg" /> : '' }

        { group.isAdmin ? <UploadWidget id="change-dp" text="CHANGE" onSuccessHandler={handleDpChange} publicId={group._id} uploadPreset="gc_dps" aspectRatio={1} /> : '' }
        { group.isAdmin ? <UploadWidget id="change-cover" text="CHANGE" onSuccessHandler={handleCoverChange} publicId={group._id} uploadPreset="gc_covers" aspectRatio={2} /> : '' }
      </div>
    </div>
  )
}

Overview.propTypes = {
  name: PropTypes.string,
  tag: PropTypes.string,
  dpUri: PropTypes.string,
  coverUri: PropTypes.string,
}
