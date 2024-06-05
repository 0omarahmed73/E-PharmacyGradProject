import style from "./MedicineInfo.module.css";
import useDocumentTitle from "../../../hooks/useDocumentTitle";
import { useContext, useState } from "react";
import { ShowContext } from "../../../context/ShowContext";
import { useEffect } from "react";
import { motion } from "framer-motion";
import LinkWithBack from "../../../components/LinkWithBack/LinkWithBack";
import { Container, Row, Col, Button, Form, Modal } from "react-bootstrap";
import MenuItem from "../../../components/MenuItem/MenuItem";
import Icon from "../../../components/Icon/Icon";
import { BsPencil, BsTrash } from "react-icons/bs";
import { Tooltip } from "react-tooltip";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MedicineContext } from "../../../context/MedicinesContext";
import { ToastContainer, toast } from "react-toastify";
import ButtonSubmit from "../../../components/ButtonSubmit";
import { createPortal } from "react-dom";
const MedicineInfo = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
  };

  const handleShow = () => {
    setShow(true);
  };
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const { spinnerElement, spinner, setSpinner } = useContext(ShowContext);
  const {
    FetchMedicineInfos,
    loading,
    error,
    setError,
    setLoading,
    deleteMedicine,
  } = useContext(MedicineContext);
  const [info, setInfo] = useState([]);
  const { id } = useParams();
  useEffect(() => {
    setSpinner(true);
    const setTime = setTimeout(() => {
      setSpinner(false);
    }, 300);
    return () => {
      clearInterval(setTime);
    };
  }, [setSpinner]);
  useEffect(() => {
    const func = async () => {
      try {
        const data = await FetchMedicineInfos(id);
        setInfo(data);
        setName(data.medicineCategory.name);
      } catch (error) {
        setError(error.message);
      }
    };
    func();
  }, [FetchMedicineInfos]);
  const handleMedicineDelete = async (e) => {
    e.preventDefault();
    const response = await deleteMedicine(id);
    if (response.ok) {
      toast.success("تم حذف الدواء بنجاح");
      setTimeout(() => {
        navigate(-1);
      }, 2000);
      handleClose();
    }
  };
  useDocumentTitle("معلومات الدواء");
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
      style={{ margin: "auto" }}
      className={" d-flex flex-column px-sm-5 px-0 pb-4`"}
    >
      {spinner && spinnerElement}
      <Row className="flex-row justify-content-between">
        <Col xs="9" md="10">
          <LinkWithBack title={"معلومات الدواء"} />
        </Col>
        <Col className="d-flex gap-1" xs="3" md="2">
          <Link to={`/stock/medicines/edit/${id}?return=true`}>
            <Icon id="edit" icon={<BsPencil fill="white" />} />
          </Link>
          <Icon
            onClick={handleShow}
            id="delete"
            icon={<BsTrash fill="white" />}
          />
        </Col>

        <Tooltip
          anchorSelect="#delete"
          clickable={true}
          place={"left"}
          style={{ fontSize: "12px" }}
        >
          حذف الدواء
        </Tooltip>
      </Row>
      <Tooltip
        anchorSelect="#edit"
        clickable={true}
        place={"right"}
        style={{ fontSize: "12px" }}
      >
        تعديل بيانات الدواء
      </Tooltip>
      <Container className="d-flex mt-3 justify-content-center align-items-center m-auto">
        <div style={{ width: "90%" }}>
          {loading && !error && info.length === 0 ? (
            <div className="text-center text-black p-0 m-0 mt-5 fw-bold">
              جاري التحميل...
            </div>
          ) : !loading && !error && info ? (
            <>
              <Row className="justify-content-center mb-1">
                <Col sm="6">
                  <MenuItem title={id} pt="mt-2 mt-md-0" isLink={false}>
                    كود الدواء
                  </MenuItem>
                </Col>
                <Col sm="6">
                  <MenuItem
                    title={info.arabicname}
                    pt="mt-2 mt-md-0"
                    isLink={false}
                  >
                    اسم الدواء باللغة العربية
                  </MenuItem>
                </Col>
              </Row>
              <Row className="justify-content-center ">
                <Col sm="6">
                  <MenuItem title={info.name} pt="mt-2 mt-md-0" isLink={false}>
                    اسم الدواء باللغة الانجليزية
                  </MenuItem>
                </Col>
                <Col sm="6">
                  <MenuItem
                    title={info.activeingredient}
                    pt="mt-2 mt-md-0"
                    isLink={false}
                  >
                    المادة الفعالة
                  </MenuItem>
                </Col>
              </Row>
              <Row className="justify-content-center my-2">
                <Col sm="6">
                  <MenuItem
                    title={info.manufacturer}
                    pt="mt-2 mt-md-0"
                    isLink={false}
                  >
                    الشركة المصنعة
                  </MenuItem>
                </Col>
                <Col sm="6">
                  <MenuItem title={name} pt="mt-2 mt-md-0" isLink={false}>
                    نوع الدواء
                  </MenuItem>
                </Col>
              </Row>
              <Row className="justify-content-center mb-2">
                <Col sm="4">
                  <MenuItem
                    title={info.unit || "لا يوجد"}
                    pt="mt-2 mt-md-0"
                    isLink={false}
                  >
                    الوحدة
                  </MenuItem>
                </Col>
                <Col sm="4">
                  <MenuItem
                    title={info.alertexpired}
                    pt="mt-2 mt-md-0"
                    isLink={false}
                  >
                    التنبيه قبل
                  </MenuItem>
                </Col>
                <Col sm="4">
                  <MenuItem
                    title={info.alertamount + " عبوة"}
                    pt="mt-2 mt-md-0"
                    isLink={false}
                  >
                    التنبيه قبل
                  </MenuItem>
                </Col>
              </Row>
              <div className="d-flex flex-row-reverse gap-3 align-items-end mt-4">
          <Button className="btn-main px-5" onClick={() => window.print()}>
            طباعة
          </Button>
        </div>
            </>
          ) : error ? (
            <p className="text-center p-0 m-0 mt-5 fw-bold">
              عذراً , حدث خطأ ما , يرجى المحاولة مرة أخرى
            </p>
          ) : (
            <p className="text-center text-white p-0 m-0 mt-5 fw-bold">
              عذراً , لا توجد نتائج
            </p>
          )}
        </div>
      </Container>

      {createPortal(
        <Modal show={show} centered={true} onHide={handleClose}>
          <Modal.Header>
            <Modal.Title>هل انت متاكد من حذف الدواء</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleMedicineDelete}>
              <div className="btns mt-4 d-flex gap-2 me-auto justify-content-end ">
                <ButtonSubmit className="btn-danger">
                  نعم , أريد حذف الدواء
                </ButtonSubmit>
                <Button className="btn-main" onClick={handleClose}>
                  إغلاق
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>,
        document.getElementById("modal")
      )}
    </motion.div>
  );
};

export default MedicineInfo;
