import axios from "axios";

import { baseUrl } from "./utils";

const options = {
  baseURL: baseUrl,
  headers: {
    Accept: "application/json,text/plain,octet-stream,*/*",
    "Content-Type": "application/json",
  },
};

const pdfOptions = {
  baseURL: baseUrl,
  headers: {
    Accept: "*/*",
    "Content-Type": "application/json",
    // "Content-Disposition": "attachment"
  },
};

const abcOptions = {
  baseURL: baseUrl,
  headers: {
    Accept: "application/json,text/plain,*/*",
    "Content-Type": "application/json",
  },
};

export const getToken = () => {
  return sessionStorage.getItem("azToken");
};

export const http = axios.create(options);

http.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const pdfHttp = axios.create(pdfOptions);

pdfHttp.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const abcHttp = axios.create(abcOptions);

abcHttp.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const paystackHttp = axios.create({
  baseURL: "https://api.paystack.co/",
  headers: {
    Accept: "application/json,text/plain,*/*",
    "Content-Type": "application/json",
  },
});

paystackHttp.interceptors.request.use(
  (config) => {
    config.headers.Authorization =
      "Bearer sk_test_2a2612658ca671fb08b2de256c56ba23581d25c2";
    return config;
  },
  (err) => {
    throw new Error(err);
    // some action
  }
);
