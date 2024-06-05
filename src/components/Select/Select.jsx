import { FloatingLabel } from "react-bootstrap"
import style from "./Select.module.css"
import { Form } from "react-bootstrap"
import { useEffect } from "react"
import { useContext } from "react"
import { ShowContext } from "../../context/ShowContext"

const Select = ({label , children , width , value, icon = '' , error , touched , id , ...props}) => {
  useEffect(() => {
      sessionStorage.setItem(`${id}-${window.location.pathname}`, value);
  } , [id, value])
  return (
    <Form.Group className={style.select}>
      <FloatingLabel
          controlId={id}
          label={label}
          className="selectlabel"
        >
          <p className={style.icon}>{icon}</p>
          <Form.Select isInvalid={error && touched} value={value} {...props} aria-label="Floating label select example">
            {children}
          </Form.Select>
          <div className={style.under}>
      </div>
      <Form.Text className="text-danger"></Form.Text>
        </FloatingLabel>
    </Form.Group>
  )
}

export default Select