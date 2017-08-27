import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { Router, browserHistory } from 'react-router'
import routes from './routes/routes'
import configureStore from './store/configureStore'

if (module.hot) {
  module.hot.accept();
}

const initState = window.__initState__
const store = configureStore(initState)
const component = (
  <Provider store={store}>
    <Router routes={routes} history={browserHistory} />
  </Provider>
)
const rootEle = document.getElementById('root')

render(component, rootEle)
