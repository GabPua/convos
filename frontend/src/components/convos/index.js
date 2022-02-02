import React from 'react'
import NavBar from './navbar'

export default function Convos() {
  return (
    <div>
      <NavBar />

      <div className="grid gap-4 auto-cols-min mx-auto 2xl:grid-rows-2 w-full"
        style={{gridTemplateColumns: 'repeat(auto-fit, 16rem)'}}>
        <div
          className="select-none shadow-lg rounded-lg flex flex-col items-center justify-end h-64 relative bg-no-repeat bg-contain hover:cursor-pointer pb-5 w-64 transition-all hover:scale-105"
          style={{backgroundImage: 'url(./assets/gc-dp.png)'}}>
          <img src="assets/avatar.png" className="rounded-full w-14 border-4 border-white" alt="Group Picture" />
          <p className="font-medium text-lg">STADVDB Pain</p>
          <p className="-mt-1">CS Masters</p>
          <span>
            <i className="fas fa-user mr-2"></i>
            46
          </span>
        </div>
      </div>
    </div>
  )
}