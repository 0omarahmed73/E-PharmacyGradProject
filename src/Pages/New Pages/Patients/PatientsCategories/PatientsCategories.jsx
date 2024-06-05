import { useContext, useState } from "react";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Container, Row, Col } from "react-bootstrap";
import useDocumentTitle from "../../../../hooks/useDocumentTitle";
import { ShowContext } from "../../../../context/ShowContext";
import LinkWithBack from "../../../../components/LinkWithBack/LinkWithBack";
import MenuItem from "../../../../components/MenuItem/MenuItem";
const PatientsCategories = () => {
  const [value, setValue] = useState("");
  const medicines = ["Panadol", "Antiflu", "An", "Hamada", "Mohsen"];
  const [medicines2, setMedicines] = useState(medicines);
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
  useEffect(() => {
    const newValue = value.toLowerCase();
    const newMedicines = medicines.filter((medicine) => {
      return medicine.toLowerCase().startsWith(newValue);
    });
    setMedicines(newMedicines);
  }, [value]);
  useDocumentTitle("المرضى");
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
      <p className="mainTitle mb-2">المرضى</p>
      <Container className="d-flex justify-content-center align-items-center m-auto">
        <div className="d-flex flex-column justify-content-center align-items-center mt-3 " style={{ width: "90%" }}>
          <Row className="justify-content-center w-100 ">
            <Col sm='6' xl='5'>
              <MenuItem padding="40px" isLink={true} to="chronic" title={"مرض مزمن"} />
            </Col>
            <Col sm='6' xl='5'>
              <MenuItem padding="40px" className='mt-2 mt-sm-0' isLink={true} to='emergency' title={"مرض غير مزمن"} />
            </Col>
          </Row>
          <Row className="justify-content-center w-100 ">
            <Col sm='6' xl='5'>
              <MenuItem padding="40px" className='mt-2' isLink={true} to="all" title={"جميع المرضى"} />
            </Col>
            <Col sm='6' xl='5'>
              <MenuItem padding="40px" className='mt-2 text-center ' isLink={true} to="/patients/add-new-patient" title={"إضافة مريض جديد"} />
            </Col>
          </Row>
        </div>
      </Container>
    </motion.div>
  );
};

export default PatientsCategories;
