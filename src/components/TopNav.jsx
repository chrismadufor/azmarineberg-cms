"use client";

import { faBars, faSignOut, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import NavLink from "./NavLink";
import { navLinks } from "@/data/nav";
import { setLogout } from "@/redux/slices/authSlice";

export default function TopNav() {
  const dispatch = useDispatch();
  const [showNav, setShowNav] = useState(false);
  const user = useSelector((state) => state.auth.userProfile);

  const role = user?.role === "admin" || user?.role === "superAdmin" ? "admin" : "user";

  const logout = () => {
    dispatch(setLogout(true));
  };
  return (
    <div className={`w-full fixed top-0 left-0 xl:pl-56 z-10 xl:z-2 bg-white`}>
      <div className="w-full border-b border-gray-300 h-[70px] px-5 md:px-5 xl:px-10">
        <div className="h-full flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex gap-3 items-center">
            <div className="flex items-center gap-3">
              <div className="relative xl:hidden">
                <Image
                  width={40}
                  height={40}
                  src="/assets/logo1.png"
                  alt="brand logo"
                  className="object-cover"
                />
              </div>
              <p className="font-semibold capitalize text-lg md:text-xl"></p>
            </div>
          </div>
            <div
              className="w-4 text-primary xl:hidden"
              onClick={() => setShowNav(!showNav)}
            >
              <FontAwesomeIcon icon={showNav ? faTimes : faBars} />
            </div>
          <div className="hidden xl:block">
            <p className="font-semibold uppercase">{user?.fullName}</p>
            <p className="text-xs uppercase">{role}</p>
          </div>
          {navLinks[role] && showNav && (
            <div
              onClick={() => setShowNav(false)}
              className="fixed top-[70px] left-0 w-full h-full bg-black bg-opacity-70 xl:hidden"
            >
              <div className="w-full bg-white flex flex-col">
                {navLinks[role].map((link, index) => (
                  <NavLink
                    key={index}
                    name={link.name}
                    icon={link.icon}
                    link={link.link}
                    role={role}
                    mobile={true}
                    approval={link.needsApproval}
                    subs={link.needsSub}
                  />
                ))}
                <div
                  onClick={logout}
                  className={`flex items-center w-full px-5 py-4 cursor-pointer grey_text text-sm`}
                >
                  <FontAwesomeIcon
                    className="text-primary w-5"
                    icon={faSignOut}
                  />
                  <h1 className="ml-2 capitalize">Logout</h1>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
