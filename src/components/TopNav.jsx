"use client";

import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import NavLink from "./NavLink";
import { navLinks } from "../data/nav";
// import { setLogout } from "@/redux/slices/authSlice";

export default function TopNav() {
  // const dispatch = useDispatch();
  const [showNav, setShowNav] = useState(false);
    const userProfile = useSelector(state => state.auth.userProfile)

  // const logout = () => {
  //   dispatch(setLogout(true));
  // };
  return (
    <div className={`w-full fixed top-0 left-0 z-10 xl:pl-56 xl:z-2 bg-white`}>
      <div className="w-full border-b border-gray-300 h-[70px] px-5 md:px-5 xl:px-10">
        <div className="h-full flex items-center justify-between max-w-7xl mx-auto">
          <div
            className="w-4 primary_text xl:hidden"
            onClick={() => setShowNav(!showNav)}
          >
            <FontAwesomeIcon icon={showNav ? faTimes : faBars} />
          </div>
          <div></div>
          <div className="flex gap-3 items-center">
            <div>
              <h1 className="text-right text-xl text-primary-dar font-semibold uppercase">{userProfile.businessName}</h1>
              <p className="text-sm">{userProfile.email}</p>
            </div>
          </div>
          {navLinks && showNav && (
            <div
              onClick={() => setShowNav(false)}
              className="fixed top-[70px] left-0 w-full h-full bg-black bg-opacity-70 xl:hidden"
            >
              <div className="w-full bg-white flex flex-col">
                {navLinks.map((link, index) => (
                  <NavLink
                    key={index}
                    name={link.name}
                    icon={link.icon}
                    link={link.link}
                  />
                ))}
                {/* <div
                  onClick={logout}
                  className={`flex items-center w-full px-5 py-4 cursor-pointer grey_text text-sm`}
                >
                  <FontAwesomeIcon
                    className="primary_text w-5"
                    icon={faSignOut}
                  />
                  <h1 className="ml-2 capitalize">Logout</h1>
                </div> */}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
