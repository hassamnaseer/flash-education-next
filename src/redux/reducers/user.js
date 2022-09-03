export default function user_reducer(
  state = {
    isLoading: false,
    user_list: {},
    user_details: {},
    add_response: {},
    edit_response: {},
    delete_response: {},
  },
  action
) {
  switch (action.type) {
    case 'GET_USER_PENDING':
      return { ...state, isLoading: true, user_list: {} }
    case 'GET_USER_FULFILLED':
      return {
        ...state,
        isLoading: false,
        user_list: action.payload.data,
      }
    case 'GET_USER_REJECTED':
      return { ...state, isLoading: false, user_list: {} }

    case 'ADD_USER_PENDING':
      return { ...state, isLoading: true, add_response: {} }
    case 'ADD_USER_FULFILLED':
      return {
        ...state,
        isLoading: false,
        add_response: action.payload.data,
      }
    case 'ADD_USER_REJECTED':
      return { ...state, isLoading: false, add_response: {} }

    case 'EDIT_USER_PENDING':
      return { ...state, isLoading: true, edit_response: {} }
    case 'EDIT_USER_FULFILLED':
      return {
        ...state,
        isLoading: false,
        edit_response: action.payload.data,
      }
    case 'EDIT_USER_REJECTED':
      return { ...state, isLoading: false, edit_response: {} }

    case 'DELETE_USER_PENDING':
      return { ...state, isLoading: true, delete_response: {} }
    case 'DELETE_USER_FULFILLED':
      return {
        ...state,
        isLoading: false,
        delete_response: action.payload.data,
      }
    case 'DELETE_USER_REJECTED':
      return { ...state, isLoading: false, delete_response: {} }

    case 'GET_AUTH_USER_DETAILS_PENDING':
      return { ...state, isLoading: true, user_details: {} }
    case 'GET_AUTH_USER_DETAILS_FULFILLED':
      return {
        ...state,
        isLoading: false,
        user_details: action.payload.data,
      }
    case 'GET_AUTH_USER_DETAILS_REJECTED':
      return { ...state, isLoading: false, user_details: {} }

    default:
  }

  return state
}
