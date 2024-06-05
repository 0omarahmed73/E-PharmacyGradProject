/* eslint-disable react/prop-types */
import { FloatingLabel, Form } from "react-bootstrap";
import style from "./InputAutoComplete2.module.css";
import { useState, useEffect, forwardRef } from "react";
import { Link } from "react-router-dom";

// eslint-disable-next-line react/display-name
const InputAutoComplete2 = forwardRef(
  (
    {
      label,
      icon,
      name,
      id,
      width,
      linkAdded,
      message,
      value = "",
      autoFocus = true,
      error,
      touched,
      setValue,
      direction = "rtl",
      dropFunction,
      items,
      formik = false,
      allValues,
      linkedAttr,
      change,
      falseChange,
      ...props
    },
    ref
  ) => {
    const [showDropDown, setShowDropDown] = useState(false);
    const [selected, setSelected] = useState(false);
    useEffect(() => {
      if (formik) {
        if (error && touched) {
          setShowDropDown(false);
        }
      } else {
        if (error) {
          setShowDropDown(false);
        }
      }
    }, [error, formik, touched]);
    useEffect(() => {
      sessionStorage.setItem(`${name}-${window.location.pathname}`, value);
      if (value.trim().length > 0 && !selected && change) {
        setShowDropDown(true);
        dropFunction();
      } else {
        setShowDropDown(false);
      }

      if (selected && change) {
        setSelected(false);
        setShowDropDown(true);
      }
    }, [name, value, selected, change]);
    return (
      <Form.Group className={style.input} style={{ width: width }}>
        <FloatingLabel controlId={id} label={label}>
          <Form.Control
            ref={ref}
            autoFocus={autoFocus}
            style={{ direction: direction }}
            autoComplete="off"
            value={value}
            name={name}
            {...props}
            isInvalid={formik ? error && touched : error}
          />
          <p className={style.icon}>{icon}</p>
        </FloatingLabel>
        <div className={style.under}></div>
        <Form.Text className="text-danger">
          {formik ? (error && touched ? error : "") : error}
        </Form.Text>
        {showDropDown && (
          <div className={style.dropDownMenu} style={{ direction: direction }}>
            {items.length ? (
              items.map((dropdownItem, index) => (
                <div
                  key={index}
                  onClick={() => {
                    falseChange();
                    formik ? setValue(name, dropdownItem) : setValue(dropdownItem);
                    formik && linkedAttr
                      ? linkedAttr.map((attr) => {
                          setValue(
                            attr,
                            allValues.find((val) => val.name === dropdownItem)[attr]
                          );
                        })
                      : !formik && linkedAttr
                      ? linkedAttr.map((attr) => {
                          attr.setValue(
                            allValues.find((val) => val.name === dropdownItem)[
                              attr.name
                            ]
                          );
                        })
                      : null;
                    setShowDropDown(false);
                    setSelected(true);
                  }}
                  className={style.item}
                >
                  {dropdownItem}
                </div>
              ))
            ) : (
              <Link to={linkAdded} className={style.item}>
                {" "}
                {message}{" "}
              </Link>
            )}
          </div>
        )}
      </Form.Group>
    );
  }
);

export default InputAutoComplete2;