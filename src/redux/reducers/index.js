import { combineReducers } from "redux";

import auth_reducer from "./auth";
import category_reducer from "./category";
import user_reducer from "./user";
import folder_reducer from "./folder";
import sets_reducer from "./sets";
import recents_reducer from "./recents";

export default combineReducers({
  auth: auth_reducer,
  category: category_reducer,
  user: user_reducer,
  folder: folder_reducer,
  sets: sets_reducer,
  recents: recents_reducer
});