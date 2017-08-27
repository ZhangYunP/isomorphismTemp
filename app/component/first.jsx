import React, { Component } from 'react'

export default class First extends Component {
  constructor(props, context) {
    super(props, context)
    this.handleClick = this.handleClick.bind(this)
    this.state = {
      num: 0
    }
  }
  componentDidMount() {
    this.changeNum(() => {
      this.setState({
        num: this.state.num + 1
      })
    })
  }

  changeNum(cb) {
    cb()
  }

  handleClick() {
    const CkNum = this.state.num + 1
    this.setState({
      num: CkNum
    })
  }

  render() {
    return (<button onClick={this.handleClick}>
      {this.state.num}
    </button>)
  }
}
