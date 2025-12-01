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

export const createRequest = async (values) => {
  try {
    const response = await http.post(`admin/create-request/${values.userId}`, values.data);
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

export const fileUpload = async (values) => {
  try {
    // FormData is handled automatically by axios interceptor
    // The interceptor will remove Content-Type header for FormData
    const response = await http.post("utility/file-upload", values);
    return { error: false, data: response.data, status: response.status };
  } catch (err) {
    return getErrorData(err);
  }
};

export const createUser = async (values) => {
  try {
    const response = await http.post("admin/register-user", values);
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
    const response = await http.get(`admin/get-user-by-id/${id}`);
    return { error: false, data: response.data, status: response.status };
  } catch (err) {
    return getErrorData(err);
  }
};

export const fetchUserRequests = async (id) => {
  try {
    const response = await http.get(`admin/requests/${id}`);
    return { error: false, data: response.data, status: response.status };
  } catch (err) {
    return getErrorData(err);
  }
};

export const fetchAdminUsers = async (values) => {
  try {
    const response = await http.get(`admin/admins${values ? "?" + setFilterParams(values) : ""}`);
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

export const updateRequestStatus = async (id, status) => {
  try {
    const response = await http.patch(`admin/update-request-status/${id}`, { status });
    return { error: false, data: response.data, status: response.status };
  } catch (err) {
    return getErrorData(err);
  }
};

export const updateRequestFile = async (id, fileUrl) => {
  try {
    const response = await http.patch(`admin/update-request-file/${id}`, { fileUrl });
    return { error: false, data: response.data, status: response.status };
  } catch (err) {
    return getErrorData(err);
  }
};