"use client";

import { PasswordInput, TextLabelInput } from "@/components/FormFields";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import Spinner from "@/components/Spinner";
import { useState } from "react";
import { handleAPIError } from "@/utils/utils";
import { useDispatch } from "react-redux";
import { showToast } from "@/redux/slices/ToastSlice";
import { useRouter } from "next/navigation";
import { resendOtp, adminSignin } from "@/services/authService";
import { saveEmail, setUserProfile } from "@/redux/slices/authSlice";
import AuthLayout from "@/components/AuthLayout";

export default function AdminLogin() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const resendEmail = async (email) => {
    let response = await resendOtp({ email: email });
    if (!response.error) {
      dispatch(
        showToast({
          status: "success",
          message: "Check your email for OTP to verify your account",
        })
      );
    } else {
      dispatch(
        showToast({
          status: "error",
          message: errorHandler(response.data),
        })
      );
    }
  };

  return (
    <AuthLayout>
      <div className="">
        <div>
          <div className="flex flex-col gap-1">
            <h1 className="text-lg md:text-xl font-semibold">
              Welcome back Admin!
            </h1>
            <p className="text-sm">Enter your details to access your account</p>
          </div>
        </div>
        <div className="mt-7">
          <Formik
            initialValues={{
              email: "",
              password: "",
            }}
            validationSchema={Yup.object({
              email: Yup.string()
                .email("Invalid email address")
                .required("Email is required"),
              password: Yup.string().required("Password is required"),
            })}
            onSubmit={async (values) => {
              setLoading(true);
              const response = await adminSignin(values);
              console.log("Log in response", response);
              if (!response.error) {
                setLoading(false);
                sessionStorage.setItem("azToken", response.data.data.data.token);
                dispatch(setUserProfile(response.data.data.data.admin));
                dispatch(
                  showToast({
                    status: "success",
                    message: "Log in successful",
                  })
                );
                router.push("/admin");
              } else {
                setLoading(false);
                if (response.status === 409) {
                  resendEmail(values.email);
                  dispatch(saveEmail(values.email));
                  return router.push("confirm-email");
                }
                handleAPIError(response, dispatch, router, showToast);
              }
            }}
          >
            <Form>
              <div className="grid grid-cols-1 gap-4">
                <TextLabelInput
                  label="Email"
                  name="email"
                  type="text"
                  placeholder="Email Address"
                />
                <PasswordInput
                  label="Password"
                  name="password"
                  type="password"
                  placeholder="Password"
                />
              </div>
              <Link href={"/forgot-password"}>
                <p className="text-gray-500 hover:text-gray-700 text-sm mt-2 font-medium mb-3 text-primary">
                  Forgot your password?
                </p>
              </Link>
              <button
                className="font-semibold w-full block h-12 rounded-lg mt-8 bg-primary text-white hover:bg-green-800 active:scale-[0.98]"
                type="submit"
                disabled={loading}
              >
                {loading ? <Spinner /> : "Log In"}
              </button>
            </Form>
          </Formik>
          <div className="flex justify-center mt-5 mb-3">
            <p className="text-gray-400 text-sm">
              {"Don't have an account?"}{" "}
              <Link href={""}>
                <span className="text-primary font-semibold">Contact us</span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
