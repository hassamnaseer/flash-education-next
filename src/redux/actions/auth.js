import { API_URL, EMAIL_VERIFY_LAMBDA_BASE_URL, GET_AUTH_USER_DETAILS_BASE_URL } from '../../config'
import axios from 'axios'

export function loginApi(params) {
  return {
    type: `LOGIN_API`,
    payload: axios.post(API_URL + '/login/', params),
  }
}

export function loginResponseApi(params, referralCode) {
  const userName = params.get('name')
  return {
    type: `LOGIN_API`,
    payload: axios.post(API_URL + '/gmail_fb_verification/', params).then(user => {
      console.log(user.data)
      if (referralCode) {
        return axios
          .get(
            `${GET_AUTH_USER_DETAILS_BASE_URL}/after-referral-signup?userId=${user.data.login_user_id}&referralCode=${referralCode}`
          )
          .then(r => {
            return { data: { ...user.data, first_name: userName ? userName : 'User98' } }
          })
      } else {
        return { data: { ...user.data, first_name: userName ? userName : 'User98' } }
      }
    }),
  }
}

export function registerApi(params, referralCode) {
  const generatePayload = axios.post(API_URL + '/register/', params).then(res => {
    return axios
      .get(
        `${EMAIL_VERIFY_LAMBDA_BASE_URL}/verify-email?userId=${res.data.login_user_id}${
          referralCode ? `&referralCode=${referralCode}` : ``
        }`
      )
      .then(re => {
        return { ...res, data: { ...res.data, email: re.data.email } }
      })
  })
  return {
    type: `REGISTER_API`,
    payload: generatePayload,
  }
}

export function forgotPassApi(params) {
  return {
    type: `FORGOT_PASS_API`,
    payload: axios.get(`${API_URL}/forgot_password/?email_id=${params}`),
  }
}

export function resetPassApi(params) {
  return {
    type: `RESET_PASS_API`,
    payload: axios.post(API_URL + '/forgot_password/', params),
  }
}
