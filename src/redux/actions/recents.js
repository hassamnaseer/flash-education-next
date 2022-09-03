import { API_URL } from "../../config";
import axios from "axios";
import _ from 'lodash'

export function getRecentUpdates(params) {
    return {
        type: `GET_ALL_FOLDERS`,
        payload: axios.get(`${API_URL}/folder_info/?user_id=${params}`).then(folders => {
            return axios.get(`${API_URL}/set_info/?user_id=${params}`).then(sets => {
                return axios.get(`${API_URL}/category_info/?user_id=${params}`).then(categories => {
                    const f = folders.data.data.map((x) => { return { ...x, type: "Folder" } })
                    const s = sets.data.data.map((x) => { return { ...x, type: "Set" } })
                    const c = categories.data.data.map((x) => { return { ...x, type: "Category" } })
                    return _.orderBy([...f, ...s, ...c], function(d) {return new Date(d.recent_date)}, ["desc"])
                })
            })
        }).catch(err => console.log("Error fetching recent folder: ", err))
    }
}
