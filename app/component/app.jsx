import React, { Component, PropTypes } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { connect } from 'react-redux'
import Nav from './nav.jsx'
import { syncAddTodo, asyncAddTodo } from '../action'

const App = class app extends Component {
  render() {
    const { count, incr, showdata, reqr } = this.props
    return (
      <div>
        <Nav />
        <ReactCSSTransitionGroup
          transitionName="taggleRoute"
          component="div"
          transitionEnterTimeout={300}
          transitionLeaveTimeout={300}
          style={{ position: 'relative' }}
        >
          <div
            key={this.props.location.pathname}
            style={{ width: '100%', position: 'absolute' }}
          >
            <button onClick={incr} style={{ width: '120px', height: '40px', color: 'red' }}>{count}</button>
            <button onClick={reqr} style={{ width: '120px', height: '40px', color: 'red' }}>click me</button>
            <p>{ showdata }</p>
            {this.props.children}
          </div>
        </ReactCSSTransitionGroup>
      </div>)
  }
}

App.propTypes = {
  children: PropTypes.node.isRequired,
  count: PropTypes.number.isRequired,
  incr: PropTypes.func.isRequired,
  reqr: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired
}

function mapStateToProps(state) {
  return {
    count: state.addReducer.count,
    showdata: state.fetchReducer.fetchdata
  }
}

function mapDispatchToProps(dispatch) {
  return {
    incr: () => dispatch(syncAddTodo(0)),
    reqr: () => dispatch(asyncAddTodo('api/hello'))
  }
}

const APP = connect(mapStateToProps, mapDispatchToProps)(App)

export default APP
