import React from 'react'

export default function AddContact() {
  return (
    <div>
      <div className="text-secondary">
        <p className="font-keep-calm text-3xl text-center mt-3 mb-5">Add Contact</p>

        <form>
          <div className="field">
            <div className="w-full">
              <input className="input w-full text-center" type="text" id="contact-name" name="contactName" />
              <p className="help-text">Sample</p>
            </div>
          </div>
          <div className="p-3  mt-2 text-center space-x-4 md:block">
            <button type="submit" className="mb-2 md:mb-0 bg-white px-5 py-2 text-sm shadow-sm font-medium tracking-wider border text-gray-600 rounded-full hover:shadow-lg hover:bg-gray-100">ADD</button>
          </div>
        </form>
      </div>
    </div>
  )
}