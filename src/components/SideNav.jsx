import React from "react";
import NavLink from "./NavLink";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOut } from "@fortawesome/free-solid-svg-icons";
import { navLinks } from "../data/nav";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { setLogout } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

export default function SideNav() {
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut(auth);
    dispatch(setLogout(true));
    navigate("/")
  };

  return (
    <div className="hidden xl:block">
      <div className="bg-primary text-white fixed left-0 h-screen w-56 z-10">
        <div className="h-[70px] flex items-center px-5">
          <h1 className="text-center text-2xl text-white turret font-bold">
            + Sales Plus +
          </h1>
        </div>
        <div className="pt-6 h-full overflow-scroll pb-16">
          {navLinks && (
            <div className="px-5">
              {navLinks.map((link, index) => (
                <NavLink
                  key={index}
                  name={link.name}
                  icon={link.icon}
                  link={link.link}
                />
              ))}
            </div>
          )}
          <div className="primary_bg bottom_side_nav px-5 md:absolute bottom-0 left-0 w-full py-5 border-t">
            <div
              onClick={handleLogout}
              className={`flex text-white items-center w-full py-1 px-2 cursor-pointer grey_text`}
            >
              <FontAwesomeIcon className="" icon={faSignOut} />
              <h1 className="text-white ml-2 capitalize">Logout</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
