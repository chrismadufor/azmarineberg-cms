"use client";

import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function NavLink({
  name,
  icon,
  link,
}) {
  const location = useLocation();
  const mobile = false

  // Full pathname like /dashboard/settings
  const pathname = location.pathname;

  // Split into segments
  const segments = pathname.split("/").filter(Boolean); // removes empty strings
  
  const segment = segments[segments.length - 1];

  const isActive =
    (link === "/dashboard/" + segment && name !== "dashboard") ||
    (name === "dashboard" && segment === "dashboard");

  return (
    <div
    >
      <div
        onClick={() => {
          // dispatch(showNotification(false));
        }}
      >
        <a
          href={link}
          className={`flex md:text-white items-center w-full grey_text ${
            isActive
              ? "xl:border black_text font-semibold xl:border-gray-200 xl:shadow-md xl:rounded-lg"
              : ""
          } ${mobile ? "border-b px-5 py-4 text-sm" : "mb-6 py-2 px-2"}`}
        >
          <p className={`w-5 ${mobile ? "primary_text" : "text-white"}`}>
            <FontAwesomeIcon icon={icon} />
          </p>
          <span className="ml-2 capitalize text-black xl:text-white">
            {name}
          </span>
        </a>
      </div>
    </div>
  );
}
