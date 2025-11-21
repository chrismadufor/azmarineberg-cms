// import { adminRoles } from "@/data/admin";
import moment from "moment";

const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export const naira = "₦";

export const perPage = 100;

// test
export const baseUrl = "https://azmarineberg-server.onrender.com/api/v1/";

// live
// export const baseUrl = "https://server.lasepaonline.com/api/v1/";
// export const baseUrl = "https://lasepaserver.onrender.com/api/v1/";

export const clearToken = () => {
  sessionStorage.removeItem("azToken");
};

// utils/errorHandlers.js
export const handleAPIError = (
  response,
  dispatch,
  router,
  showToast
) => {
  if (response.status === 401) {
    dispatch(
      showToast({
        status: "error",
        message: response.data.message,
      })
    );
    return router.push("/login");
  }
  dispatch(
    showToast({
      status: "error",
      message: getErrorMessage(response.data),
    })
  );
};

export const getErrorMessage = (err) => {
  if (!err) return;
  let errMsg;
  if (err.message) errMsg = err.message;
  else if (err.error === "TypeError: Failed to fetch")
    errMsg = "Check your network and try again";
  else if (err.error) errMsg = err.error;
  else if (err.data?.error && typeof err.data.error === "string")
    errMsg = err.data?.error;
  else errMsg = "An error occured";

  return errMsg;
};

export const getErrorData = (err) => {
  let errData =
    err.code === "ERR_NETWORK"
      ? {
          error: true,
          data: { message: err.message },
          status: null,
        }
      : {
          error: true,
          data: err?.response?.data,
          status: err?.response?.status,
        };
  return errData;
};

export const getTime = (value) => {
  let date = new Date(value);
  let currentTime = Date.now();
  let resultInMins = Math.floor((currentTime - date) / 60000);
  let resultInHours = Math.floor((currentTime - date) / 3600000);
  let resultInDays = Math.floor((currentTime - date) / 86400000);
  let resultInWeeks = Math.floor((currentTime - date) / 604800000);
  let resultInMonths = Math.floor((currentTime - date) / 2592000000);
  if (resultInMins === 1) return `${resultInMins} min ago`;
  if (resultInMins < 60) return `${resultInMins} mins ago`;
  else if (resultInHours === 1) return `${resultInHours} hour ago`;
  else if (resultInHours < 24) return `${resultInHours} hours ago`;
  else if (resultInDays === 1) return `${resultInDays} day ago`;
  else if (resultInDays < 7) return `${resultInDays} days ago`;
  else if (resultInWeeks === 1) return `${resultInWeeks} week ago`;
  else if (resultInWeeks <= 4) return `${resultInWeeks} weeks ago`;
  else if (resultInMonths === 1) return `${resultInMonths} month ago`;
  else return `${resultInMonths} months ago`;
};

export const formatDate = (date) => {
  if (!date) return "N/A";
  return moment(date).format("MMMM Do YYYY");
};

export const formatDateTime = (date) => {
  if (date == Number(date)) date = Number(date);
  if (!date) return "N/A";
  return moment(date).format("MMM Do YYYY, h:mm A");
};

export const getProperDate = (date) => {
  let temp = Number(date);
  return formatDateTime(temp);
};

export const getPastDate = (range) => {
  const now = new Date();
  const date = new Date(now); // Clone the current date

  switch (range) {
    case "7d":
      date.setDate(date.getDate() - 7);
      break;
    case "1m":
      date.setMonth(date.getMonth() - 1);
      break;
    case "3m":
      date.setMonth(date.getMonth() - 3);
      break;
    case "6m":
      date.setMonth(date.getMonth() - 6);
      break;
    case "1y":
      date.setFullYear(date.getFullYear() - 1);
      break;
    default:
      throw new Error('Invalid range. Use "7d", "1m", "3m", "6m", or "1y".');
  }

  return date;
};

export const getStates = (data) => {
  let temp = JSON.parse(data);
  return temp;
};

export const getStatesCount = (data) => {
  let temp = JSON.parse(data);
  return `${temp.length > 0 && temp.length} ${
    temp.length === 0 ? "No states" : temp.length === 1 ? "state" : "states"
  }`;
};

export const getStatusColor = (status) => {
  if (
    status === "inactive" ||
    status === "paused" ||
    status === "not started" ||
    status === "failed"
  )
    return "red_text red_button_bg rounded-lg";
  else if (status === "active" || status === "in progress")
    return "text-primary purple_button_bg rounded-lg";
  else if (status === "pending" || status === "new" || status === "not started")
    return "orange_text orange_bg rounded-lg";
  else if (status === "completed" || status === "success")
    return "green_text green_button_bg rounded-lg";
};

