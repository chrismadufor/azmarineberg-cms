import { http } from "@/utils/axios";
import { getErrorData, setFilterParams } from "@/utils/utils";

export const fetchServices = async () => {
  try {
    const response = await http.get("user/services");
    return { error: false, data: response.data, status: response.status };
  } catch (err) {
    return getErrorData(err);
  }
};

export const fetchRequests = async (values) => {
  try {
    const response = await http.get(`user/my-requests${values ? "?" + setFilterParams(values) : ""}`);
    return { error: false, data: response.data, status: response.status };
  } catch (err) {
    return getErrorData(err);
  }
};

export const fetchAnalytics = async () => {
  try {
    const response = await http.get("user/summary");
    return { error: false, data: response.data, status: response.status };
  } catch (err) {
    return getErrorData(err);
  }
};

export const fetchRequestById = async (id) => {
  try {
    const response = await http.get(`user/request/${id}`);
    return { error: false, data: response.data, status: response.status };
  } catch (err) {
    return getErrorData(err);
  }
};

export const createRequest = async (values) => {
  try {
    const response = await http.post("user/create-request", values);
    return { error: false, data: response.data, status: response.status };
  } catch (err) {
    return getErrorData(err);
  }
};

export const updateProfile = async (values) => {
  try {
    const response = await http.put("user/edit-user", values);
    return { error: false, data: response.data, status: response.status };
  } catch (err) {
    return getErrorData(err);
  }
};
