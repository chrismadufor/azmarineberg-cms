"use client";

import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function NavLink({ name, icon, link, role, approval, mobile, subs }) {
  const userData = useSelector((state) => state.auth.user);
  const segment = useSelectedLayoutSegment();
  const isActive =
    (link === segment && name !== "dashboard") ||
    (name === "dashboard" && segment === null);
  const submitted = true;

  return (
    <div>
      <div
        onClick={() => {
          // dispatch(showNotification(false));
        }}
      >
        <Link
          href={
            role === "admin"
              ? `/admin/${link}`
              : `/dashboard/${link}`
          }
          className={`flex md:text-white items-center w-full grey_text ${
            isActive
              ? "xl:border-r-[6px] font-medium xl:border-gray-200"
              : ""
          } ${mobile ? "border-b px-5 py-4 text-sm" : "mb-6 py-1 px-2" }`}
        >
          <p className={`w-5 ${mobile ? "primary_text" : "text-white"}`}>
            <FontAwesomeIcon icon={icon} />
          </p>
          <span className="ml-2 capitalize text-black xl:text-white">{name}</span>
        </Link>
      </div>
    </div>
  );
}