export const formatNumber = (num) => {
  num = +num;
  // if (num > 999999) return `${(num / 1000000).toFixed(1)} Mil`;
  let str = num.toLocaleString("en-US");
  return str;
};

export const formatNairaNumber = (num) => {
  if (!num) return naira + "0";
  num = +num;
  // if (num > 999999) return `${(num / 1000000).toFixed(1)} Mil`;
  let str = num.toLocaleString("en-US");
  return naira + str;
};

export const returnKeys = (data) => {
  return Object.keys(data);
};

export const removeEmptyFilters = (data) => {
  const keys = returnKeys(data);
  const temp = {};
  keys.forEach((key) => {
    if (data[key]) temp[key] = data[key];
  });
  return temp;
};

export const setFilterParams = (filters) => {
  const temp = removeEmptyFilters(filters);
  const params = new URLSearchParams(temp);
  return params;
};

export const returnName = (id, data) => {
  let temp = data?.filter((item) => item._id === id);
  return temp?.length > 0 ? temp[0].name : null;
};

export const getFirstName = (str) => {
  if (!str) return "";
  let arr = str.split(" ");
  return arr[0];
};

export const checkAdminRole = (roles, targetRole) => {
  if (typeof roles === "string") {
    if (roles === targetRole) return true;
  } else {
    for (let i = 0; i < roles?.length; i++) {
      if (roles[i] === targetRole) return true;
    }
  }
  return false;
};

export const checkNotAdminRole = (roles, targetRole) => {
  if (typeof roles === "string") {
    if (roles === targetRole) return false;
  } else {
    for (let i = 0; i < roles?.length; i++) {
      if (roles[i] === targetRole) return false;
    }
  }
  return true;
};

export const generatePassword = () => {
  let length = 8;
  let result = " ";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};

export const getAdminRole = (role) => {
  let temp = adminRoles?.filter((item) => item.value === role);
  return temp[0]?.label || "";
};

export const getYear = (val) => {
  const year = new Date(val).getFullYear();
  return year;
};

export const monthsData = [
  {
    label: "January",
    value: "january",
  },
  {
    label: "February",
    value: "february",
  },
  {
    label: "March",
    value: "march",
  },
  {
    label: "April",
    value: "april",
  },
  {
    label: "May",
    value: "may",
  },
  {
    label: "June",
    value: "june",
  },
  {
    label: "July",
    value: "july",
  },
  {
    label: "August",
    value: "august",
  },
  {
    label: "September",
    value: "september",
  },
  {
    label: "October",
    value: "october",
  },
  {
    label: "November",
    value: "november",
  },
  {
    label: "December",
    value: "december",
  },
];

export const getYears = () => {
  const startYear = new Date().getFullYear() - 1;
  const endYear = new Date().getFullYear();
  let temp = [];
  for (let i = startYear; i <= endYear; i++) {
    temp.push({
      label: i,
      value: i.toString(),
    });
  }
  return temp;
};

export const removeTags = (str) => {
  if (str === null || str === "") return false;
  else str = str.toString();
  return str.replace(/(<([^>]+)>)/gi, "");
};

// get report status
export const reportStatusValue = (status) => {
  if (status === "processing") return "processing";
  else if (status === "not_paid") return "not paid";
  else if (status === "reviewing") return "in review";
  else if (status === "final_check") return "final check";
  else if (status === "pre_approval_stage") return "director";
  else if (status === "approval_stage") return "pending";
  else if (status === "approved") return "approved";
  else if (status === "rejected") return "rejected";
  else if (status === "returned") return "returned";
};

// get report status
export const getCurrentRole = (status) => {
  if (status === "reviewing") return "reviewer";
  else if (status === "final_check") return "final_check";
  else if (status === "pre_approval_stage") return "director";
  else if (status === "approval_stage") return "superAdmin";
};

export const paymentStatusValue = (status) => {
  if (status === "paid") return "paid";
  else return "not paid";
};

export const reportStatusColor = (status) => {
  if (status === "approved") return "bg-primary";
  else if (status === "rejected") return "red_bg text-white";
  else if (status === "returned" || status === "not_paid")
    return "dark_gray text-white block";
  else return "orange_bg text-white";
};

