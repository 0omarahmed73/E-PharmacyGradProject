import { Col, Row } from 'react-bootstrap';
import style from './Medicine.module.css'
import { FaAddressBook, FaAdn } from 'react-icons/fa';
import useDocumentTitle from '../../../hooks/useDocumentTitle';
import MenuItem from '../../../components/MenuItem/MenuItem';
import { GiMedicinePills, GiMedicines } from 'react-icons/gi';
import { BiInjection } from 'react-icons/bi';
import { useContext } from 'react';
import { ShowContext } from '../../../context/ShowContext';
import { useEffect } from 'react';
import { AiFillRightCircle } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import LinkWithBack from '../../../components/LinkWithBack/LinkWithBack';
const Medicine = () => {
  const { spinnerElement , spinner , setSpinner } = useContext(ShowContext);
  useEffect(() => {
    setSpinner(true);
    const setTime = setTimeout(() => {
      setSpinner(false);
    }, 300);
    return () => {
      clearInterval(setTime)
    }
  } , [setSpinner]);
  useDocumentTitle(" الأدوية");
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
      className={style.dashboard + " d-flex flex-column px-sm-5 px-0 pb-4`"}
    >
      {spinner && spinnerElement}
      <LinkWithBack link='/stock' title='الأدوية' />
      <Row
        lg="3"
        sm="1"
        md="2"
        xs="1"
        className="justify-content-center d-flex"
      >
        <Col>
          <MenuItem
            title="الأقراص"
            icon={<GiMedicines size={32} color="white" />}
            padding="30px"
            pt="mt-2 mt-md-0"
            to='/stock/medicines/type/pills'
          />
        </Col>
        <Col>
          <MenuItem
            title="امبولات"
            icon={<BiInjection size={32} color="white" />}
            padding="30px"
            pt="mt-2 mt-md-0"
            to='/stock/medicines/type/ampoules'

          />
        </Col>
      </Row>
      <Row
        lg="3"
        sm="1"
        md="2"
        xs="1"
        className="pt-md-2 justify-content-center d-flex"
      >
        <Col>
          <MenuItem
            title="منوعات"
            icon={<GiMedicinePills size={32} color="white" />}
            padding="30px"
            pt="mt-2 mt-md-0"
            to='/stock/medicines/type/mix'
          />
        </Col>
        <Col>
          <MenuItem
            title="جميع الانواع"
            padding="46px"
            pt="mt-2 mt-md-0"
            to='/stock/medicines/type/all'
          />
        </Col>
      </Row>
      <Row
        lg="3"
        sm="1"
        md="2"
        xs="1"
        className="pt-md-2 justify-content-center d-flex"
      >
        <Col>
          <MenuItem
            title="اضافة دواء"
            icon={<GiMedicinePills size={32} color="white" />}
            padding="30px"
            pt="mt-2 mt-md-0 mb-2"
            to='/stock/medicines/add-medicine'
          />
        </Col>
      </Row>
    </motion.div>
  );
};


export default Medicine