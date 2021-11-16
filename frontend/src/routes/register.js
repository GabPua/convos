import { Link } from 'react-router-dom'

export default function Register() {
  return (
    <div className="flex min-h-screen items-stretch">
      <div className="w-[51vw] flex-grow-[0.25] flex-shrink-0 bg-primary shadow-2xl min-h-screen flex flex-col justify-center">
        <div className="flex flex-col items-center justify-center">
          <figure className="mb-5">
            <img src="/logo-white.png" alt="Convos Logo" className="mb-10 m-auto" />
            <figcaption className="text-8xl font-medium font-keep-calm text-secondary">CONVOS</figcaption>
          </figure>
          <Link to="/" className="block w-full">
            <button className="btn primary max-w-sm w-1/2 font-medium text-xl mt-3 m-auto">Log In</button>
          </Link>
        </div>
      </div>
      <div className="flex-auto">
        <div className="flex flex-col items-center justify-center h-full w-5/6 m-auto">
          <div className="field w-5/6 lg:w-3/4">
            <input type="text" className="input max-w-lg w-full" placeholder="Email" />
            <p className="help-text">my help</p>
          </div>
          <div className="field w-5/6 lg:w-3/4">
            <input type="text" className="input max-w-lg w-full" placeholder="Display name" />
            <p className="help-text">my help</p>
          </div>
          <div className="field w-5/6 lg:w-3/4">
            <input type="text" className="input max-w-lg w-full" placeholder="Password" />
            <p className="help-text">my help</p>
          </div>
          <div className="field w-5/6 lg:w-3/4">
            <input type="text" className="input max-w-lg w-full" placeholder="Confirm password" />
            <p className="help-text">my help</p>
          </div>
          <button className="btn primary w-full max-w-sm font-medium text-xl mt-12">Register</button>
        </div>
      </div>
    </div>
  )
}
