import { BiPencil } from "react-icons/bi";
import style from "./MedicineItem.module.css";
import { BsArrowLeft } from "react-icons/bs";
import { Link } from "react-router-dom";
const MedicineItem = ({
  id,
  name,
  idx,
    active = 'لا يوجد' ,
  icon,
  type = "medicine",
  mainType = "medicine",
  quantity = '',
  to= '',
  ...props
}) => {
  return (
    <div {...props}>
      {mainType === "collage" ? (
      <Link to={to} style={{all : 'unset'}}>
      <div className={style.item}>
      <h1 className={style.index}>{idx}</h1>
      <h1 className={style.medicine} dir="ltr">
        {name}
      </h1>
      <div className={style.icons}>
        <div>
            <div className="d-flex gap-1 fw-bold">
              {quantity}
            </div>
        </div>
      </div>
    </div>
  </Link>  
      ) : mainType === "inventory" ? (
      <Link to={to} style={{all : 'unset'}}>
        <div className={style.item}>
        <h1 className={style.index2}>{idx}</h1>
          <h1 className={style.medicine2}>{name}</h1>
        <h1 className={style.active} dir="ltr">
          {active}
        </h1>
        <div className={style.icons}>
          <div>
              <div className="d-flex gap-1 fw-bold">
                {quantity}
              </div>
          </div>
        </div>
      </div>
    </Link>  
      ) : (
      <div className={style.item}>
        <h1 className={style.index}>{idx}</h1>
        <h1 className={style.medicine} dir="ltr">
          {name}
        </h1>
        <div className={style.icons}>
          <div>
            {mainType === "medicine" ? (
              <div className="d-flex gap-1">
                <div>
                <Link to={`/stock/medicines/edit/${idx}?return=yes`}>
                  <BiPencil className={style.bordered} />
                </Link>
                </div>

                <Link to={`/stock/medicines/info/${idx}`}>
                  <BsArrowLeft className={style.bordered} />
                </Link>
              </div>
            ) : mainType === "patients" ? (
              <div className="d-flex gap-1">
                <div>
                <Link to={`/patients/edit/${idx}?return=yes`}>
                  <BiPencil className={style.bordered} />
                </Link>
                </div>

                <Link to={`/patients/${type}/${idx}`}>
                  <BsArrowLeft className={style.bordered} />
                </Link>
              </div>
            ) : mainType === "dispense" ? (
              <div className="d-flex gap-1">
                <div>
                  <BiPencil className={style.bordered} />
                </div>
                <Link
                  to={`/stock/medicine-dispense/old-dispenses/${type}/${idx}`}
                >
                  <BsArrowLeft className={style.bordered} />
                </Link>
              </div>
            ) : mainType === `orders` ? (
              <div className="d-flex gap-1">
                <div>
                  <Link to={`/stock/orders/edit/${id}?return=yes`}>
                    <BiPencil className={style.bordered} />
                  </Link>
                </div>

                <Link to={`/stock/orders/old-orders/${id}`}>
                  <BsArrowLeft className={style.bordered} />
                </Link>
              </div>
            ) : mainType === 'prescriptions' ? (
              <div className="d-flex gap-1">
                <div>
                  <Link to={`/stock/medicine-dispense/edit/${id}?return=yes`}>
                    <BiPencil className={style.bordered} />
                  </Link>
                </div>

                <Link to={`/stock/medicine-dispense/old-dispenses/${type}/${id}`}>
                  <BsArrowLeft className={style.bordered} />
                </Link>
              </div>
            
            ) : mainType === 'usage' ? (
              <div className="d-flex gap-1">
                <Link to={`/stock/medicine-dispense/usage/${id}`}>
                  <BsArrowLeft className={style.bordered} />
                </Link>
              </div>
            
            ) : mainType === "collage-usage" ? (
              <div className="d-flex gap-1">
                <div>
                <Link to={`/stock/medicine-dispense/collage-usage/edit/${idx}?return=yes`}>
                  <BiPencil className={style.bordered} />
                </Link>
                </div>

                <Link to={`/stock/medicine-dispense/collage-usage/${idx}`}>
                  <BsArrowLeft className={style.bordered} />
                </Link>
              </div>
            ) : ''}
          </div>
        </div>
      </div> )}
    </div>

  );
};
export default MedicineItem;
