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
          className={`flex md:text-black items-center w-full grey_text rounded-lg hover:bg-gray-50 ${
            isActive
              ? "font-medium bg-green-50 hover:bg-green-50 border border-green-200 p-2"
              : ""
          } ${mobile ? "border-b px-5 py-4 text-sm" : "my-2 p-3" }`}
        >
          <p className={`w-5 text-primary`}>
            <FontAwesomeIcon icon={icon} />
          </p>
            <span className="ml-2 capitalize text-sm text-black">{name}</span>
        </Link>
      </div>
    </div>
  );
}
