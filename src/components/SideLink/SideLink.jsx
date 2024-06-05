import React from 'react'
import { NavLink } from 'react-router-dom'
import style from './SideLink.module.css'
const SideLink = ({children , ...props}) => {
  return (
      <NavLink className={style.linkNav} {...props}>{children}</NavLink>
  )
}

export default SideLink