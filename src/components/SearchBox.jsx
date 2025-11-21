import { showToast } from "@/redux/slices/ToastSlice";
import {
  faChevronDown,
  faRefresh,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { useDispatch } from "react-redux";

export default function SearchBox({ setFilter, reset, filters }) {
  const dispatch = useDispatch();
  const [type, setType] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [dropdownData, setDropdownData] = useState(null);

  const onTypeChange = (val) => {
    setDropdownData(null)
    setSearchValue("");
    setType(val);
    const temp = filters.filter((item) => item.value === val);
    if (temp[0]?.data) setDropdownData(temp[0]?.data);
  };

  const onSearchValueChange = (val, dropdown) => {
    setSearchValue(val);
    val && dropdown && onSearch(val)
  };

  const onKeyUp = (val) => {
    if (val === "Enter") onSearch(searchValue);
  };

  const onSearch = (searchValue) => {
    if (!type)
      return dispatch(
        showToast({
          status: "error",
          message: "Select a filter from the dropdown and enter a search value",
        })
      );
    let data = { [type]: searchValue };
    setFilter(data);
  };

  const onReset = () => {
    // if (!type || !searchValue) return;
    setType("");
    setSearchValue("");
    setDropdownData(null)
    reset();
  };

  return (
    <div className="flex items-center w-full">
      <div className="relative">
        <div className="absolute right-0 bg-white border-t border-b border-gray-300 h-full text-sm pointer-events-none flex items-center justify-end px-3 text-gray-600">
          <FontAwesomeIcon icon={faChevronDown} />
        </div>
        <select
          value={type}
          onChange={(e) => onTypeChange(e.target.value)}
          className="bg-white rounded_left border border-gray-300 w-20 md:w-32 h-10 block focus:outline-none px-2 appearance-none text-sm md:text-base"
        >
          <option value="">Filter By</option>
          {filters &&
            filters.map((item, index) => (
              <option key={index} value={item.value}>
                {item.name}
              </option>
            ))}
        </select>
      </div>
      <div className="relative w-full">
        <div className="cursor-pointer absolute right-0 h-full text-sm flex gap- items-center justify-end px- text-gray-600 bg-white border-t border-b border-gray-300 rounded_right border-r">
          <div className="border-l-2 px-2 md:px-3" onClick={() => onSearch(searchValue)}>
            <FontAwesomeIcon icon={faSearch} />
          </div>
          <div className="border-l-2 px-2 md:px-3" onClick={onReset}>
            <FontAwesomeIcon icon={faRefresh} />
          </div>
        </div>
        {!dropdownData ? (
          <input
            onKeyUp={(e) => onKeyUp(e.code)}
            value={searchValue}
            onChange={(e) => onSearchValueChange(e.target.value)}
            className="rounded_right border border-gray-300 w-full px-5 h-10 block focus:outline-none text-sm md:text-base"
            type="text"
            placeholder="Search"
          />
        ) : (
          <select
            onChange={(e) => onSearchValueChange(e.target.value, true)}
            className="rounded_right border border-gray-300 w-full h-10 block focus:outline-none px-3 appearance-none"
          >
            <option value="">Choose one</option>
            {dropdownData.map((item, index) => (
              <option key={index} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}
