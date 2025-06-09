"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { hideToast } from "../redux/slices/ToastSlice";

export default function Toast() {
  const { status, message } = useSelector((state) => state.toast);
  const dispatch = useDispatch();
  useEffect(() => {
    if (message && message !== "" && message !== null) {
      switch (status) {
        case "success":
          toast.success(message);
          break;
        case "error":
          toast.error(message);
          break;
        default:
          toast(message);
          break;
      }
      setTimeout(() => {
        dispatch(hideToast());
      }, 5000);
    }
    return () => clearTimeout(5000);
  }, [message, status, dispatch]);
  return (
    <div className="fixed top-0 right-0 z-10">
      <ToastContainer autoClose={7000} />
    </div>
  );
}
