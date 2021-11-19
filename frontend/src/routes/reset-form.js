import { Component } from 'react'
import { Link } from 'react-router-dom'
import { isValidEmail, isValidPassword } from 'convos-validator'

function Content(props) {
  switch (props.status) {
    case 'get email':
      return (
        <form onSubmit={props.submitHandler}>
          <div className="field">
            <input type="email" name="email" className="input w-full" placeholder="Email" />
            <p className="help-text">{props.error}</p>
          </div>
          <input type="submit" className="btn primary w-full mt-4" />
        </form>
      )

    case 'get password':
      return (
        <form onSubmit={props.submitHandler}>
          <div className="field">
            <input type="password" name="password" className="input w-full" placeholder="Password" />
          </div>
          <div className="field">
            <input type="password" name="confirm" className="input w-full" placeholder="Confirm password" />
            <p className="help-text">{props.error}</p>
          </div>
          <input type="submit" className="btn primary w-full mt-4" />
        </form>
      )

    case 'password updated':
      return (
        <p className="text-center text-xl">Password has been updated!<br />
        Please <Link to="/" className="text-primary font-bold hover:text-primary-hover">log in.</Link></p>
      )

    default:
      return <p className="text-center text-xl">Email was sent.<br />Please check your email!</p>
  }

}

class ResetForm extends Component {
  state = { status: undefined, error: undefined, _id: undefined, submitHandler: undefined }

  componentDidMount() {
    // initial state (on mount)
    if (this.state.status === undefined) {
      const params = new URLSearchParams(window.location.search)

      if (params.get('token') && params.get('user')) {
        const token = params.get('token')
        const email = params.get('user')

        fetch(`/api/password/checkToken?token=${token}&user=${email}`)
          .then(res => res.json())
          .then(res => {
            if (res.result) {
              this.setState({ status: 'get password', submitHandler: this.onPasswordSubmit, _id: res.email })
            } else {
              this.setState({ 
                status: 'get email', 
                submitHandler: this.onEmailSubmit, 
                error: "Invalid or expired password reset token" 
              })
            }
          })
      } else {
        this.setState({ status: 'get email', submitHandler: this.onEmailSubmit })
      }
    }
  }

  sendEmail = (email) => {
    fetch(`/api/password/requestPasswordReset?_id=${email.toLowerCase()}`)
      .then(res => res.json())
      .then(res => {
        if (res.result) {
          this.setState({ status: 'email sent' })
        } else {
          this.setState({ 
            status: 'get email', 
            submitHandler: this.onEmailSubmit, 
            error: "Something went wrong. Please try again." 
          })
        }
      })
  }

  onEmailSubmit = (e) => {
    e.preventDefault()
    const { email } = Object.fromEntries(new FormData(e.target))

    if (!isValidEmail(email)) {
      this.setState({ status: 'get email', submitHandler: this.onEmailSubmit, error: "Invalid email" })
    } else {
      fetch(`/api/user/checkEmail?_id=${email.toString().toLowerCase()}`)
      .then(res => res.json())
      .then(res => {
        if (res.result) {
          this.setState({ 
            status: 'get email', 
            submitHandler: this.onEmailSubmit, 
            error: "No account associated with email" 
          })
        } else {
          this.sendEmail(email)
        }
      })
    }
  }

  onPasswordSubmit = (e) => {
    e.preventDefault()
    // TODO: front end check, update backend password
    const { password, confirm } = Object.fromEntries(new FormData(e.target))
    const _id = this.state._id

    if (!isValidPassword(password)) {
      this.setState({ 
        status: 'get password', 
        submitHandler: this.onPasswordSubmit, 
        _id: _id, 
        error: "Invalid password" 
      })
    } else if (password !== confirm) {
      this.setState({ 
        status: 'get password', 
        submitHandler: this.onPasswordSubmit, 
        _id: _id, 
        error: "Password does not match" 
      })
    } else {
      fetch('/api/user/updatePassword', {
        method: 'patch',
        headers: { 
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ _id, password })
      })
        .then(res => res.json())
        .then(res => {
          if (res.result) {
            this.setState({ status: 'password updated' })
            window.history.replaceState(null, '', '/reset')
            console.log('SUCCESS!')
          } else {
            alert("An error was encountered!")
          }
        })
        .catch(e => alert(e))
    }
  }

  render() {
    return (
      <div className="min-h-screen relative">
        <div className="h-[60vh] bg-primary relative">
          <img src="/assets/green-question-mark.png" alt="bg element" className="bg-question-mark w-[10%] rotate-45 bottom-0" />
          <img src="/assets/green-question-mark.png" alt="bg element" className="bg-question-mark w-[4%] rotate-[120deg] top-[10%] left-[30%]" />
          <img src="/assets/green-question-mark.png" alt="bg element" className="bg-question-mark w-[7%] -rotate-45 top-[10%] right-[30%]" />
          <img src="/assets/green-question-mark.png" alt="bg element" className="bg-question-mark w-[6%] rotate-[-70deg] bottom-[10%] left-[38%]" />
          <img src="/assets/green-question-mark.png" alt="bg element" className="bg-question-mark w-[4%] rotate-[20deg] top-[15%] right-[3%]" />
          <img src="/assets/green-question-mark.png" alt="bg element" className="bg-question-mark w-[7%] rotate-6 bottom-[-15%] right-[5%]" />
        </div>
        <div className="h-[40vh] relative bg-secondary z-10"></div>

        <div className="absolute w-1/5 min-w-max left-1/2 top-1/2 shadow-2xl bg-secondary -translate-x-1/2 -translate-y-1/2 rounded-xl p-8 z-50">
          <figure className="mb-10">
            <img className="m-auto w-10 mb-2" src="/assets/white-question-mark.png" alt="question mark" />
            <figcaption className="text-2xl font-keep-calm text-center">Reset your<br />password</figcaption>
          </figure>
          <Content
            status={this.state.status}
            error={this.state.error}
            submitHandler={this.state.submitHandler}
          />
        </div>
      </div>
    )
  }
}

export default ResetForm