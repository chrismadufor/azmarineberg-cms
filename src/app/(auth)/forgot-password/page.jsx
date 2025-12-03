"use client";

import { TextLabelInput } from "@/components/FormFields";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import Spinner from "@/components/Spinner";
import { useState } from "react";
import { handleAPIError } from "@/utils/utils";
import { useDispatch } from "react-redux";
import { showToast } from "@/redux/slices/ToastSlice";
import { useRouter } from "next/navigation";
import { forgotPassword } from "@/services/authService";
import { saveEmail } from "@/redux/slices/authSlice";
import AuthLayout from "@/components/AuthLayout";

export default function ForgotPassword() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  return (
    <AuthLayout>
      <div>
      <div className="flex flex-col gap-1">
          <h1 className="text-xl md:text-2xl font-semibold">Forgot Password</h1>
          <p className="text-sm">We got you! Enter your email to get an OTP to reset your password.</p>
        </div>
        <div className="mt-5">
        <Formik
          initialValues={{
            email: "",
          }}
          validationSchema={Yup.object({
            email: Yup.string()
              .email("Invalid email address")
              .required("Email is required"),
          })}
          onSubmit={async (values, { setSubmitting }) => {
            setLoading(true);
            const response = await forgotPassword(values);
            if (!response.error) {
              setLoading(false);
              dispatch(saveEmail(values.email));
              dispatch(
                showToast({
                  status: "success",
                  message: "OTP sent successfully. Please check your email.",
                })
              );
              router.push("/reset-password");
            } else {
              setLoading(false);
              handleAPIError(response, dispatch, router, showToast);
            }
          }}
        >
          <Form>
            <div className="grid grid-cols-1 gap-5">
              <TextLabelInput
                label="Email"
                name="email"
                type="text"
                placeholder="Email Address"
              />
            </div>
            <button
              className="font-semibold w-full block h-12 rounded-lg mt-8 bg-primary text-white hover:bg-green-800 active:scale-[0.98]"
              type="submit"
              disabled={loading}
            >
              {loading ? <Spinner /> : "Send OTP"}
            </button>
          </Form>
        </Formik>
        <div className="flex justify-center mt-3 mb-3">
          <p className="text-gray-400 text-sm">
            {"Already have an account?"}{" "}
            <Link href={"/login"}>
              <span className="text-primary font-semibold">Log in</span>
            </Link>
          </p>
        </div>
      </div>
      </div>
    </AuthLayout>
  );
}
