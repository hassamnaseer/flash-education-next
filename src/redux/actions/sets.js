import { API_URL } from "../../config";
import axios from "axios";

export function getSets(params) {
  return {
    type: `GET_SETS`,
    payload: axios.get(
      `${API_URL}/set_info/?folder_id=${params}`
    )
  };
}
export function getSetsByUserId(params) {
  return {
    type: `GET_SETS`,
    payload: axios.get(
      `${API_URL}/set_info/?user_id=${params}`
    )
  };
}

export function addEditSets(params, flag) {
  if (flag === "add") {
    return {
      type: `ADD_SETS`,
      payload: axios.post(`${API_URL}/set_info/`, params, {
        headers: {
          Authorization: "Token " + localStorage.getItem("luke_token")
        }
      })
    };
  } else if (flag === "edit") {
    return {
      type: `EDIT_SETS`,
      payload: axios.put(`${API_URL}/set_info/`, params, {
        headers: {
          Authorization: "Token " + localStorage.getItem("luke_token")
        }
      })
    };
  }
}


export function deleteSets(params) {
  return {
    type: `DELETE_SETS`,
    payload: axios.delete(`${API_URL}/set_info/?set_id=${params}`)
  };
}

