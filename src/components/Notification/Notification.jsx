import { BsFillBellFill } from 'react-icons/bs'
import style from './Notification.module.css'
export const Notification = ({text , icon}) => {
  return (
    <div className={style.notification}>
      <div className={style.container2}>
    <div className={style.icon}>
    {icon}
    </div>
    <p>{text}</p>
  </div>
    </div>
  )
}
