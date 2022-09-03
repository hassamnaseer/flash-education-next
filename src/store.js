import { applyMiddleware, createStore } from 'redux';
import promise from "redux-promise-middleware"
import { composeWithDevTools } from 'redux-devtools-extension';

import reducer from "./redux/reducers/"

const middleware = [promise]

export default createStore(reducer, composeWithDevTools(applyMiddleware(...middleware)));