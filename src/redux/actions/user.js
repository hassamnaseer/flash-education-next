import { API_URL, EMAIL_VERIFY_LAMBDA_BASE_URL, GET_AUTH_USER_DETAILS_BASE_URL } from '../../config'
import axios from 'axios'

export function getUser(params) {
  return {
    type: `GET_USER`,
    payload: axios.get(`${API_URL}/all_users_info/?user_id=${params}`),
  }
}

export function addEditUser(params, flag) {
  if (flag === 'add') {
    return {
      type: `ADD_USER`,
      payload: axios.post(`${API_URL}/all_users_info/`, params, {
        headers: {
          Authorization: 'Token ' + localStorage.getItem('luke_token'),
        },
      }),
    }
  } else if (flag === 'edit') {
    return {
      type: `EDIT_USER`,
      payload: axios.put(`${API_URL}/all_users_info/`, params, {
        headers: {
          Authorization: 'Token ' + localStorage.getItem('luke_token'),
        },
      }),
    }
  }
}

export function deleteUser(params) {
  return {
    type: `DELETE_USER`,
    payload: axios.delete(`${API_URL}/all_users_info/?user_id=${params}`),
  }
}

export function getAuthUserDetails(params) {
  return {
    type: `GET_AUTH_USER_DETAILS`,
    payload: axios.get(`${GET_AUTH_USER_DETAILS_BASE_URL}/get-user-details?userId=${params}`),
  }
}

export function onUserInvite(params) {
  return {
    type: `ON_USER_INVITE`,
    payload: axios.get(`${GET_AUTH_USER_DETAILS_BASE_URL}/on-invite?userId=${params}`),
  }
}
