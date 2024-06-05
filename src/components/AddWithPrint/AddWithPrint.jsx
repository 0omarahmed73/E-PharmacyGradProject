import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import style from "./AddWithPrint.module.css";

const AddWithPrint = ({message , link}) => {
  return (
    <div className="d-flex flex-row-reverse gap-3 align-items-end">
      <Link to={link}>
        <Button className={`${style.btn} mt-3`}>{message}</Button>
      </Link>
      <Button className={`${style.btn} mt-3`} onClick={() => window.print()}>
        طباعة
      </Button>
    </div>
  );
};

export default AddWithPrint;
