export default function folder_reducer(
    state = {
      isLoading: false,
      folder_list: {},
      add_response: {},
      edit_response: {},
      delete_response: {}
    },
    action
  ) {
    switch (action.type) {
      case "GET_FOLDER_PENDING":
        return { ...state, isLoading: true, folder_list: {} };
      case "GET_FOLDER_FULFILLED":
        return {
          ...state,
          isLoading: false,
          folder_list: action.payload.data
        };
      case "GET_FOLDER_REJECTED":
        return { ...state, isLoading: false, folder_list: {} };
  
      case "ADD_FOLDER_PENDING":
        return { ...state, isLoading: true, add_response: {} };
      case "ADD_FOLDER_FULFILLED":
        return {
          ...state,
          isLoading: false,
          add_response: action.payload.data
        };
      case "ADD_FOLDER_REJECTED":
        return { ...state, isLoading: false, add_response: {} };
  
      case "EDIT_FOLDER_PENDING":
        return { ...state, isLoading: true, edit_response: {} };
      case "EDIT_FOLDER_FULFILLED":
        return {
          ...state,
          isLoading: false,
          edit_response: action.payload.data
        };
      case "EDIT_FOLDER_REJECTED":
        return { ...state, isLoading: false, edit_response: {} };
  
      case "DELETE_FOLDER_PENDING":
        return { ...state, isLoading: true, delete_response: {} };
      case "DELETE_FOLDER_FULFILLED":
        return {
          ...state,
          isLoading: false,
          delete_response: action.payload.data
        };
      case "DELETE_FOLDER_REJECTED":
        return { ...state, isLoading: false, delete_response: {} };
  
      default:
    }
  
    return state;
  }
  