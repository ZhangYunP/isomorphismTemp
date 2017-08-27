import React from 'react'
import { Link } from 'react-router'

const Nav = () => {
  const navComponent = (
    <div>
      <Link to="/" style={{ color: 'black' }} activeStyle={{ color: 'red' }}>index</Link>
      <Link to="/first" style={{ color: 'black' }} activeStyle={{ color: 'red' }}>first</Link>
      <Link to="/second" style={{ color: 'black' }} activeStyle={{ color: 'red' }}>second</Link>
    </div>)
  return navComponent
}

export default Nav
