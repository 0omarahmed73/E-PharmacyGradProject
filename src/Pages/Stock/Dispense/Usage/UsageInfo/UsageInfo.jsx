import style from "./UsageInfo.module.css";
import { useContext, useState } from "react";
import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  Container,
  Row,
  Col,
  Table,
  Form,
  Modal,
  Button,
} from "react-bootstrap";
import { BsPencil, BsTrash } from "react-icons/bs";
import { Tooltip } from "react-tooltip";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { createPortal } from "react-dom";
import { ShowContext } from "../../../../../context/ShowContext";
import { MedicineContext } from "../../../../../context/MedicinesContext";
import useDocumentTitle from "../../../../../hooks/useDocumentTitle";
import LinkWithBack from "../../../../../components/LinkWithBack/LinkWithBack";
import Icon from "../../../../../components/Icon/Icon";
import MenuItem from "../../../../../components/MenuItem/MenuItem";
import MediSelected from "../../../../../components/MediSelected/MediSelected";
import ButtonSubmit from "../../../../../components/ButtonSubmit";
const UsageInfo = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
  };
  const [name, setName] = useState("");
  const [medicines, setMedicines] = useState([]);
  const navigate = useNavigate();
  const { spinnerElement, spinner, setSpinner } = useContext(ShowContext);
  const {
    loading,
    error,
    setError,
    setLoading,
    fetchUsageDetails,
    deleteUsage,
  } = useContext(MedicineContext);
  const [type, setType] = useState([]);
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
        setLoading(true);
        const data = await fetchUsageDetails(id);
        console.log(data);
        setType(data.prescription.prsPrescriptionCategory.name);
        setMedicines(data.useageMedicines);
        setName(data.prescription.patient);
        setInfo(data);
      } catch (error) {
        console.error("Error in useEffect:", error);
        setError(error.message);
      }
      setLoading(false);
    };
    func();
  }, [fetchUsageDetails]);
  const handleOrderDelete = async (e) => {
    e.preventDefault();
    const response = await deleteUsage(id);
    if (response.ok) {
      handleClose();
      toast.success("تم حذف الروشتة بنجاح");
      setTimeout(() => {
        navigate(-1);
      }, 2000);
    }
  };
  useDocumentTitle("معلومات الروشتة");
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
      <Row className="flex-row">
        <Col xs="10" md="11">
          <LinkWithBack title={"معلومات الروشتة"} />
        </Col>
        <Col className="d-flex" xs="2" md="1">
          <Icon
            onClick={() => setShow(true)}
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
          حذف الروشتة
        </Tooltip>
      </Row>
      <Tooltip
        anchorSelect="#edit"
        clickable={true}
        place={"right"}
        style={{ fontSize: "12px" }}
      >
        تعديل بيانات الروشتة
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
                  <MenuItem title={info.id} pt="mt-2 mt-md-0" isLink={false}>
                    رقم الروشتة
                  </MenuItem>
                </Col>
                <Col sm="6">
                  <MenuItem
                    title={info.date}
                    pt="mt-2 mt-md-0 p-1"
                    isLink={false}
                  >
                    تاريخ الصرف
                  </MenuItem>
                </Col>
              </Row>
              <Row className="justify-content-center ">
                <Col sm="6">
                  <MenuItem title={name.name} pt="mt-2 mt-md-0" isLink={false}>
                    اسم المريض
                  </MenuItem>
                </Col>
                <Col sm="6">
                  <MenuItem title={type} pt="mt-2 mt-md-0" isLink={false}>
                    نوع الروشتة
                  </MenuItem>
                </Col>
              </Row>
              <Row className="justify-content-center my-2">
                <div
                  className={`${style.mediTable} overflow-y-scroll mt-2 px-1`}
                >
                  <Table striped hover>
                    <thead>
                      <tr>
                        <th className={"showFonts"}>#</th>
                        <th className={"showFonts"}>الدواء</th>
                        <th className={"showFonts"}>الباركود</th>
                        <th className={"showFonts"}>السعر</th>
                        <th className={"showFonts"}>الكمية</th>
                      </tr>
                    </thead>
                    <tbody>
                      {!loading && medicines.length > 0
                        ? medicines.map((medi, index) => (
                            <MediSelected
                              mode="usageInfo"
                              setId={id}
                              setMode={id}
                              key={medi.id}
                              name={medi.medicine.name}
                              quantity={medi.medicine.barcode}
                              price={"-"}
                              supplier={medi.amount}
                              expire={medi.price}
                              id={medi.barcode}
                              idx={index + 1}
                            />
                          ))
                        : null}
                    </tbody>
                    <tbody>
                    <tr>
                        <th className={"showFonts"}></th>
                        <th className={"showFonts"}></th>
                        <th className={"showFonts"}></th>
                        <th className={"showFonts"}></th>
                        <th className={"showFonts"}>السعر الكلي : {info.totalPrice}ج</th>
                      </tr>
                    </tbody>
                  </Table>
                </div>
              </Row>
              <Row className="justify-content-end me-auto ">
                <Col
                  xs="2"
                  className="d-flex justify-content-start align-items-start m-0 p-0"
                >
                  {" "}
                </Col>
                <div className="d-flex flex-row-reverse align-items-end mb-4">
                  <Button
                    className={`btn-main px-3`}
                    onClick={() => window.print()}
                  >
                    طباعة
                  </Button>
                </div>
              </Row>
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
            <Modal.Title>هل انت متاكد من حذف الروشتة</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleOrderDelete}>
              <div className="btns mt-4 d-flex gap-2 me-auto justify-content-end ">
                <ButtonSubmit className="btn-danger">
                  نعم , أريد حذف الروشتة
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

export default UsageInfo;
