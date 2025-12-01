"use client";

import { PasswordInput, TextInput, TextLabelInput } from "@/components/FormFields";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import Spinner from "@/components/Spinner";
import { useState } from "react";
import { handleAPIError } from "@/utils/utils";
import { useDispatch, useSelector } from "react-redux";
import { showToast } from "@/redux/slices/ToastSlice";
import { useRouter } from "next/navigation";
import { resetPassword } from "@/services/authService";
import AuthLayout from "@/components/AuthLayout";
import React from "react";

export default function ResetPassword() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const userEmail = useSelector(state => state.auth.email)
  return (
    <AuthLayout>
      <div>
      <div className="flex flex-col gap-1">
          <h1 className="text-xl md:text-2xl font-semibold">Reset Password</h1>
          <p className="text-sm md:text-base">Almost there! Enter the OTP sent to your email and a new password to get access to your account.</p>
        </div>
        <div className="mt-5">
        <Formik
          initialValues={{
            newPassword: "",
            repeatPassword: "",
            otp: "",
          }}
          validationSchema={Yup.object({
            otp: Yup.string().required("OTP is required"),
            newPassword: Yup.string().required("New password is required"),
            repeatPassword: Yup.string().required("Confirm password is required").oneOf([Yup.ref("newPassword"), null], "Passwords must match"),
          })}
          onSubmit={async (values, { setSubmitting }) => {
            let data = {
              email: userEmail, ...values
            }
            setLoading(true);
            const response = await resetPassword(data);
            if (!response.error) {
              setLoading(false);
              dispatch(
                showToast({
                  status: "success",
                  message: "Password reset successful",
                })
              );
              router.push("/login");
            } else {
              setLoading(false);
              handleAPIError(response, dispatch, router, showToast);
            }
          }}
        >
          <Form>
            <div className="grid grid-cols-1 gap-5">
              <TextLabelInput
                label="OTP"
                name="otp"
                type="text"
                placeholder="OTP"
              />
              <PasswordInput
                label="New Password"
                name="newPassword"
                type="password"
                placeholder="New Password"
              />
              <PasswordInput
                label="Confirm Password"
                name="repeatPassword"
                type="password"
                placeholder="Confirm Password"
              />
            </div>
            <button
              className="font-semibold w-full block h-12 rounded-lg mt-8 bg-primary text-white hover:bg-green-800 active:scale-[0.98]"
              type="submit"
              disabled={loading}
            >
              {loading ? <Spinner /> : "Reset Password"}
            </button>
          </Form>
        </Formik>
        <div className="flex justify-center mt-3 mb-3">
          <p className="text-gray-400 text-sm">
            {"Already have an account?"}{" "}
            <Link href={"/login"}>
              <span className="text-primary font-semibold">Login</span>
            </Link>
          </p>
        </div>
      </div>
      </div>
    </AuthLayout>
  );
}
