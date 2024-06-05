import React from 'react'
import { Button } from 'react-bootstrap'

const ButtonSubmit = ({children , ...props}) => {
  return (
    <Button {...props} type='submit'>{children}</Button>
  )
}

export default ButtonSubmit