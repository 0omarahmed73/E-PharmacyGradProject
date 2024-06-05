import style from "./OrderInfo.module.css";
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
import { ShowContext } from "../../../../context/ShowContext";
import { MedicineContext } from "../../../../context/MedicinesContext";
import useDocumentTitle from "../../../../hooks/useDocumentTitle";
import LinkWithBack from "../../../../components/LinkWithBack/LinkWithBack";
import Icon from "../../../../components/Icon/Icon";
import MenuItem from "../../../../components/MenuItem/MenuItem";
import MediSelected from "../../../../components/MediSelected/MediSelected";
import ButtonSubmit from "../../../../components/ButtonSubmit";
import { createPortal } from "react-dom";
const OrderInfo = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
  };

  const handleShow = () => {
    setShow(true);
  };

  const [name, setName] = useState("");
  const [medicines, setMedicines] = useState([]);
  const navigate = useNavigate();
  const { spinnerElement, spinner, setSpinner } = useContext(ShowContext);
  const { loading, error, setError, setLoading, deleteOrder, FetchOrderInfo } =
    useContext(MedicineContext);
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
        const data = await FetchOrderInfo(id);
        setMedicines(data.orderMedicines);
        setName(data.supplier.name);
        setInfo(data);
      } catch (error) {
        setError(error.message);
      }
      setLoading(false);
    };
    func();
  }, [FetchOrderInfo]);
  const handleOrderDelete = async (e) => {
    e.preventDefault();
    const response = await deleteOrder(id);
    if (response.ok) {
      toast.success("تم حذف الطلبية بنجاح");
      setTimeout(() => {
        navigate(-1);
      }, 2000);
    } else {
      setError(null);
      setLoading(false);
    }
    handleClose();
  };
  useDocumentTitle("معلومات الطلبية");

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
          <LinkWithBack title={"معلومات الطلبية"} />
        </Col>
        <Col className="d-flex gap-1" xs="3" md="2">
          <Link to={`/stock/orders/edit/${id}?return=yes`}>
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
          حذف الطلبية
        </Tooltip>
      </Row>
      <Tooltip
        anchorSelect="#edit"
        clickable={true}
        place={"right"}
        style={{ fontSize: "12px" }}
      >
        تعديل بيانات الطلبية
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
                  <MenuItem
                    title={info.supplyrequest}
                    pt="mt-2 mt-md-0"
                    isLink={false}
                  >
                    طلب الإمداد
                  </MenuItem>
                </Col>
                <Col sm="6">
                  <MenuItem
                    title={info.deliveryrequest}
                    pt="mt-2 mt-md-0"
                    isLink={false}
                  >
                    إذن التسليم
                  </MenuItem>
                </Col>
              </Row>
              <Row className="justify-content-center ">
                <Col sm="6">
                  <MenuItem
                    title={info.dateofsupply}
                    pt="mt-2 mt-md-0"
                    isLink={false}
                  >
                    تاريخ التوريد
                  </MenuItem>
                </Col>
                <Col sm="6">
                  <MenuItem title={name} pt="mt-2 mt-md-0" isLink={false}>
                    اسم المورد
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
                        <th className={"showFonts"}>الكمية</th>
                        <th className={"showFonts"}>الصلاحية</th>
                        <th className={"showFonts"}>الشركة المصنعة</th>
                        <th className={"showFonts"}>السعر</th>
                      </tr>
                    </thead>
                    <tbody>
                      {!loading && medicines.length > 0
                        ? medicines.map((medi, index) => (
                            <MediSelected
                              mode="orderInfo"
                              setId={id}
                              setMode={id}
                              key={medi.medicine.id}
                              name={medi.medicine.name}
                              quantity={medi.amount}
                              price={medi.price}
                              supplier={medi.medicine.manufacturer}
                              expire={medi.expirydate}
                              id={medi.medicine.barcode}
                              idx={index + 1}
                            />
                          ))
                        : null}
                    </tbody>
                  </Table>
                </div>
              </Row>
              <div className="d-flex flex-row-reverse align-items-end mt-3 mb-4">
                <Button
                  className={`btn-main px-3`}
                  onClick={() => window.print()}
                >
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
            <Modal.Title>هل انت متاكد من حذف الطلبية</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleOrderDelete}>
              <div className="btns mt-4 d-flex gap-2 me-auto justify-content-end ">
                <ButtonSubmit className="btn-danger">
                  نعم , أريد حذف الطلبية
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

export default OrderInfo;
