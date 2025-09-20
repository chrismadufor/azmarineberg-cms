"use client";

import React, { useEffect } from "react";
import NavLink from "./NavLink";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { getToken } from "@/utils/axios";
import { navLinks } from "@/data/nav";
import { setLogout } from "@/redux/slices/authSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOut } from "@fortawesome/free-solid-svg-icons";

export default function SideNav() {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  // console.log(user)
  const role = "user";

  const logout = () => {
    dispatch(setLogout(true));
  };

  useEffect(() => {
    // let token = getToken();
    // if (!token) router.push("/login");

    // eslint-disable-next-line
  }, []);

  return (
    <div className="hidden xl:block">
      <div className="bg-primary text-white fixed left-0 h-full w-56 overflow-y-scroll z-10">
        <div className="h-full overflow-scroll pb-16">
          <div className="h-20 flex justify-center items-center">
            {/* <div className="relative">
              <Image
                width={80}
                height={80}
                src="/assets/logo1.png"
                alt="brand logo"
                className="object-cover"
              />
            </div> */}
            <h1 className="text-xl font-bold">Azmarineberg</h1>
          </div>
          {navLinks[role] && (
            <div className="pl-5">
              {navLinks[role].map((link, index) => (
                <NavLink
                  key={index}
                  name={link.name}
                  icon={link.icon}
                  link={link.link}
                  role={role}
                  approval={link.needsApproval}
                  subs={link.needsSub}
                />
              ))}
            </div>
          )}
          <div className="primary_bg bottom_side_nav px-5 md:absolute bottom-0 left-0 w-full py-5 border-t">
            <div
              onClick={logout}
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
