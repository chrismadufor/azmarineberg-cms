import { http } from "@/utils/axios";
import { getErrorData } from "@/utils/utils";

export const signup = async (values) => {
  try {
    let response = await http.post("user/signup", values);
    return { error: false, data: response.data, status: response.status };
  } catch (err) {
    return getErrorData(err);
  }
};

export const signin = async (values) => {
  try {
    let response = await http.post("user/login", values);
    return { error: false, data: response.data, status: response.status };
  } catch (err) {
    return getErrorData(err);
  }
};

export const adminSignin = async (values) => {
  try {
    let response = await http.post("admin/login", values);
    return { error: false, data: response.data, status: response.status };
  } catch (err) {
    return getErrorData(err);
  }
};

export const verifyEmail = async (values) => {
  try {
    let response = await http.post("user/verify-email", values);
    return { error: false, data: response.data, status: response.status };
  } catch (err) {
    return getErrorData(err);
  }
};

export const resendOtp = async (values) => {
  try {
    let response = await http.post("user/resend-otp", values);
    return { error: false, data: response.data, status: response.status };
  } catch (err) {
    return getErrorData(err);
  }
};

export const forgotPassword = async (values) => {
  try {
    let response = await http.post("user/request-password-reset", values);
    return { error: false, data: response.data, status: response.status };
  } catch (err) {
    return getErrorData(err);
  }
};

export const adminForgotPassword = async (values) => {
  try {
    let response = await http.post("admin/request-password-reset", values);
    return { error: false, data: response.data, status: response.status };
  } catch (err) {
    return getErrorData(err);
  }
};

export const resetPassword = async (values) => {
  try {
    let response = await http.post("user/reset-password", values);
    return { error: false, data: response.data, status: response.status };
  } catch (err) {
    return getErrorData(err);
  }
};

export const adminResetPassword = async (values) => {
  try {
    let response = await http.post("admin/reset-password", values);
    return { error: false, data: response.data, status: response.status };
  } catch (err) {
    return getErrorData(err);
  }
};

export const changePassword = async (values) => {
  try {
    let response = await http.patch("user/update-password", values);
    return { error: false, data: response.data, status: response.status };
  } catch (err) {
    return getErrorData(err);
  }
};

export const adminChangePassword = async (values) => {
  try {
    let response = await http.patch("admin/change-password", values);
    return { error: false, data: response.data, status: response.status };
  } catch (err) {
    return getErrorData(err);
  }
};
