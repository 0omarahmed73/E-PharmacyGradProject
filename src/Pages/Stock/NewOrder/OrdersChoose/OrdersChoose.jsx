import style from "./OrdersChoose.module.css";
import { Col } from "react-bootstrap";
import { Row } from "react-bootstrap";
import { useContext } from "react";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { ShowContext } from "../../../../context/ShowContext";
import useDocumentTitle from "../../../../hooks/useDocumentTitle";
import MenuItem from "../../../../components/MenuItem/MenuItem";
import LinkWithBack from "../../../../components/LinkWithBack/LinkWithBack";
const OrdersChoose = () => {
  const { spinnerElement, spinner, setSpinner } = useContext(ShowContext);
  useEffect(() => {
    setSpinner(true);
    const setTime = setTimeout(() => {
      setSpinner(false);
    }, 300);
    return () => {
      clearInterval(setTime);
    };
  }, [setSpinner]);
  useDocumentTitle("الواردات");
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
      className={style.dashboard + " d-flex  flex-column px-sm-5 px-0 pb-4`"}
    >
      {spinner && spinnerElement}
      <LinkWithBack link="/stock" title="الواردات" />
      <Row
        lg="3"
        sm="1"
        md="2"
        xs="1"
        className="justify-content-center d-flex mt-3"
      >
        <Col>
          <MenuItem
            to="new-order"
            title="إضافة طلبية جديدة"
            padding="40px"
            pt="mt-2 mt-md-0"
          />
        </Col>
        <Col>
          <MenuItem
            to="old-orders"
            title="عرض الطلبيات القديمة"
            padding="40px"
            pt="mt-2 mt-md-0"
          />
        </Col>
      </Row>
    </motion.div>
  );
};

export default OrdersChoose;
