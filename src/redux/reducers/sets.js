export default function sets_reducer(
    state = {
      isLoading: false,
      sets_list: {},
      add_response: {},
      edit_response: {},
      delete_response: {}
    },
    action
  ) {
    switch (action.type) {
      case "GET_SETS_PENDING":
        return { ...state, isLoading: true, sets_list: {} };
      case "GET_SETS_FULFILLED":
        return {
          ...state,
          isLoading: false,
          sets_list: action.payload.data
        };
      case "GET_SETS_REJECTED":
        return { ...state, isLoading: false, sets_list: {} };
  
      case "ADD_SETS_PENDING":
        return { ...state, isLoading: true, add_response: {} };
      case "ADD_SETS_FULFILLED":
        return {
          ...state,
          isLoading: false,
          add_response: action.payload.data
        };
      case "ADD_SETS_REJECTED":
        return { ...state, isLoading: false, add_response: {} };
  
      case "EDIT_SETS_PENDING":
        return { ...state, isLoading: true, edit_response: {} };
      case "EDIT_SETS_FULFILLED":
        return {
          ...state,
          isLoading: false,
          edit_response: action.payload.data
        };
      case "EDIT_SETS_REJECTED":
        return { ...state, isLoading: false, edit_response: {} };
  
      case "DELETE_SETS_PENDING":
        return { ...state, isLoading: true, delete_response: {} };
      case "DELETE_SETS_FULFILLED":
        return {
          ...state,
          isLoading: false,
          delete_response: action.payload.data
        };
      case "DELETE_SETS_REJECTED":
        return { ...state, isLoading: false, delete_response: {} };
  
      default:
    }
  
    return state;
  }
  