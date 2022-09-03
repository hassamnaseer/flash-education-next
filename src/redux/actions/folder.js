import { API_URL } from "../../config";
import axios from "axios";

export function getFolder(params) {
  return {
    type: `GET_FOLDER`,
    payload: axios.get(
      `${API_URL}/folder_info/?user_id=${params}`
    )
  };
}

export function addEditFolder(params, flag) {
  if (flag === "add") {
    return {
      type: `ADD_FOLDER`,
      payload: axios.post(`${API_URL}/folder_info/`, params, {
        headers: {
          Authorization: "Token " + localStorage.getItem("luke_token")
        }
      })
    };
  } else if (flag === "edit") {
    return {
      type: `EDIT_FOLDER`,
      payload: axios.put(`${API_URL}/folder_info/`, params, {
        headers: {
          Authorization: "Token " + localStorage.getItem("luke_token")
        }
      })
    };
  }
}


export function deleteFolder(params) {
  return {
    type: `DELETE_FOLDER`,
    payload: axios.delete(`${API_URL}/folder_info/?folder_id=${params}`)
  };
}

