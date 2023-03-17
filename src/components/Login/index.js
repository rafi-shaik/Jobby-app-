import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

import './index.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
    showSubmitError: false,
    errorMsg: '',
  }

  onSubmitSuccess = jwtToken => {
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    const {history} = this.props
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({showSubmitError: true, errorMsg})
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  renderUsernameField = () => {
    const {username} = this.state
    return (
      <>
        <label className="l-label" htmlFor="username">
          USERNAME
        </label>
        <input
          value={username}
          type="text"
          id="username"
          placeholder="Username"
          onChange={this.onChangeUsername}
          className="l-input-field"
        />
      </>
    )
  }

  renderPasswordField = () => {
    const {password} = this.state
    return (
      <>
        <label className="l-label" htmlFor="password">
          PASSWORD
        </label>
        <input
          placeholder="Password"
          type="password"
          id="password"
          className="l-input-field"
          value={password}
          onChange={this.onChangePassword}
        />
      </>
    )
  }

  submitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      console.log(data)
      console.log(data.error_msg)
      this.onSubmitFailure(data.error_msg)
    }
  }

  render() {
    const {showSubmitError, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="l-bg-container">
        <form className="l-form-container" onSubmit={this.submitForm}>
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="l-logo"
          />
          <div className="l-input-container">{this.renderUsernameField()}</div>
          <div className="l-input-container">{this.renderPasswordField()}</div>
          <button type="submit" className="l-login-button">
            Login
          </button>
          {showSubmitError && <p className="l-error-message">*{errorMsg}</p>}
        </form>
      </div>
    )
  }
}

export default Login
