import React from 'react'
import { Button } from 'react-bootstrap'
import { GrCubes } from 'react-icons/gr'
import { Link } from 'react-router-dom'
import style from './List.module.css'
const List = ({title , icon , color = '#EBF9EA'}) => {
  return (
    <div className={style.list}>
      <div className={style.dashboard}>
    <div className={style['container-all']}>
  <div className={style['icon-text']}>
    <div className={style.icon} style={{backgroundColor : color}}>
      {icon}
    </div>
    <div className={style.text}>{title}</div>
  </div>
  <div className={style.containerA}  style={{backgroundColor : color}}>
    <ul className={style.list}>
      <li>
        <Link className={style.listItem} href="">
          panadol
        </Link>
      </li>
      <li>
        <Link className={style.listItem} href="">
          lopid
        </Link>
      </li>
      <li>
        <Link className={style.listItem} href="">
          setren{" "}
        </Link>
      </li>
      <li>
        <Link className={style.listItem} href="">
          paxlovid{" "}
        </Link>
      </li>
      <li>
        <Link className={style.listItem} href="">
          setren{" "}
        </Link>
      </li>
      <li>
        <Link className={style.listItem} href="">
          paxlovid{" "}
        </Link>
      </li>
      <li>
        <Link className={style.listItem} href="">
          lopid
        </Link>
      </li>
    </ul>
  </div>
  <Button style={{borderRadius: '20px'}} variant="danger">اظهار الكل</Button>
</div>
  </div>
    </div>
  )
}

export default List