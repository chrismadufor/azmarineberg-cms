import React from "react";
import Spinner from "./Spinner";

export default function Button({
  text,
  color,
  onClick,
  width,
  loading,
  height,
  table,
  type,
}) {
  return (
    <button
      onClick={onClick && onClick}
      type={type ? type : "button"}
      className={`rounded-md shrink-0 bg-gray-100 text-sm md:text-bas ${
        height === "sm" ? "h-8 md:h-10" : table ? "py-1" : "h-12"
      } active:scale-[0.98] ${
        width === "full" ? "w-full" : table ? "px-2" : "px-4"
      } ${
        color === "green"
          ? "bg-primary text-white hover:bg-green-800"
          : color === "red"
          ? "red_bg text-white hover:bg-red-800"
          : color === "transparent"
          ? "bg-transparent border primary_border text-primary hover:text-white hover:bg-green-600"
          : "bg-white text-primary hover:bg-gray-100"
      }`}
      disabled={loading}
    >
      {loading ? <Spinner size={height === "sm" ? "md" : null} color={color === "red" ? "red" : "green" } /> : text}
    </button>
  );
}
