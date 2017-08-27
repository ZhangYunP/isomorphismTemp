import { polyfill } from 'es6-promise'
import fetch from 'isomorphic-fetch'

export function syncAddTodo(initNum) {
  return {
    type: 'ADD',
    payload: initNum
  }
}
export function errTodo(e) {
  return {
    type: 'FETCHERROR',
    payload: `error fetch ${e}`
  }
}
export function asyncAddTodo(url) {
  return async (dispatch) => {
    try {
      const res = await fetch(url)
      const json = await res.json()
      const resdate = {
        type: 'FETCHSUCESS',
        payload: json
      }
      dispatch(resdate)
    } catch (e) {
      dispatch(errTodo(e))
    }
  }
}
const actionCreator = {
  syncAddTodo,
  asyncAddTodo
}
export { actionCreator as default }
