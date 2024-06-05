import style from './IconV2.module.css'

const IconV2 = ({icon , ...props}) => {
  return (
    <div className={style.iconV2} {...props}>
      {icon}
    </div>
  )
}

export default IconV2