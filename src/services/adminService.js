import { http } from "@/utils/axios";
import { getErrorData, setFilterParams } from "@/utils/utils";

export const fetchAllUsers = async (values) => {
  try {
    const response = await http.get(`admin/all-users${values ? "?" + setFilterParams(values) : ""}`);
    return { error: false, data: response.data, status: response.status };
  } catch (err) {
    return getErrorData(err);
  }
};

export const fetchAllRequests = async (values) => {
  try {
    const response = await http.get(`admin/requests${values ? "?" + setFilterParams(values) : ""}`);
    return { error: false, data: response.data, status: response.status };
  } catch (err) {
    return getErrorData(err);
  }
};

export const fetchAllServices = async (values) => {
  try {
    const response = await http.get(`admin/services${values ? "?" + setFilterParams(values) : ""}`);
    return { error: false, data: response.data, status: response.status };
  } catch (err) {
    return getErrorData(err);
  }
};

export const createService = async (values) => {
  try {
    const response = await http.post("admin/create-service", values);
    return { error: false, data: response.data, status: response.status };
  } catch (err) {
    return getErrorData(err);
  }
};

export const updateService = async (values) => {
  try {
    const response = await http.patch(`admin/update-service/${values._id}`, values.data);
    return { error: false, data: response.data, status: response.status };
  } catch (err) {
    return getErrorData(err);
  }
};

export const fetchAdminAnalytics = async () => {
  try {
    const response = await http.get("admin/summary");
    return { error: false, data: response.data, status: response.status };
  } catch (err) {
    return getErrorData(err);
  }
};

export const createAdmin = async (values) => {
  try {
    const response = await http.post("admin/create-admin", values);
    return { error: false, data: response.data, status: response.status };
  } catch (err) {
    return getErrorData(err);
  }
};

export const createUser = async (values) => {
  try {
    const response = await http.post("admin/register", values);
    return { error: false, data: response.data, status: response.status };
  } catch (err) {
    return getErrorData(err);
  }
};

export const updateUser = async (values) => {
  try {
    const response = await http.put(`admin/edit-user/${values._id}`, values.data);
    return { error: false, data: response.data, status: response.status };
  } catch (err) {
    return getErrorData(err);
  }
};

export const fetchUserById = async (id) => {
  try {
    const response = await http.get(`admin/user/${id}`);
    return { error: false, data: response.data, status: response.status };
  } catch (err) {
    return getErrorData(err);
  }
};

export const fetchAdminUsers = async (values) => {
  try {
    const response = await http.get(`admin/admin-users${values ? "?" + setFilterParams(values) : ""}`);
    return { error: false, data: response.data, status: response.status };
  } catch (err) {
    return getErrorData(err);
  }
};

export const fetchRequestById = async (id) => {
  try {
    const response = await http.get(`admin/request/${id}`);
    return { error: false, data: response.data, status: response.status };
  } catch (err) {
    return getErrorData(err);
  }
};