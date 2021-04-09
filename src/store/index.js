import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import reduxThunk from 'redux-thunk'
import mainReducer from './reducers/mainReducer'

//Combine reducers (only have one now)
const rootReducer = combineReducers({
    mr: mainReducer
})

// Apply redux devTool extension
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

//Create the combiend root reducer, and apply reduxThunk as an middleware ,
//      use compose for redux extension
const store = createStore(rootReducer, composeEnhancers(applyMiddleware(reduxThunk)))
export default store 