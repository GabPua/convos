import { Link } from 'react-router-dom'
import { Component } from 'react'
import { isValidEmail, isValidPassword } from 'convos-validator'

function loginAccount(_id) {
  // TODO: Route to homepage
  console.log(_id)
}

class Landing extends Component {
  state = { error: false }

  handleSubmit = (e) => {
    e.preventDefault()
    const { email, password } = Object.fromEntries(new FormData(e.target))

    if (!isValidEmail(email) || !isValidPassword(password)) {
      this.setState({ error: true })
    } else {
      const _id = email.toString().toLowerCase()
      fetch(`/api/user/login?_id=${_id}&password=${password}`)
      .then(res => res.json())
      .then(res => {
        if (res.result) {
          this.setState({ error: false })
          loginAccount(_id)
        } else {
          this.setState({ error: true })
        }
      })
    }
  }

  render() {
    return (
      <div className="flex min-h-screen items-stretch">
        <div className="w-[51vw] m-auto flex-grow-[0.25] flex-shrink-0">
          <form className="flex flex-col items-center justify-center w-3/4 max-w-[500px] m-auto" onSubmit={this.handleSubmit}>
            <figure className="mb-3">
              <img src="/assets/logo-purple.png" alt="Convos Logo" className="w-1/2 mb-5 m-auto" />
              <figcaption className="text-[4vw] font-medium font-keep-calm text-center">CONVOS</figcaption>
            </figure>
            <div className="field w-2/3">
              <input type="email" name="email" className="input w-full" placeholder="Email" />
            </div>
            <div className="field w-2/3">
              <input type="password" name="password" className="input w-full" placeholder="Password" />
              <p className="help-text">{this.state.error ? 'Invalid credentials' : ''}</p>
            </div>
            <input type="submit" className="btn primary max-w-sm w-1/2 text-xl mt-2" value="Log In" />
            <Link to="reset" className="text-primary mt-2 hover:text-primary-hover">Forgot your password?</Link>
          </form>
        </div>
        <div className="bg-primary shadow-2xl flex items-center flex-auto">
          <div className="flex flex-col items-center justify-center w-7/12 m-auto">
            <figure>
              <img src="/assets/speech-bubbles.png" alt="Speech bubbles" />
              <figcaption className="text-secondary font-keep-calm text-3xl text-center mt-4">Join the conversation!</figcaption>
            </figure>
            <Link to="/register" className="block w-full">
              <button className="btn primary w-1/2 text-xl mt-24 m-auto">Register</button>
            </Link>
          </div>
        </div>
      </div>
    )
  }
}

export default Landing