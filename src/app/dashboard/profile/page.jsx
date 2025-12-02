"use client";

import { useState } from "react";
import moment from "moment";
import DetailsBox from "@/components/DetailsBox";
import Modal, {
  ModalBody,
  ModalHeader,
  ModalHeaderIcon,
  ModalHeaderTitle,
} from "@/components/Modal";
import {
  PasswordInput,
  TextLabelInput,
  SelectInput,
} from "@/components/FormFields";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { updateProfile } from "@/services/dashboardService";
import { showToast } from "@/redux/slices/ToastSlice";
import { handleAPIError } from "@/utils/utils";
import { useRouter } from "next/navigation";
import { changePassword } from "@/services/authService";

export default function ProfileHome() {
  const user = useSelector((state) => state.auth.userProfile);
  // console.log(user);
  const dispatch = useDispatch();
  const router = useRouter();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(user?.photo || "");
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(
    user?.photo || ""
  );
  const [loading, setLoading] = useState(false);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpdate = async (values) => {
    setLoading(true);
    const payload = {
      fullName: values.fullName,
      email: values.email,
      phoneNumber: values.phoneNumber,
      businessAddress: values.businessAddress,
      ...(profilePhotoPreview &&
        profilePhotoPreview !== user?.photo && { photo: profilePhotoPreview }),
    };
    const response = await updateProfile(payload);
    // console.log("Update Profile API Response:", response);
    if (!response.error) {
      dispatch(
        showToast({
          status: "success",
          message: "Profile updated successfully!",
        })
      );
      if (profilePhotoPreview) {
        setProfilePhoto(profilePhotoPreview);
      }
    } else {
      handleAPIError(response, dispatch, router, showToast);
    }
    setLoading(false);
  };

  const handlePasswordChange = async (values) => {
    setLoading(true);
    const payload = {
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
      confirmPassword: values.confirmPassword,
    };
    const response = await changePassword(payload);
    // console.log("Change Password API Response:", response);
    if (!response.error) {
      dispatch(
        showToast({
          status: "success",
          message: "Password changed successfully!",
        })
      );
      setShowPasswordModal(false);
    } else {
      handleAPIError(response, dispatch, router, showToast);
    }
    setLoading(false);
  };

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase() || "";
    if (statusLower === "active") {
      return "bg-green-100 text-green-700";
    } else if (statusLower === "blocked") {
      return "bg-red-100 text-red-700";
    } else {
      return "bg-gray-100 text-gray-700";
    }
  };

  const formatStatus = (status) => {
    if (!status) return "Inactive";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="py-5">
      <div className="pb-3 border-b border-gray-200 mb-5">
        <div className="flex items-center gap-4 mb-4">
          {/* Profile picture commented out - will not be implemented at this time */}
          {/* {profilePhoto ? (
            <img
              src={profilePhoto}
              alt={user?.fullName}
              className="w-20 h-20 rounded-full object-cover"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold">
              {user?.fullName
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2) || "U"}
            </div>
          )} */}
          <div>
            <h1 className="font-semibold capitalize text-lg md:text-xl mb-1">
              {user?.fullName || "User"}
            </h1>
            <p className="text-sm md:text-base text-gray-600">
              {user?.email || ""}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2">
          <Formik
            initialValues={{
              photo: null,
              photoPreview: profilePhoto,
              fullName: user?.fullName || "",
              email: user?.email || "",
              phoneNumber: user?.phoneNumber || "",
              businessAddress: {
                address: user?.businessAddress?.address || "",
                state: user?.businessAddress?.state || "",
              },
            }}
            validationSchema={Yup.object({
              fullName: Yup.string().required("Full name is required"),
              email: Yup.string()
                .email("Invalid email address")
                .required("Email is required"),
              phoneNumber: Yup.string(),
              businessAddress: Yup.object({
                address: Yup.string(),
                state: Yup.string(),
              }),
            })}
            onSubmit={handleProfileUpdate}
            enableReinitialize
          >
            {() => {
              const nigerianStates = [
                { name: "Select State", value: "" },
                { name: "Abia", value: "Abia" },
                { name: "Adamawa", value: "Adamawa" },
                { name: "Akwa Ibom", value: "Akwa Ibom" },
                { name: "Anambra", value: "Anambra" },
                { name: "Bauchi", value: "Bauchi" },
                { name: "Bayelsa", value: "Bayelsa" },
                { name: "Benue", value: "Benue" },
                { name: "Borno", value: "Borno" },
                { name: "Cross River", value: "Cross River" },
                { name: "Delta", value: "Delta" },
                { name: "Ebonyi", value: "Ebonyi" },
                { name: "Edo", value: "Edo" },
                { name: "Ekiti", value: "Ekiti" },
                { name: "Enugu", value: "Enugu" },
                { name: "Gombe", value: "Gombe" },
                { name: "Imo", value: "Imo" },
                { name: "Jigawa", value: "Jigawa" },
                { name: "Kaduna", value: "Kaduna" },
                { name: "Kano", value: "Kano" },
                { name: "Katsina", value: "Katsina" },
                { name: "Kebbi", value: "Kebbi" },
                { name: "Kogi", value: "Kogi" },
                { name: "Kwara", value: "Kwara" },
                { name: "Lagos", value: "Lagos" },
                { name: "Nasarawa", value: "Nasarawa" },
                { name: "Niger", value: "Niger" },
                { name: "Ogun", value: "Ogun" },
                { name: "Ondo", value: "Ondo" },
                { name: "Osun", value: "Osun" },
                { name: "Oyo", value: "Oyo" },
                { name: "Plateau", value: "Plateau" },
                { name: "Rivers", value: "Rivers" },
                { name: "Sokoto", value: "Sokoto" },
                { name: "Taraba", value: "Taraba" },
                { name: "Yobe", value: "Yobe" },
                { name: "Zamfara", value: "Zamfara" },
                { name: "FCT", value: "FCT" },
              ];

              return (
                <Form>
                  <div className="mb-6">
                    <div className="flex items-center justify-between">
                      {/* Profile picture section commented out - will not be implemented at this time */}
                      {/* <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                            {profilePhotoPreview ? (
                              <img
                                src={profilePhotoPreview}
                                alt="Preview"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-sm font-semibold text-gray-500">
                                No Image
                              </span>
                            )}
                          </div>
                          <label
                            htmlFor="profile-photo-input"
                            className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center cursor-pointer hover:bg-green-800 transition-colors"
                          >
                            <FontAwesomeIcon
                              icon={faCamera}
                              className="text-xs"
                            />
                          </label>
                          <input
                            id="profile-photo-input"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            Profile Picture
                          </p>
                          <p className="text-xs text-gray-500">
                            Click the camera icon to upload a new photo
                          </p>
                        </div>
                      </div> */}
                      <button
                        type="button"
                        onClick={() => setShowPasswordModal(true)}
                        className="px-4 py-2 rounded-md border bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 hover:border-gray-400 transition-colors"
                      >
                        Change Password
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                    <TextLabelInput
                      label="Full Name"
                      name="fullName"
                      type="text"
                      placeholder="Full Name"
                    />
                    <TextLabelInput
                      label="Email"
                      name="email"
                      type="email"
                      placeholder="Email Address"
                    />
                    <TextLabelInput
                      label="Phone Number"
                      name="phoneNumber"
                      type="text"
                      placeholder="Phone Number"
                    />
                    <SelectInput
                      label="State"
                      name="businessAddress.state"
                      data={nigerianStates}
                    />
                    <div className="md:col-span-2">
                      <TextLabelInput
                        label="Business Address"
                        name="businessAddress.address"
                        type="text"
                        placeholder="Business Address"
                      />
                    </div>
                  </div>
                  <button
                    disabled={loading}
                    className="font-semibold w-full md:w-auto px-6 h-12 rounded-lg bg-primary text-white hover:bg-green-800 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                    type="submit"
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </Form>
              );
            }}
          </Formik>
        </div>

        <div className="md:col-span-2 mt-6">
          <h2 className="font-semibold text-base mb-4">Account Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <DetailsBox label="Last Login">
              {user?.lastSeen
                ? moment(user.lastSeen).format("MMMM D, YYYY")
                : "—"}
            </DetailsBox>
            <DetailsBox label="Registered At">
              {user?.createdAt
                ? moment(user.createdAt).format("MMMM D, YYYY")
                : "—"}
            </DetailsBox>
            <DetailsBox label="Account Status">
              <span className={`text-xs py-1 px-2 rounded-md ${getStatusColor(user?.status)}`}>
                {formatStatus(user?.status)}
              </span>
            </DetailsBox>
          </div>
        </div>
      </div>

      {showPasswordModal && (
        <Modal maxW="max-w-md" closeModal={() => setShowPasswordModal(false)}>
          <ModalHeader>
            <ModalHeaderTitle text="Change Password" />
            <ModalHeaderIcon closeModal={() => setShowPasswordModal(false)} />
          </ModalHeader>
          <ModalBody>
            <Formik
              initialValues={{
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
              }}
              validationSchema={Yup.object({
                currentPassword: Yup.string().required(
                  "Current password is required"
                ),
                newPassword: Yup.string()
                  .min(6, "Password must be at least 6 characters")
                  .required("New password is required"),
                confirmPassword: Yup.string()
                  .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
                  .required("Please confirm your password"),
              })}
              onSubmit={handlePasswordChange}
            >
              <Form>
                <div className="mb-4">
                  <PasswordInput
                    label="Current Password"
                    name="currentPassword"
                    placeholder="Enter current password"
                  />
                </div>
                <div className="mb-4">
                  <PasswordInput
                    label="New Password"
                    name="newPassword"
                    placeholder="Enter new password"
                  />
                </div>
                <div className="mb-5">
                  <PasswordInput
                    label="Confirm New Password"
                    name="confirmPassword"
                    placeholder="Confirm new password"
                  />
                </div>
                <button
                  disabled={loading}
                  className="font-semibold w-full md:w-auto px-6 h-12 rounded-lg bg-primary text-white hover:bg-green-800 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  type="submit"
                >
                  {loading ? "Changing..." : "Change Password"}
                </button>
              </Form>
            </Formik>
          </ModalBody>
        </Modal>
      )}
    </div>
  );
}
