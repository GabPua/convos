function Landing() {
  return (
    <div className="flex min-h-screen items-stretch">
      <div className="w-[51vw] m-auto flex-grow-[0.25] flex-shrink-0">
        <div className="flex flex-col items-center justify-center w-3/4 max-w-[500px] m-auto">
          <figure className="mb-3">
            <img src="/logo-white.png" alt="Convos Logo" className="w-1/2 mb-5 m-auto" />
            <figcaption className="text-[4vw] font-medium font-keep-calm text-center">CONVOS</figcaption>
          </figure>
          <div className="field w-2/3">
            <input type="text" className="input w-full" placeholder="Email" />
            <p className="help-text">Invalid Email</p>
          </div>
          <div className="field w-2/3">
            <input type="password" className="input w-full" placeholder="Password" />
            <p className="help-text">Wrong Password</p>
          </div>
          <button className="btn primary max-w-sm w-1/2 text-xl mt-2">Log In</button>
          <a href="/" className="text-primary mt-2 hover:text-primary-hover">Forgot your password?</a>
        </div>
      </div>
      <div className="bg-primary shadow-2xl flex items-center flex-auto">
        <div className="flex flex-col items-center justify-center w-7/12 m-auto">
          <figure>
            <img src="/speech-bubbles.png" alt="Speech bubbles" />
            <figcaption className="text-secondary font-keep-calm text-3xl text-center mt-4">Join the conversation!</figcaption>
          </figure>
          <button className="btn primary w-1/2 text-xl mt-24">Register</button>
        </div>
      </div>
    </div>
  );
}

function Register() {
  return (
    <div className="flex min-h-screen">
      <div className="flex-grow-[2] bg-primary shadow-2xl">
        <div className="flex flex-col items-center justify-center h-full">
          <figure className="mb-5">
            <img src="./logo.png" alt="Convos Logo" className="mb-10 m-auto" />
            <figcaption className="text-8xl font-medium font-keep-calm text-secondary">CONVOS</figcaption>
          </figure>
          <button className="btn primary max-w-sm w-1/2 font-medium text-xl mt-3">Log In</button>
        </div>
      </div>
      <div className="flex-grow">
        <div className="flex flex-col items-center justify-center h-full w-5/6 m-auto pt-16 px-16">
          <input type="text" className="input max-w-md w-full" placeholder="Email" />
          <input type="text" className="input max-w-md w-full" placeholder="Username" />
          <input type="text" className="input max-w-md w-full" placeholder="Password" />
          <input type="text" className="input max-w-md w-full" placeholder="Confirm password" />
          <button className="btn primary w-full max-w-md font-medium text-xl mt-24">Register</button>
        </div>
      </div>
    </div>
  )
}

export default Landing;
