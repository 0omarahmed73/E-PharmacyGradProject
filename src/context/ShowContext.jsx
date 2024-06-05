import { createContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export const ShowContext = createContext();

export const ShowProvider = ({ children }) => {
  const {pathname} = useLocation();
  const spinnerElement = (
    <div className="loadingSpinner">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
  const [spinner, setSpinner] = useState(false);
  const [show, setShow] = useState(JSON.parse(localStorage.getItem("sidebar")));
  useEffect(() => {
    localStorage.setItem("sidebar", show);
  }, [show]);
  const [dropDown, setDropDown] = useState(false);
  const [showNotifications , setShowNotifications] = useState(false);
  return (
    <ShowContext.Provider
      value={{
        show,
        setShow,
        dropDown,
        setDropDown,
        spinner,
        setSpinner,
        spinnerElement,
        pathname,
        showNotifications,
        setShowNotifications
      }}
    >
      {children}
    </ShowContext.Provider>
  );
};
