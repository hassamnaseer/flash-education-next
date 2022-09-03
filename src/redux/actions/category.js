import { API_URL } from '../../config'
import axios from 'axios'

export function getAllCategory() {
  return {
    type: `GET_ALL_CATEGORY`,
    payload: axios.get(`${API_URL}/category_info/`),
  }
}

export function getCategory(params) {
  return {
    type: `GET_CATEGORY`,
    payload: axios.get(`${API_URL}/category_info/?set_id=${params}`),
  }
}
export function getCategoryByUserId(params) {
  return {
    type: `GET_CATEGORY`,
    payload: axios.get(`${API_URL}/category_info/?user_id=${params}`),
  }
}

export function addEditCategory(params, flag) {
  if (flag === 'add') {
    return {
      type: `ADD_CATEGORY`,
      payload: axios.post(`${API_URL}/category_info/`, params, {
        headers: {
          Authorization: 'Token ' + localStorage.getItem('luke_token'),
        },
      }),
    }
  } else if (flag === 'edit') {
    return {
      type: `EDIT_CATEGORY`,
      payload: axios.put(`${API_URL}/category_info/`, params, {
        headers: {
          Authorization: 'Token ' + localStorage.getItem('luke_token'),
        },
      }),
    }
  }
}

export function deleteCategory(params) {
  return {
    type: `DELETE_CATEGORY`,
    payload: axios.delete(`${API_URL}/category_info/?category_id=${params}`),
  }
}

export function getCard(params) {
  return {
    type: `GET_CARD`,
    payload: axios.get(`${API_URL}/card_content/?category_id=${params}`),
  }
}

export function addEditCard(params, flag) {
  if (flag === 'add') {
    return {
      type: `ADD_CARD`,
      payload: axios.post(`${API_URL}/card_content/`, params, {
        headers: {
          Authorization: 'Token ' + localStorage.getItem('luke_token'),
        },
      }),
    }
  } else if (flag === 'edit') {
    return {
      type: `EDIT_CARD`,
      payload: axios.put(`${API_URL}/card_content/`, params, {
        headers: {
          Authorization: 'Token ' + localStorage.getItem('luke_token'),
        },
      }),
    }
  }
}

export function deleteCard(params) {
  return {
    type: `DELETE_CARD`,
    payload: axios.delete(`${API_URL}/card_content/?card_content_id=${params}`),
  }
}

export function findAccuracy(params) {
  return {
    type: `FIND_ACCURACY`,
    payload: axios.post(`${API_URL}/check_accuracy/`, params),
  }
}

export function resultData(params) {
  return {
    type: `RESULT_DATA`,
    payload: axios.post(`${API_URL}/report_generation/`, params),
  }
}

export function getReport(params) {
  return {
    type: `GET_REPORT`,
    payload: axios.get(
      `${API_URL}/report_generation/?category_id=${params.category_id}&&user_id=${params.user_id}&&title=${params.title}`
    ),
  }
}
export function showJoyRidePopup(params) {
  return {
    type: `TOGGLE_JOY_RIDE_POPUP`,
    payload: params,
  }
}

export function getUserFirstLoggedInStatus(params) {
  return {
    type: `USER_FIRST_LOGGED_IN_STATUS`,
    payload: axios.put(API_URL + '/season_user/', params),
  }
}
