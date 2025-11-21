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
  const user = useSelector((state) => state.auth.userProfile);

  // console.log(user)
  const role =
    user?.role === "admin" || user?.role === "superAdmin" ? "admin" : "user";

  const logout = () => {
    // Delete token from sessionStorage
    sessionStorage.removeItem("azToken");
    
    // Update Redux state
    dispatch(setLogout(true));
    
    // Redirect based on role
    if (role === "admin") {
      router.push("/admin-login");
    } else {
      router.push("/login");
    }
  };

  useEffect(() => {
    // let token = getToken();
    // if (!token) router.push("/login");
    // eslint-disable-next-line
  }, []);

  return (
    <div className="hidden xl:block">
      <div className="bg-primar text-black border-r border-gray-200 fixed left-0 h-full w-56 overflow-y-scroll z-10">
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
          <div className="px-4">
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
          <div className="bg-white bottom_side_nav  md:absolute bottom-0 left-0 w-full py-5 border-t border-white border-opacity-20">
            <div
              onClick={logout}
              className={`flex text-white hover:bg-gray-50 items-center w-full py-5 px-6 cursor-pointer grey_text`}
            >
              <FontAwesomeIcon className="text-primary" icon={faSignOut} />
              <h1 className="text-black ml-2 capitalize text-sm">Logout</h1>
            </div>
            <div className="px-5 pt-5 border-t border-gray-200 flex items-center gap-3">
              {user?.photo ? (
                <img src={user.photo} alt={user.fullName} className="shrink-0 w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="shrink-0 w-10 h-10 rounded-full bg-primary flex items-center justify-center font-semibold text-white uppercase text-sm">
                  {user?.fullName?.split(" ").map(n=>n[0]).join("").slice(0, 2) || "U"}
                </div>
              )}
              <p className="font-semibold uppercase text-primary text-cente text-sm">{user?.fullName}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
