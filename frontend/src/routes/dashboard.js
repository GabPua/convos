import React from 'react'
// eslint-disable-next-line no-unused-vars
import styles from '../dashboard.css'
import Modal from '../components/modal'
import ChangePassword from '../components/change-password'

export default class Dashboard extends React.Component {
  state = {
    user: {},
    modal: null,
  }

  componentDidMount = () => {
    fetch('/api/user/getUser')
      .then(res => res.json())
      .then(res => {
        this.setState({ user: res })
      })
  }

  handleChangeClick = (component, event) => {
    event.preventDefault()
    this.setState({ modal: component }, () => { document.addEventListener('click', this.closeMenu) })
  }

  closeModal = () => {
    this.setState({ modal: null }, () => { document.removeEventListener('click', this.closeModal) })
  }

  render() {
    return (
      <div>
        <header className="bg-primary fixed w-full">
          <nav className="max-w-screen-2xl p-2 flex items-stretch h-16 m-auto">
            <div className="flex flex-shrink-0 items-center">
              <img src="/assets/logo-white.png" alt="Convos Logo" className="w-[50px] inline-block mr-3" />
              <span className="heavy text-secondary text-3xl font-keep-calm align-middle">CONVOS</span>
            </div>
            <div className="flex justify-end flex-grow">
              <img src="/assets/avatar.png" alt="Profile Picture" className="cursor-pointer" />
            </div>
          </nav>
        </header>

        <main className="main-content pt-16">
          <div className="fixed top-16 left-0 h-screen w-60 m-0 p-5 flex flex-col border border-gray border-t-0">
            <div className="sidebar-item">
              <span className="flex-center w-14"><i className="fas fa-user fa-lg"></i></span>
              <span className="flex-center flex-grow">
                <p>Account</p>
              </span>
            </div>
            <div className="sidebar-item">
              <span className="flex-center w-14"><i className="fas fa-users fa-lg"></i></span>
              <span className="flex-center flex-grow">
                <p>My Groups</p>
              </span>
            </div>
            <div className="sidebar-item">
              <span className="flex-center w-14"><i className="fas fa-chalkboard fa-lg"></i></span>
              <span className="flex-center flex-grow">
                <p>Dashboard</p>
              </span>
            </div>
          </div>
          <div className="ml-60 h-full p-5">
            <div className="min-h-full grid grid-cols-3 grid-rows-5 items-center">
              <div className="col-span-1 row-span-2 flex flex-col justify-center items-center place-self-center">
                <img src="/assets/avatar.png" alt="Profile Picture" className="w-60" />
                <button className="btn primary mt-4 text-xl h-10 w-40">CHANGE</button>
              </div>
              <div className="col-span-2 row-span-2 w-full max-w-2xl">
                <p className="text-3xl">Account Details</p>
                <hr className="border-gray-300" />
                <div className="my-5">
                  <p className="text-xl">Email address</p>
                  <p className="underline text-gray-500">{this.state.user?._id}</p>
                </div>
                <div className="flex justify-between items-center my-5">
                  <div>
                    <p className="text-xl">Name</p>
                    <p className="text-gray-500">{this.state.user?.name}</p>
                  </div>
                  <button className="btn primary w-40 text-xl h-10">CHANGE</button>
                </div>
                <div className="flex justify-between items-center my-5">
                  <div>
                    <p className="text-xl">Password</p>
                    <p className="text-gray-500">***************</p>
                  </div>
                  <button className="btn primary w-40 text-xl h-10" onClick={() => this.handleChangeClick(<ChangePassword />)}>CHANGE</button>
                </div>
              </div>
              <div className="col-span-2 xl:col-span-1 row-span-3 items-start self-start place-self-center w-3/4 min-w-min mt-4 2nxl:mt-0">
                <div className="flex justify-between items-center">
                  <p className="text-3xl">Contacts</p>
                  <i className="fas fa-lg fa-user-plus text-primary cursor-pointer hover:text-primary-hover"></i>
                </div>
                <hr className="border-gray-300" />
                <div className="p-5">
                  <div className="flex items-center py-1">
                    <figure className="mr-6">
                      <img src="/assets/hans.png" alt="avatar" className="rounded-full" />
                    </figure>
                    <p className="text-xl">Hans Ibrahinm</p>
                  </div>
                  <div className="flex items-center py-1">
                    <figure className="mr-6">
                      <img src="/assets/hans.png" alt="avatar" className="rounded-full" />
                    </figure>
                    <p className="text-xl">Hans Ibrahinm</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Modal component={this.modal} />
      </div>
    )
  }
}
