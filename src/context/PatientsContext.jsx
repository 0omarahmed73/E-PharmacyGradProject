import { createContext } from "react";

const PatientContext = createContext();

import React from 'react'

const PatientProvider = ({children}) => {
  return (
    <PatientContext.Provider value={{
      
    }}>
      {children}
    </PatientContext.Provider>
  )
}

export default PatientProvider