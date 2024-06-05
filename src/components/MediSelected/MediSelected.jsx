import style from "./MediSelected.module.css";
import Icon from "./../Icon/Icon";
import { MdModeEditOutline } from "react-icons/md";
import { BsFillTrashFill } from "react-icons/bs";

const MediSelected = ({
  mode,
  name,
  quantity,
  idx,
  id,
  handleDelete,
  handleEdit,
  setMode,
  setId,
  supplier,
  price,
  supply,
  expire,
  show2,
}) => {
  if (mode !== "order" && mode !== "orderInfo" && mode !== 'usageInfo') {
    return (
      <tr>
        <td>{idx}</td>
        <td>{name}</td>
        <td>{quantity}</td>
        <td>
          <div className="icons d-flex gap-2 justify-content-center ">
            <Icon
              onClick={() => {
                setMode("edit");
                handleEdit(id);
                setId(id);
              }}
              icon={<MdModeEditOutline fill="white" size={12} />}
              shadow={false}
              style={{ width: "25px", height: "25px" }}
            />
            <Icon
              onClick={() => handleDelete(id)}
              icon={<BsFillTrashFill fill="white" size={12} />}
              shadow={false}
              style={{ width: "25px", height: "25px" }}
            />
          </div>
        </td>
      </tr>
    );
  } else if (mode === "order") {
    return (
      <tr>
        <td className={show2 ? "showFonts" : "noshowFonts"}>{idx}</td>
        <td className={show2 ? "showFonts" : "noshowFonts"}>{name}</td>
        <td className={show2 ? "showFonts" : "noshowFonts"}>{quantity}</td>
        <td
          className={show2 ? "showFonts" : "noshowFonts"}
          style={{ whiteSpace: "wrap" }}
        >
          {expire}
        </td>
        <td className={show2 ? "showFonts" : "noshowFonts"}>{supplier}</td>
        <td className={show2 ? "showFonts" : "noshowFonts"}>{price}</td>
        <td className={show2 ? "showFonts" : "noshowFonts"}>
          <div className="icons d-flex gap-2 justify-content-start ">
            <Icon
              onClick={() => {
                setMode("edit");
                handleEdit(id, name);
                setId(id);
              }}
              icon={<MdModeEditOutline fill="white" size={12} />}
              shadow={false}
              style={{ width: "25px", height: "25px" }}
            />
            <Icon
              onClick={() => handleDelete(id)}
              icon={<BsFillTrashFill fill="white" size={12} />}
              shadow={false}
              style={{ width: "25px", height: "25px" }}
            />
          </div>
        </td>
      </tr>
    );
  } else if (mode === "orderInfo") {
    return (
      <tr>
        <td className={style.biggerFonts}>{idx}</td>
        <td className={style.biggerFonts}>{name}</td>
        <td className={style.biggerFonts}>{quantity}</td>
        <td className={style.biggerFonts} style={{ whiteSpace: "wrap" }}>
          {expire}
        </td>
        <td className={style.biggerFonts}>{supplier}</td>
        <td className={style.biggerFonts}>{price}</td>
        <td className={style.biggerFonts}></td>
      </tr>
    );
  } 
  else if (mode === "usageInfo") {
    return (
      <tr>
        <td className={style.biggerFonts}>{idx}</td>
        <td className={style.biggerFonts}>{name}</td>
        <td className={style.biggerFonts}>{quantity}</td>
        <td className={style.biggerFonts} style={{ whiteSpace: "wrap" }}>
          {expire}
        </td>
        <td className={style.biggerFonts}>{supplier}</td>
      </tr>
    );
  } 
  else if (mode === "usage") {
    return (
      <tr>
        <td className={style.biggerFonts}>{idx}</td>
        <td className={style.biggerFonts}>{name}</td>
        <td className={style.biggerFonts}>{quantity}</td>
        <td className={style.biggerFonts} style={{ whiteSpace: "wrap" }}>
        </td>
        <td className={style.biggerFonts}>{supplier}</td>
        <td className={style.biggerFonts}>{price}</td>
        <td className={style.biggerFonts}></td>
      </tr>
    );
  } 
  else if (mode === 'dispense') {
      return (
        <tr>
          <td className={style.biggerFonts}>{idx}</td>
          <td className={style.biggerFonts}>{name}</td>
          <td className={style.biggerFonts}>{quantity}</td>
          <td className={style.biggerFonts} style={{ whiteSpace: "wrap" }}>
            {expire}
          </td>
          <td className={style.biggerFonts}>{supplier}</td>
          <td className={style.biggerFonts}>{price}</td>
          <td className={style.biggerFonts}></td>
        </tr>
      );
    }
};

export default MediSelected;
