import { FloatingLabel, Form } from "react-bootstrap";
import style from "./Input.module.css";
import { useEffect } from "react";

const Input = ({label , icon , direction = 'rtl' , id , name , width , value , error , touched , ...props}) => {
    useEffect(() => {
        sessionStorage.setItem(`${name}-${window.location.pathname}`, value);
    }, [name, value]);
  return (
<Form.Group className={style.input} style={{width : width}}>
      <FloatingLabel controlId={id} label={label}>
        <Form.Control style={{direction : direction}} value={value} {...props} isInvalid={error && touched} />
        <p className={style.icon}>{icon}</p>
      </FloatingLabel>
      <div className={style.under}>
      </div>
      <Form.Text className="text-danger">{error && touched ? error : ''}</Form.Text>
    </Form.Group>
  );
};

export default Input;
