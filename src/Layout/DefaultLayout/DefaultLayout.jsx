import { Outlet, useLocation } from "react-router-dom";
import style from "./DefaultLayout.module.css";
import { Col, Container, Row } from "react-bootstrap";
import { HiMenuAlt3 } from "react-icons/hi";
import { AiFillBell } from "react-icons/ai";
import logo from "../../assets/Group45.png";
import SideLink from "../../components/SideLink/SideLink";
import { useContext, useEffect, useRef, useState } from "react";
import Icon from "../../components/Icon/Icon";
import Profile from "../../components/Profile/Profile";
import Sidebar from "./../../components/Sidebar";
import Navbar from "./../../components/Navbar";
import { ShowContext } from "../../context/ShowContext";

const DefaultLayout = () => {
  const location = useLocation();
  const { dropDown, setDropDown, setShowNotifications } =
    useContext(ShowContext);
  if (!localStorage.getItem("sidebar")) {
    localStorage.setItem("sidebar", false);
  }
  const { show, setShow } = useContext(ShowContext);

  return (
    <div
      className={style.default}
      onClick={() => {
        setDropDown(false);
      }}
    >
      <Row xs={"12"} className="m-auto">
        <Sidebar />
        <Col>
          <Navbar className="mb-5" />
          <Container
            className={location.pathname !== "/" ? "pt-4" : "pt-2"}
            onClick={() => setShowNotifications(false)}
          >
            <Outlet />
          </Container>
        </Col>
      </Row>
      {show && (
        <div
          className={style.overlay}
          onClick={() => {
            setShow(false);
            setShowNotifications(false);
          }}
        />
      )}
    </div>
  );
};

export default DefaultLayout;
