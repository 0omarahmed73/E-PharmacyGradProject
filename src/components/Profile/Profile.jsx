import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import style from "./Profile.module.css";
import { AiFillCaretDown } from "react-icons/ai";
import { useState } from "react";
import { Dropdown, DropdownButton, Button } from "react-bootstrap";
import { ShowContext } from "../../context/ShowContext";
import Cookies from "js-cookie";
import { AnimatePresence, motion } from "framer-motion";

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const { dropDown, setDropDown } = useContext(ShowContext);
  return (
    <div className={style.profile}>
      <div className={style.profImg}>
        <img
          src="https://w7.pngwing.com/pngs/81/570/png-transparent-profile-logo-computer-icons-user-user-blue-heroes-logo-thumbnail.png"
          alt="userimg"
        />
      </div>
      <div className="profTexts d-flex flex-column ms-2">
        <small>د/{user.username}</small>
      </div>
      <AiFillCaretDown
        size={13}
        style={{ marginRight: "10px", cursor: "pointer" }}
        onMouseMove={() => setDropDown(true)}
      />
      <AnimatePresence>
      {dropDown && (
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3  }}
          exit={{ opacity: 0 }}
          className={style.dropDown}
        >
          <ul>
            <li>
              <Button style={{ all: "unset" }}>تعديل الحساب</Button>
            </li>
            <li>
              <Button
                onClick={() => {
                  Cookies.remove("user");
                  setUser(null);
                }}
                style={{ all: "unset" }}
              >
                تسجيل الخروج
              </Button>
            </li>
          </ul>
        </motion.div>
      ) }
      </AnimatePresence>
    </div>
  );
};

export default Profile;
