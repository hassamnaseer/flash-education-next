import React, { Component } from 'react'
import { connect } from 'react-redux'
import { registerApi, loginResponseApi } from '../../redux/actions//auth'
import { toaster } from '../../helper/Toaster'
import { loginWithFacebook, loginWithGoogle, registerWithEmail } from '../../Firebase'
import ReCAPTCHA from 'react-google-recaptcha'
import Meta from '../../helper/seoMeta'
import OrganizationSchema from '../../schemas/Organization.json'
import WebpageSchema from '../../schemas/WebPage.json'
import BreadcrumbSchema from '../../schemas/BreadcrumbList.json'
import WebsiteSchema from '../../schemas/Website.json'
import { withRouter } from 'next/router'
import Header from '../components/header'

let registerFlag = false

const Register = withRouter(class extends Component {
  constructor(props) {
    super(props)

    this.state = {
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
      password: '',
      password_show: false,
      isVerified: false,
      hasReferral: false,
      referralCode: 0,
      readyForRender: false
    }
  }

  UNSAFE_componentWillMount() {
    if (typeof window !== "undefined") {
      if (localStorage.getItem("luke_token")) {
        this.props.router.push("/home");
      } else this.setState({ readyForRender: true });
    }
  }

  componentDidMount() {
    console.log(this.props.sitekey);
    const query = new URLSearchParams(window.location.search)
    const referral = query.get('referral')
    if (referral && referral.length) {
      this.setState({ hasReferral: true })
      this.setState({ referralCode: referral })
    }
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    const { register_response, login_response } = newProps
    if (register_response && register_response.code === 200 && registerFlag) {
      toaster('success', register_response.message)
      this.props.setLukeToken(register_response.token);
      this.props.router.push('/verify-email')
      registerFlag = false
    } else if (register_response && register_response.code === 400 && registerFlag) {
      return toaster('error', register_response.message)
      registerFlag = false
    }
    if (login_response && login_response.code === 200) {
      toaster('success', login_response.message)
      this.props.router.push('/home')
    } else if (login_response && login_response.code === 400) {
      return toaster('error', login_response.message)
    }
  }

  onKeyPress = e => {
    if (e.key === 'Enter') {
      this.submitData()
    }
  }

  handleChange = (e, name) => {
    if ((name === 'first_name' || name === 'last_name') && /^[A-Z a-z]{0,25}$/.test(e.target.value) === false) {
      return
    }
    if (name === 'phone_number' && /^[0-9]{0,15}$/.test(e.target.value) === false) {
      return
    } else if (name === 'password' && e.target.value.length > 25) {
      return
    }
    this.setState({ [name]: e.target.value })
  }

  loginGoogleUser = async e => {
    const { hasReferral, referralCode } = this.state
    try {
      let res = await loginWithGoogle()
      if (res) {
        var formData = new FormData()
        formData.append('email', res.user.providerData[0].email)
        formData.append('uid', res.user.uid)
        formData.append('name', res.user.providerData[0].displayName)
        formData.append('type', 'gmail')
        const ref = hasReferral ? referralCode : null
        this.props.loginResponseApi(formData, ref)
      }
    } catch (err) {
      toaster('error', err.message)
    }
  }

  loginFacebookUser = async e => {
    const { hasReferral, referralCode } = this.state
    try {
      let res = await loginWithFacebook()
      if (res) {
        var formData = new FormData()
        formData.append('email', res.user.providerData[0].email)
        formData.append('uid', res.user.uid)
        formData.append('name', res.user.providerData[0].displayName)
        formData.append('type', 'facebook')
        const ref = hasReferral ? referralCode : null
        this.props.loginResponseApi(formData, ref)
      }
    } catch (err) {
      toaster('error', err.message)
    }
  }

  registerEmailUser = async e => {
    this.refs.first.focus()
    const { first_name, last_name, email, phone_number, password, hasReferral, referralCode } = this.state
    if (first_name !== '' && last_name !== '' && email !== '' && phone_number !== '' && password !== '') {
      if (!first_name.match(/^[A-Z a-z]{3,}$/)) {
        return toaster('error', 'First name should not be less than 3 characters')
      } else if (!last_name.match(/^[A-Z a-z]{3,}$/)) {
        return toaster('error', 'Last name should not be less than 3 characters')
      } else if (!email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,3})$/i)) {
        return toaster('error', 'Email should be in proper format.')
      } else if (!/^[0-9]{10,}$/.test(phone_number)) {
        return toaster('error', 'Mobile number must be of 10 digits')
      } else if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})/)) {
        return toaster(
          'error',
          'Password must contain atlreast one lower,upper,numeric and special charater and must have length of 6.'
        )
      }
      try {
        e.preventDefault()
        const { first_name, last_name, email, password } = this.state
        let res = await registerWithEmail(email, password)
        if (res) {
          var formData = new FormData()
          formData.append('email', res.user.providerData[0].email)
          formData.append('uid', res.user.uid)
          formData.append('name', first_name)
          formData.append('last_name', last_name)
          formData.append('type', 'continue_with_email')
          const ref = hasReferral ? referralCode : null
          this.props.loginResponseApi(formData, ref)
        }
      } catch (err) {
        toaster('error', err.message)
      }
    } else {
      return toaster('error', 'Please fill all fields')
    }
  }

  submitData = () => {
    const { first_name, last_name, email, phone_number, password, hasReferral, referralCode } = this.state
    if (first_name !== '' && last_name !== '' && email !== '' && phone_number !== '' && password !== '') {
      if (!first_name.match(/^[A-Z a-z]{3,}$/)) {
        return toaster('error', 'First name should not be less than 3 characters')
      } else if (!last_name.match(/^[A-Z a-z]{3,}$/)) {
        return toaster('error', 'Last name should not be less than 3 characters')
      } else if (!email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,3})$/i)) {
        return toaster('error', 'Email should be in proper format.')
      } else if (!/^[0-9]{10,}$/.test(phone_number)) {
        return toaster('error', 'Mobile number must be of 10 digits')
      } else if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})/)) {
        return toaster(
          'error',
          'Password must contain at least one lower,upper,numeric and special character and must have length of 6.'
        )
      }
      var formData = new FormData()
      formData.append('first_name', first_name)
      formData.append('last_name', last_name)
      formData.append('email', email)
      formData.append('phone_number', phone_number)
      formData.append('password', password)
      const ref = hasReferral ? referralCode : null
      this.props.registerApi(formData, ref)
      registerFlag = true
    } else {
      return toaster('error', 'Please fill all fields')
    }
  }
  onReCaptchaChange = val => {
    this.setState({ isVerified: true })
  }

  render() {
    const {
      first_name,
      last_name,
      email,
      phone_number,
      password,
      password_show,
      isVerified,
      hasReferral,
      referralCode,
    } = this.state

    if (this.state.readyForRender) {
      return (
        <>
          <Header />
          <section className="section_login">
            <Meta
              title="SignUp - LetsFlash - Virtual Study Assistant"
              desc="Virtual Study Assistant for any Occasion."
              canonical="https://letsflash.co/register"
              schema={OrganizationSchema}
              schema2={WebpageSchema.register}
              schema3={BreadcrumbSchema.register}
              schema4={WebsiteSchema}
            />
            <div className="container">
              <div className="row">
                <div className="col-md-6">
                  <div className="login_txt">
                    <h1>Hello!</h1>
                    <p>Enter the necesary information to register or register with Google or Facebook!</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card form_card">
                    <h3>Register here</h3>
                    <form>
                      <div className="form-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="First Name"
                          name={first_name}
                          value={first_name}
                          autoComplete="new-password"
                          ref="first"
                          onChange={e => this.handleChange(e, 'first_name')}
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Last Name"
                          name={last_name}
                          value={last_name}
                          autoComplete="new-password"
                          onChange={e => this.handleChange(e, 'last_name')}
                        />
                      </div>
    
                      <div className="form-group">
                        <input
                          type="email"
                          className="form-control"
                          placeholder="Email"
                          name={email}
                          value={email}
                          autoComplete="new-password"
                          onChange={e => this.handleChange(e, 'email')}
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Phone Number"
                          name={phone_number}
                          value={phone_number}
                          autoComplete="new-password"
                          onChange={e => this.handleChange(e, 'phone_number')}
                        />
                      </div>
                      {hasReferral ? (
                        <div className="form-group">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Referral Code"
                            name="referralCode"
                            disabled
                            value={`${referralCode} (Referral Code)`}
                            onChange={e => this.handleChange(e, 'referral')}
                          />
                        </div>
                      ) : null}
    
                      <div className="form-group">
                        <input
                          type={password_show ? 'text' : 'password'}
                          className="form-control"
                          placeholder="Password"
                          name={password}
                          value={password}
                          autoComplete="new-password"
                          onPaste={e => e.preventDefault()}
                          onChange={e => this.handleChange(e, 'password')}
                          onKeyDown={this.onKeyPress}
                        />
                        {password_show ? (
                          <i
                            className="fa fa-eye"
                            aria-hidden="true"
                            onClick={() => this.setState({ password_show: false })}
                          >
                            <span className="tooltiptext">Hide Password</span>
                          </i>
                        ) : (
                          <i
                            className="fa fa-eye-slash"
                            aria-hidden="true"
                            onClick={() => this.setState({ password_show: true })}
                          >
                            <span className="tooltiptext">Show Password</span>
                          </i>
                        )}
                      </div>
                      {/* <div className="form-group">
                  <input type="password" className="form-control" placeholder="Confirm Password" id="cpassword" />
                </div> */}
                      <div className="form-group">
                        <div className="d-flex justify-content-center my-5">
                          <ReCAPTCHA
                            sitekey={this.props.sitekey}
                            onChange={val => this.onReCaptchaChange(val)}
                          />
                        </div>
                        <button
                          type="button"
                          className="btn btn-success w-100"
                          disabled={!isVerified}
                          onClick={() => this.submitData()}
                        >
                          Register
                        </button>
    
                        <button className="btn btn_google" type="button" onClick={e => this.loginGoogleUser(e)}>
                          <i className="google_icon" /> Continue with google
                        </button>
                        <button className="btn btn_facebook" type="button" onClick={e => this.loginFacebookUser(e)}>
                          <i className="facebook_icon" /> Continue with facebook
                        </button>
    
                        <button className="btn btn_email" type="button" onClick={e => this.registerEmailUser(e)}>
                          <i className="email_icon" /> Continue with email
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )
    } else return <></>
  }
})

const mapStateToProps = store => {
  return {
    register_response: store.auth.register_response,
    login_response: store.auth.login_response,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    registerApi: (params, referralCode) => dispatch(registerApi(params, referralCode)),
    loginResponseApi: (params, referralCode) => dispatch(loginResponseApi(params, referralCode)),
  }
}

export async function getServerSideProps(ctx) {
  return {
    props: { sitekey: process.env.REACT_APP_RE_CAPTCHA_KEY },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Register)
