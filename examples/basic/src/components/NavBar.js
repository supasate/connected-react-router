import React from 'react'
import { Link } from 'react-router-dom'

const NavBar = () => (
  <div>
    <div><Link to="/">Home</Link> <Link to="/hello">Hello</Link> <Link to="/counter">Counter</Link></div>
  </div>
)

export default NavBar
