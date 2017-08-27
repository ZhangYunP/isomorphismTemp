import { combineReducers } from 'redux'

const initAddState = { count: 0 }
const initFetchState = { fetchdata: 'please fetch data' }

function addReducer(preState = initAddState, action) {
  switch (action.type) {
    case 'ADD' :
      return Object.assign({ ...preState, count: preState.count + 1 })
    default:
      return Object.assign({ ...preState })
  }
}
function fetchReducer(preState = initFetchState, action) {
  switch (action.type) {
    case 'FETCHSUCESS':
      return Object.assign({ ...preState, fetchdata: action.payload.data })
    case 'FETCHERROR':
      return Object.assign({ ...preState, fetchdata: action.payload })
    default:
      return Object.assign({ ...preState })
  }
}

const rootReducer = combineReducers({
  addReducer,
  fetchReducer
})

export default rootReducer
