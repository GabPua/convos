import { Link } from 'react-router-dom'
import { Component } from 'react'

function isValidPassword(pw) {
  const re = /\d/g;

  if (pw == null || pw.trim() === '') {
      return false;
  } else {
      return re.test(pw);
  }
}

function isValidName(name) {
  return !(name == null || name === '');
}

function isValidEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  
  return re.test(String(email).toLowerCase());
}

class Register extends Component {
  state = { error: {} }

  handleSubmit = (e) => {
    e.preventDefault()
    const { email, name, password, confirm } = Object.fromEntries(new FormData(e.target))

    let error = {}

    // check email
    if (!isValidEmail(email)) {
      error.email = "Invalid email"
    } else {
      fetch(`/api/user/checkEmail?_id=${email}`)
        .then(res => res.json())
        .then(res => {
          console.log(res);
          if (!res.result) {
            error.email = "Email is taken"
          }
        })
    }

    // check name
    if (!isValidName(name)) {
      error.name = "Invalid name"
    }

    // check password
    if (!isValidPassword(password)) {
      error.password = "Invalid password"
    } else if (password !== confirm) {
      error.password = "Password does not match"
    }

    this.setState({ error })
  }

  render() {
    return (
      <div className="flex min-h-screen items-stretch">
        <div className="w-[51vw] flex-grow-[0.25] flex-shrink-0 bg-primary shadow-2xl min-h-screen flex flex-col justify-center">
          <div className="flex flex-col items-center justify-center">
            <figure className="mb-5">
              <img src="/assets/logo-white.png" alt="Convos Logo" className="mb-10 m-auto" />
              <figcaption className="text-8xl font-medium font-keep-calm text-secondary">CONVOS</figcaption>
            </figure>
            <Link to="/" className="block w-full">
              <button className="btn primary max-w-sm w-1/2 font-medium text-xl mt-3 m-auto">Log In</button>
            </Link>
          </div>
        </div>
        <div className="flex-auto">
          <form className="flex flex-col items-center justify-center h-full w-5/6 m-auto" onSubmit={this.handleSubmit}>
            <div className="field w-5/6 lg:w-3/4">
              <input type="email" name="email" className="input max-w-lg w-full" placeholder="Email" />
              <p className="help-text">{this.state.error.email}</p>
            </div>
            <div className="field w-5/6 lg:w-3/4">
              <input type="text" name="name" className="input max-w-lg w-full" placeholder="Display name" />
              <p className="help-text">{this.state.error.name}</p>
            </div>
            <div className="field w-5/6 lg:w-3/4">
              <input type="password" name="password" className="input max-w-lg w-full" placeholder="Password" />
            </div>
            <div className="field w-5/6 lg:w-3/4">
              <input type="password" name="confirm" className="input max-w-lg w-full" placeholder="Confirm password" />
              <p className="help-text">{this.state.error.password}</p>
            </div>
            <input type="submit" className="btn primary w-full max-w-sm font-medium text-xl mt-12" value="Register" />
          </form>
        </div>
      </div>
    )
  }
}

export default Register;