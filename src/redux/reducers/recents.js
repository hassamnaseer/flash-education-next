
import _ from 'lodash'

export default function recents_reducer(
    state = {
        isLoading: false,
        recents: null
    },
    action
) {
    switch (action.type) {
        case "GET_ALL_FOLDERS_PENDING":
            return { ...state, isLoading: true };
        case "GET_ALL_FOLDERS_FULFILLED":
            console.log(action.payload)
            return {
                ...state,
                isLoading: false,
                recents: action.payload
            };
        case "GET_ALL_FOLDERS_REJECTED":
            return { ...state, isLoading: false };

        default:
    }

    return state;
}
