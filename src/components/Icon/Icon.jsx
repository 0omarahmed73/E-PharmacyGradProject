import style from './Icon.module.css'

const Icon = ({icon , shadow = true , children , ...props}) => {
  return (
    <div className={`${style.icon} ${shadow ? '' : 'shadow-none'}`} {...props} >
      {icon}
      {children}
    </div>
  )
}

export default Icon