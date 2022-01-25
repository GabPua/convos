import React from 'react'
import { useOutletContext } from 'react-router-dom'
import ChangePassword from '../components/change-password'
import EditUsername from '../components/change-username'
import AddContact from '../components/add-contact'
import postRequest from '../utils/postRequest'
import ContactList from '../components/contacts/contact-list'
import UploadWidget from './upload-widget'
import useAuth from '../utils/useAuth'
import Loading from '../components/loading'

export default function AccountDetails() {
  const { user, refreshUser, isLoading } = useAuth()
  const handleChangeClick = useOutletContext()

  function handleDpChange(result) {
    postRequest('/api/user/updateDp', { dpUri: result.url })
      .then(res => {
        if (res) {
          refreshUser()
        } else {
          console.log('An error has occured!')
        }
      })
  }

  return (
    <div className="min-h-full grid grid-cols-3 grid-rows-5 items-center">
      <div className="col-span-1 row-span-2 flex flex-col justify-center items-center place-self-center">
        <div className="relative">
          <img src={user.dpUri} alt="Profile Picture" className="w-60 rounded-full" />
          <Loading show={isLoading} />
        </div>
        <UploadWidget id="upload-widget" text="CHANGE" onSuccessHandler={handleDpChange} publicId={user._id} aspectRatio={1} uploadPreset="user_dps" />
      </div>
      <div className="col-span-2 row-span-2 w-full max-w-2xl">
        <p className="text-3xl">Account Details</p>
        <hr className="border-gray-300" />
        <div className="my-5">
          <p className="text-xl">Email address</p>
          <p className="underline text-gray-500">{user._id}</p>
        </div>
        <div className="flex justify-between items-center my-5">
          <div>
            <p className="text-xl">Name</p>
            <p className="text-gray-500">{user.name}</p>
          </div>
          <button className="btn primary w-40 text-xl h-10" onClick={e => handleChangeClick(<EditUsername username={user.name} />, e)}>CHANGE</button>
        </div>
        <div className="flex justify-between items-center my-5">
          <div>
            <p className="text-xl">Password</p>
            <p className="text-gray-500">***************</p>
          </div>
          <button className="btn primary w-40 text-xl h-10" onClick={e => handleChangeClick(<ChangePassword />, e)}>CHANGE</button>
        </div>
      </div>
      <div className="col-span-2 xl:col-span-1 row-span-3 items-start self-start place-self-center w-3/4 min-w-min mt-4 2nxl:mt-0">
        <div className="flex justify-between items-center">
          <p className="text-3xl">Contacts</p>
          <i className="fas fa-lg fa-user-plus text-primary cursor-pointer hover:text-primary-hover" onClick={e => handleChangeClick(<AddContact />, e)}></i>
        </div>
        <hr className="border-gray-300" />
        <ContactList />
      </div>
    </div>
  )
}
