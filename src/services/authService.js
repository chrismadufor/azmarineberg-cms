import { http } from "@/utils/axios";
import { getErrorData } from "@/utils/utils";

// COMMENTED OUT FOR DEMO - Token endpoints disabled
// export const signup = async (values) => {
//   try {
//     let response = await http.post("user/signup", values);
//     return { error: false, data: response.data, status: response.status };
//   } catch (err) {
//     return getErrorData(err)
//   }
// };
export const signup = async (values) => {
  // Demo mode - return dummy success
  return { error: false, data: { message: "Signup successful" }, status: 200 };
};

export const signin = async (values) => {
  try {
    let response = await http.post("user/login", values);
    return { error: false, data: response.data, status: response.status };
  } catch (err) {
    return getErrorData(err)
  }
};

export const adminSignin = async (values) => {
  try {
    let response = await http.post("admin/login", values);
    // console.log("Admin sign in response", response);
    return { error: false, data: response.data, status: response.status };
  } catch (err) {
    return getErrorData(err)
  }
};

// COMMENTED OUT FOR DEMO - Token endpoints disabled
// export const verifyEmail = async (values) => {
//   try {
//     let response = await http.post("user/verify-email", values);
//     return { error: false, data: response.data, status: response.status };
//   } catch (err) {
//     return getErrorData(err)
//   }
// };
export const verifyEmail = async (values) => {
  return { error: false, data: { message: "Email verified successfully" }, status: 200 };
};

// COMMENTED OUT FOR DEMO - Token endpoints disabled
// export const resendOtp = async (values) => {
//   try {
//     let response = await http.post("user/resend-otp", values);
//     return { error: false, data: response.data, status: response.status };
//   } catch (err) {
//     return getErrorData(err)
//   }
// };
export const resendOtp = async (values) => {
  return { error: false, data: { message: "OTP sent successfully" }, status: 200 };
};

// COMMENTED OUT FOR DEMO - Token endpoints disabled
// export const forgotPassword = async (values) => {
//   try {
//     let response = await http.post("user/request-password-reset", values);
//     return { error: false, data: response.data, status: response.status };
//   } catch (err) {
//     return getErrorData(err)
//   }
// };
export const forgotPassword = async (values) => {
  return { error: false, data: { message: "Password reset email sent" }, status: 200 };
};

// COMMENTED OUT FOR DEMO - Token endpoints disabled
// export const adminForgotPassword = async (values) => {
//   try {
//     let response = await http.post("admin/request-password-reset", values);
//     return { error: false, data: response.data, status: response.status };
//   } catch (err) {
//     return getErrorData(err)
//   }
// };
export const adminForgotPassword = async (values) => {
  return { error: false, data: { message: "Password reset email sent" }, status: 200 };
};

// COMMENTED OUT FOR DEMO - Token endpoints disabled
// export const resetPassword = async (values) => {
//   try {
//     let response = await http.post("user/reset-password", values);
//     return { error: false, data: response.data, status: response.status };
//   } catch (err) {
//     return getErrorData(err)
//   }
// };
export const resetPassword = async (values) => {
  return { error: false, data: { message: "Password reset successfully" }, status: 200 };
};

// COMMENTED OUT FOR DEMO - Token endpoints disabled
// export const adminResetPassword = async (values) => {
//   try {
//     let response = await http.post("admin/reset-password", values);
//     return { error: false, data: response.data, status: response.status };
//   } catch (err) {
//     return getErrorData(err)
//   }
// };
export const adminResetPassword = async (values) => {
  return { error: false, data: { message: "Password reset successfully" }, status: 200 };
};

// COMMENTED OUT FOR DEMO - Token endpoints disabled
// export const changePassword = async (values) => {
//   try {
//     let response = await http.patch("user/update-password", values);
//     return { error: false, data: response.data, status: response.status };
//   } catch (err) {
//     return getErrorData(err)
//   }
// };
export const changePassword = async (values) => {
  return { error: false, data: { message: "Password changed successfully" }, status: 200 };
};

// COMMENTED OUT FOR DEMO - Token endpoints disabled
// export const adminChangePassword = async (values) => {
//   try {
//     let response = await http.patch("admin/change-password", values);
//     return { error: false, data: response.data, status: response.status };
//   } catch (err) {
//     return getErrorData(err)
//   }
// };
export const adminChangePassword = async (values) => {
  return { error: false, data: { message: "Password changed successfully" }, status: 200 };
};
