import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import useDidUpdateEffect from '../../helper/useDidUpdateEffect'
import { getAuthUserDetails } from '../../redux/actions/user'

const VerifyEmail = props => {
  const { getAuthUserDetails, user_details } = props
  const router = useRouter()
  let storageData = typeof window !== 'undefined' ?? localStorage.getItem('active_user_data') ? JSON.parse(localStorage.getItem('active_user_data')) : {}

  useEffect(() => {
    if (storageData) {
      getAuthUserDetails(storageData.login_user_id)
    }
  }, [])

  useDidUpdateEffect(() => {
    if (user_details && user_details.email_verification_check) {
      if (localStorage.getItem('flash_app_stage')) localStorage.removeItem('flash_app_stage', 'partial')
      router.push('/home')
    } else {
      localStorage.setItem('flash_app_stage', 'partial')
    }
  }, [user_details])

  return (
    <div className="container w-100 d-flex justify-content-center" style={{ background: '#f5f5f5', minHeight: '94vh' }}>
      <div className="d-flex align-items-center justify-content-center flex-column my-auto text-center card p-5 verifyEmailResponsive">
        <img className="icon icons8-Star-Filled" src="/images/logo.png" width="200" height="150" />
        {/* <img className="img-fluid" src="/images/logo.png" alt="logo" /> */}
        <h4 className="my-4">Account Registered Successfully!</h4>
        <div className="text-medium pb-3 text-center">
          A email has been send to <b>{storageData ? storageData.email : ' your email'}</b>. Please check for an email
          from LetsFlash Team and click on Confirm Account button to verify your account.
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  user_details: state.user.user_details,
})

const actionCreators = {
  getAuthUserDetails,
}
const mapDispatchToProps = dispatch => {
  return {
    getAuthUserDetails: params => dispatch(getAuthUserDetails(params)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(VerifyEmail)
