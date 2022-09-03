export default function login_reducer(
  state = {
    isLoading: false,
    login_response: {},
    register_response: {},
    forgot_response: {},
    reset_response: {},
  },
  action
) {
  switch (action.type) {
    case 'LOGIN_API_PENDING':
      return { ...state, isLoading: true, login_response: {} }
    case 'LOGIN_API_FULFILLED':
      if (action.payload.data.code === 200) {
        localStorage.setItem('luke_token', action.payload.data.token)
        localStorage.setItem('active_user_data', JSON.stringify(action.payload.data))
      }
      return {
        ...state,
        isLoading: false,
        login_response: action.payload.data,
      }
    case 'LOGIN_API_REJECTED':
      return { ...state, isLoading: false, register_response: {} }

    case 'REGISTER_API_PENDING':
      return { ...state, isLoading: true, register_response: {} }
    case 'REGISTER_API_FULFILLED':
      if (action.payload.data.code === 200) {
        localStorage.setItem('luke_token', action.payload.data.token)
        localStorage.setItem('active_user_data', JSON.stringify(action.payload.data))
      }
      return {
        ...state,
        isLoading: false,
        register_response: action.payload.data,
      }
    case 'REGISTER_API_REJECTED':
      return { ...state, isLoading: false, register_response: {} }

    case 'FORGOT_PASS_API_PENDING':
      return { ...state, isLoading: true, forgot_response: {} }
    case 'FORGOT_PASS_API_FULFILLED':
      return {
        ...state,
        isLoading: false,
        forgot_response: action.payload.data,
      }
    case 'FORGOT_PASS_API_REJECTED':
      return { ...state, isLoading: false, forgot_response: {} }

    case 'RESET_PASS_API_PENDING':
      return { ...state, isLoading: true, reset_response: {} }
    case 'RESET_PASS_API_FULFILLED':
      return {
        ...state,
        isLoading: false,
        reset_response: action.payload.data,
      }
    case 'RESET_PASS_API_REJECTED':
      return { ...state, isLoading: false, reset_response: {} }

    default:
  }

  return state
}
