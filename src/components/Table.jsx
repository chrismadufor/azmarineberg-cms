"use client";

import { showToast } from "@/redux/slices/ToastSlice";
import { perPage } from "@/utils/utils";
import React, { useState } from "react";
import { useDispatch } from "react-redux";

export default function Table({
  columns,
  children,
  data,
  changePage,
  mobileColumns,
}) {
  const startCount = perPage * (data?.current_page - 1) + 1;
  const endCount =
    data?.total < data?.current_page * perPage
      ? data?.total
      : data?.current_page * perPage;
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(data ? data?.current_page : 1);
  const per_page = perPage;

  const onInputChange = (val) => {
    for (let i = 0; i < val.length; i++) {
      if (val[i] != Number(val[i]) && val[0] !== undefined) {
        return dispatch(
          showToast({
            status: "error",
            message: "Only numbers are allowed",
          })
        );
      }
    }
    setCurrentPage(val);
  };

  const onKeyChange = (val) => {
    if (val === "Enter") {
      if (Number(currentPage) > data?.pages) return setCurrentPage(data?.pages);
      else changePage(currentPage);
    }
  };

  const handleBlur = () => {
    if (currentPage === "") setCurrentPage(data?.current_page);
    if (Number(currentPage) > data?.pages) setCurrentPage(data?.pages);
  };

  const goToPrev = () => {
    changePage(data?.current_page - 1);
  };

  const goToNext = () => {
    changePage(data?.current_page + 1);
  };

  return (
    <div>
      {data?.current_page && (
        <p className="mb-2 italic font-medium text-right text-sm">
          Showing {startCount} to {endCount} of {data?.total}
        </p>
      )}
      <div
        className={`hidden md:block border border-gray-300 md:rounded-sm overflow-scroll bg-white`}
      >
        <table className="w-full border-collapse text-sm text-gray-700 md:rounded-sm ">
          <thead className="bg-gray-200">
            <tr className="h-14">
              <th className="pl-5 w-12 font-semibold">S/N</th>
              {columns.map((column, index) => (
                <th
                  className="px-5 font-semibold text-left min-w-[150px]"
                  key={index}
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      </div>
      {mobileColumns && (
        <div
          className={`md:hidden border md:rounded-sm overflow-scroll border-gray-300 bg-white`}
        >
          <table className="w-full border-collapse text-sm text-gray-700 md:rounded-sm">
            <thead className="bg-gray-100">
              <tr className="h-14 px-5">
                <th className="pl-2 text-xs font-semibold w-12">S/N</th>
                {mobileColumns.map((column, index) => (
                  <th
                    className="px-2 font-semibold text-left text-xs"
                    key={index}
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-xs">{children}</tbody>
          </table>
        </div>
      )}
      {/* pagination */}
      {data && data?.total > per_page && (
        <div className="flex justify-end w-full mt-3">
          <div className="flex items-center gap-2">
            <div
              onClick={goToPrev}
              className={`${
                currentPage - 1 === 0 &&
                "pointer-events-none opacity-50 bg-gray-600"
              } h-7 md:h-10 w-7 md:w-10 rounded-sm bg-white cursor-pointer border-gray-200 border flex items-center justify-center`}
            >
              {"<"}
            </div>
            <div className="h-7 md:h-10 w-7 md:w-10 rounded-sm bg-white border-gray-200 border flex items-center justify-center">
              <input
                className="h-7 md:h-10 w-7 md:w-10 text-sm text-center bg-transparent"
                type="text"
                value={currentPage}
                onBlur={handleBlur}
                onKeyUp={(e) => onKeyChange(e.key)}
                onChange={(e) => onInputChange(e.target.value)}
              />
            </div>
            <div
              onClick={goToNext}
              className={`${
                // per_page * currentPage > data?.total &&
                currentPage + 1 > data?.pages &&
                "pointer-events-none opacity-50 bg-gray-600"
              } h-7 md:h-10 w-7 md:w-10 rounded-sm bg-white cursor-pointer border-gray-200 border flex items-center justify-center`}
            >
              {">"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