export const paymentStatusColor = (status) => {
  if (status === "paid") return "bg-primary";
  else return "dark_gray text-white block";
};

export const reportStatusTextColor = (status) => {
  if (status === "approved") return "text-primary";
  else if (status === "rejected") return "red_text";
  else if (status === "returned") return "text-gray-700";
  else return "orange_text";
};

export const userStatusTextColor = (status) => {
  if (status === "active") return "text-primary";
  else if (status === "submitted") return "orange_text";
  else if (status === "scheduled") return "text-purple-600";
  else return "red_text";
};

export const shortenSentence = (str, val) => {
  if (!str) return "";
  val = val ? val : 30;
  let temp = str?.slice(0, val);
  return temp?.length < val ? temp : temp + "...";
};

export const getSerialNumber = (index, currentPage) => {
  let number = (currentPage - 1) * perPage + (index + 1);
  return number;
};

export const getRequestStatusColor = (status) => {
  if (!status) return { bg: "bg-gray-100", text: "text-gray-700" };
  
  const statusLower = status.toLowerCase();
  
  switch (statusLower) {
    case "completed":
      return { bg: "bg-green-100", text: "text-green-700" };
    case "processing":
      return { bg: "bg-blue-100", text: "text-blue-700" };
    case "pending":
      return { bg: "bg-orange-100", text: "text-orange-700" };
    case "rejected":
      return { bg: "bg-red-100", text: "text-red-700" };
    default:
      return { bg: "bg-gray-100", text: "text-gray-700" };
  }
};

export const formatRequestStatus = (status) => {
  if (!status) return "Pending";
  return status.charAt(0).toUpperCase() + status.slice(1);
};

export const formatPhone = (phone) => {
  phone = phone.toString();
  const prefix = "+234";
  if (
    phone.substr(0, 4) === prefix &&
    phone.length === 14 &&
    (phone[5] === "0" || phone[5] === "1") &&
    (phone[4] === "9" || phone[4] === "8" || phone[4] === "7")
  )
    return phone;
  else if (phone.substr(0, 3) === "234" && phone.length === 13) {
    return "+" + phone;
  } else if (
    phone.length === 11 &&
    phone[0] === "0" &&
    (phone[2] === "0" || phone[2] === "1")
  ) {
    let temp = prefix + phone.substr(1);
    return temp;
  } else if (
    phone.length === 10 &&
    (phone[0] === "9" || phone[0] === "8" || phone[0] === "7") &&
    (phone[1] === "0" || phone[1] === "1")
  )
    return prefix + phone;
  else return false;
};

export const checkDocuments = (user, userData) => {
  if (user === "consultant" && userData) {
    if (!userData?.consultantId?.payerId) return false;
    else if (
      !userData.consultantId?.registrationDocuments?.corporateAffairsCommission
        ?.url
    )
      return false;
    else if (
      !userData.consultantId?.registrationDocuments
        ?.memorandumArticleAssociation.url
    )
      return false;
    // else if (
    //   !userData.consultantId?.registrationDocuments?.formCO2FormCO7?.url
    // )
    //   return false;
    else if (
      !userData.consultantId?.registrationDocuments
        ?.lasgAnnualTaxReturnCertificate?.url
    )
      return false;
    else if (
      !userData.consultantId?.registrationDocuments.taxClearanceofTwoDirector
        ?.url
    )
      return false;
    else if (
      !userData.consultantId?.registrationDocuments
        .meansOfIdentificationTwoDirectors?.url
    )
      return false;
    else if (
      userData.consultantId?.consultantType === "environmental" &&
      !userData.consultantId?.registrationDocuments
        .memorandumOfUnderstandingWithIPANCertifiedLaboratory?.url
    )
      return false;
    else if (
      !userData.consultantId?.registrationDocuments
        .professionalBodiesCertification?.url
    )
      return false;
    // else if (
    //   !userData.consultantId?.registrationDocuments?.equipmentSpecifications
    //     ?.url
    // )
    // return false;
    else return true;
  } else if (user === "company" && userData) {
    if (!userData?.companyId?.payerId) return false;
    else if (!userData?.companyId?.facilityId[0]?.address) return false;
    else if (
      !userData?.companyId?.registrationDocuments?.corporateAffairsCommission
        ?.url
    )
      return false;
    else if (
      !userData?.companyId?.registrationDocuments?.annualTaxClearance?.url
    )
      return false;
    else return true;
  }
};
