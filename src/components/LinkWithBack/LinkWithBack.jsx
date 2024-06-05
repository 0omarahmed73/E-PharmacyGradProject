import { Link, useNavigate } from "react-router-dom";
import style from "./LinkWithBack.module.css";
import { AiFillRightCircle } from "react-icons/ai";
const LinkWithBack = ({ title, link='' }) => {
  const navigate = useNavigate();
if (link !== '') {
  return (
    <div className="d-flex flex-row align-items-center mb-2 gap-2">
      <Link to={link}>
        <AiFillRightCircle size={24} fill="#28465C" />
      </Link>
      <p className="mainTitle">{title}</p>
    </div>
  );
}
else {
  return (
    <div className="d-flex flex-row align-items-center mb-2 gap-2">
      <button className="border border-0 bg-transparent" onClick={() => navigate(-1)}>
        <AiFillRightCircle size={24} fill="#28465C" />
      </button>
      <p className="mainTitle">{title}</p>
    </div>
  );
}
};

export default LinkWithBack;
