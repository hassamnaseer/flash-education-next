export default function category_reducer(
  state = {
    isLoading: false,
    isAccuracyLoading: false,
    categories: {},
    category_list: {},
    add_response: {},
    edit_response: {},
    delete_response: {},
    question_list: {},
    accuracy_response: {},
    result_response: {},
    report_data: {},
    showJoyRidePopupState: false
  },
  action
) {
  switch (action.type) {
    case 'GET_ALL_CATEGORY_PENDING':
      return { ...state, isLoading: true, categories: {} }
    case 'GET_ALL_CATEGORY_FULFILLED':
      return {
        ...state,
        isLoading: false,
        categories: action.payload.data,
      }
    case 'GET_ALL_CATEGORY_REJECTED':
      return { ...state, isLoading: false, categories: {} }

    case 'GET_CATEGORY_PENDING':
      return { ...state, isLoading: true, category_list: {} }
    case 'GET_CATEGORY_FULFILLED':
      return {
        ...state,
        isLoading: false,
        category_list: action.payload.data,
      }
    case 'GET_CATEGORY_REJECTED':
      return { ...state, isLoading: false, category_list: {} }

    case 'ADD_CATEGORY_PENDING':
      return { ...state, isLoading: true, add_response: {} }
    case 'ADD_CATEGORY_FULFILLED':
      return {
        ...state,
        isLoading: false,
        add_response: action.payload.data,
      }
    case 'ADD_CATEGORY_REJECTED':
      return { ...state, isLoading: false, add_response: {} }

    case 'EDIT_CATEGORY_PENDING':
      return { ...state, isLoading: true, edit_response: {} }
    case 'EDIT_CATEGORY_FULFILLED':
      return {
        ...state,
        isLoading: false,
        edit_response: action.payload.data,
      }
    case 'EDIT_CATEGORY_REJECTED':
      return { ...state, isLoading: false, edit_response: {} }

    case 'DELETE_CATEGORY_PENDING':
      return { ...state, isLoading: true, delete_response: {} }
    case 'DELETE_CATEGORY_FULFILLED':
      return {
        ...state,
        isLoading: false,
        delete_response: action.payload.data,
      }
    case 'DELETE_CATEGORY_REJECTED':
      return { ...state, isLoading: false, delete_response: {} }

    case 'GET_CARD_PENDING':
      return { ...state, isLoading: true, question_list: {} }
    case 'GET_CARD_FULFILLED':
      return {
        ...state,
        isLoading: false,
        question_list: action.payload.data,
      }
    case 'GET_CARD_REJECTED':
      return { ...state, isLoading: false, question_list: {} }

    case 'ADD_CARD_PENDING':
      return { ...state, isLoading: true, add_response: {} }
    case 'ADD_CARD_FULFILLED':
      return {
        ...state,
        isLoading: false,
        add_response: action.payload.data,
      }
    case 'ADD_CARD_REJECTED':
      return { ...state, isLoading: false, add_response: {} }

    case 'EDIT_CARD_PENDING':
      return { ...state, isLoading: true, edit_response: {} }
    case 'EDIT_CARD_FULFILLED':
      return {
        ...state,
        isLoading: false,
        edit_response: action.payload.data,
      }
    case 'EDIT_CARD_REJECTED':
      return { ...state, isLoading: false, edit_response: {} }

    case 'DELETE_CARD_PENDING':
      return { ...state, isLoading: true, delete_response: {} }
    case 'DELETE_CARD_FULFILLED':
      return {
        ...state,
        isLoading: false,
        delete_response: action.payload.data,
      }
    case 'DELETE_CARD_REJECTED':
      return { ...state, isLoading: false, delete_response: {} }

    case 'FIND_ACCURACY_PENDING':
      return { ...state, isAccuracyLoading: true, accuracy_response: {} }
    case 'FIND_ACCURACY_FULFILLED':
      return {
        ...state,
        isAccuracyLoading: false,
        accuracy_response: action.payload.data,
      }
    case 'FIND_ACCURACY_REJECTED':
      return { ...state, isAccuracyLoading: false, accuracy_response: {} }

    case 'RESULT_DATA_PENDING':
      return { ...state, isLoading: true, result_response: {} }
    case 'RESULT_DATA_FULFILLED':
      return {
        ...state,
        isLoading: false,
        result_response: action.payload.data,
      }
    case 'RESULT_DATA_REJECTED':
      return { ...state, isLoading: false, result_response: {} }

    case 'GET_REPORT_PENDING':
      return { ...state, isLoading: true, report_data: {} }
    case 'GET_REPORT_FULFILLED':
      return {
        ...state,
        isLoading: false,
        report_data: action.payload.data,
      }
    case 'GET_REPORT_REJECTED':
      return { ...state, isLoading: false, report_data: {} }
    case 'TOGGLE_JOY_RIDE_POPUP':
      return { ...state, showJoyRidePopupState: action.payload }

    default:
  }

  return state
}
