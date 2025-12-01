"use client";

import EmptyTable from "@/components/EmptyTable";
import SearchBox from "@/components/SearchBox";
import Table from "@/components/Table";
import Button from "@/components/Button";
import { shortenSentence } from "@/utils/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBan,
  faPen,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import Modal, {
  ModalBody,
  ModalHeader,
  ModalHeaderIcon,
  ModalHeaderTitle,
} from "@/components/Modal";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { TextLabelInput, SelectInput } from "@/components/FormFields";
import moment from "moment";
import { fetchAllUsers, createUser, updateUser } from "@/services/adminService";
import { useDispatch } from "react-redux";
import { showToast } from "@/redux/slices/ToastSlice";
import { handleAPIError } from "@/utils/utils";

export default function UsersHome() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paginationData, setPaginationData] = useState(null);

  const initialFilters = {
    pageNumber: 1,
    searchByName: "",
    searchByEmail: "",
    searchByPhone: "",
    searchByAddress: "",
  };
  const [filters, setFilters] = useState(initialFilters);

  const columns = ["ID", "Name", "Email", "Phone", "Actions"];
  const mobileColumns = ["Name", "Email"];

  const filterData = [
    { name: "Name", value: "searchByName" },
    { name: "Email", value: "searchByEmail" },
    { name: "Phone", value: "searchByPhone" },
    { name: "Address", value: "searchByAddress" },
  ];

  const getUsersData = async (f) => {
    setLoading(true);
    const response = await fetchAllUsers(f);

    if (!response.error) {
      const data = response.data?.data;
      const pagination = {
        total: data.userCount,
        current_page: data.page,
        pages: data.pages,
      };
      setPaginationData(pagination);
      setUsers(data.users);
    } else {
      handleAPIError(response, dispatch, router, showToast);
      setUsers([]);
      setPaginationData({
        total: 0,
        current_page: f.pageNumber || 1,
        pages: 1,
      });
    }

    setLoading(false);
  };

  const onSetFilter = (data) => setFilters({ pageNumber: 1, ...data });
  const onReset = () => setFilters(initialFilters);
  const changePage = (val) =>
    setFilters((prev) => ({ ...prev, pageNumber: val }));

  useEffect(() => {
    getUsersData(filters);
  }, [filters]);

  const [showFormModal, setShowFormModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [confirmState, setConfirmState] = useState(null); // { type: 'delete'|'block', user }

  const openAddUser = () => {
    setEditingUser(null);
    setShowFormModal(true);
  };

  const openEditUser = (user) => {
    setEditingUser(user);
    setShowFormModal(true);
  };

  const openConfirm = (type, user) => setConfirmState({ type, user });
  const closeConfirm = () => setConfirmState(null);

  return (
    <div className="py-5">
      <div className="flex justify-between items-center pb-3 border-b border-gray-200 mb-5">
        <div>
          <h1 className="font-semibold text-lg md:text-xl mb-1">
            All Companies
          </h1>
          <p className="text-sm md:text-base max-w-xl">
            All companies registered on the platform are found here. Click a
            record to view the user information.
          </p>
        </div>
        <div>
          <Button
            text={"Add new user"}
            color={"green"}
            icon={<FontAwesomeIcon icon={faPlus} className="mr-2" />}
            onClick={openAddUser}
          />
        </div>
      </div>
      <SearchBox setFilter={onSetFilter} reset={onReset} filters={filterData} />
      <div className="flex gap-5 min-h-[500px] py-5">
        <div className="hidden md:block w-full">
          {users && users.length > 0 ? (
            <Table
              data={paginationData}
              columns={columns}
              changePage={changePage}
            >
              {users.map((item, index) => (
                <tr
                  onClick={() => router.push(`/admin/users/${item._id}`)}
                  className="border-b h-14 cursor-pointer hover:bg-gray-50"
                  key={index}
                >
                  <td className="pl-5 w-12 text-center">{index + 1}</td>
                  <td className="px-5">{item.azmarineUserId}</td>
                  <td className="px-5 capitalize">
                    <div className="flex items-center gap-3">
                      {/* {item.photo ? (
                        <img src={item.photo} alt={item.name} className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold">
                          {(item.fullName)?.split(" ").map(n=>n[0]).join("")}
                        </div>
                      )} */}
                      <span>{shortenSentence(item.fullName)}</span>
                    </div>
                  </td>
                  <td className="px-5">{shortenSentence(item.email, 20)}</td>
                  <td className="px-5">{item.phoneNumber || item.phone}</td>
                  <td className="px-5" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-3">
                      <FontAwesomeIcon
                        className="text-primary hover:opacity-80 cursor-pointer"
                        icon={faPen}
                        onClick={() => openEditUser(item)}
                      />
                      {/* <FontAwesomeIcon
                        className="text-red-500 hover:text-red-600 cursor-pointer"
                        icon={faTrash}
                        onClick={() => openConfirm("delete", item)}
                      /> */}
                      <FontAwesomeIcon
                        className={`cursor-pointer ${
                          item.disabled
                            ? "text-orange-500"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                        icon={faBan}
                        onClick={() => openConfirm("block", item)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </Table>
          ) : (
            <EmptyTable loading={loading} columns={columns} />
          )}
        </div>
        <div className="md:hidden w-full">
          {users && users.length > 0 ? (
            <Table
              data={paginationData}
              columns={columns}
              mobileColumns={mobileColumns}
              changePage={changePage}
            >
              {users.map((item, index) => (
                <tr
                  onClick={() => router.push(`/admin/users/${item._id}`)}
                  className="border-b h-14 cursor-pointer hover:bg-gray-50"
                  key={index}
                >
                  <td className="pl-2 w-12 text-center">{index + 1}</td>
                  <td className="px-2 capitalize">
                    {shortenSentence(item.fullName || item.name)}
                  </td>
                  <td className="px-2">{shortenSentence(item.email, 20)}</td>
                </tr>
              ))}
            </Table>
          ) : (
            <EmptyTable
              loading={loading}
              columns={columns}
              mobileColumns={mobileColumns}
            />
          )}
        </div>
      </div>
      {showFormModal && (
        <Modal maxW="max-w-xl" closeModal={() => setShowFormModal(false)}>
          <ModalHeader>
            <ModalHeaderTitle text={editingUser ? "Edit Company" : "Add Company"} />
            <ModalHeaderIcon closeModal={() => setShowFormModal(false)} />
          </ModalHeader>
          <ModalBody>
            <Formik
              initialValues={{
                fullName: editingUser?.fullName || editingUser?.fullName || "",
                email: editingUser?.email || "",
                phoneNumber:
                  editingUser?.phoneNumber || editingUser?.phone || "",
                businessAddress: {
                  address:
                    editingUser?.businessAddress?.address ||
                    editingUser?.address ||
                    "",
                  state: editingUser?.businessAddress?.state || "",
                },
                photo: editingUser?.photo || "",
                photoPreview: editingUser?.photo || "",
              }}
              validationSchema={Yup.object({
                fullName: Yup.string().required("Full name is required"),
                email: Yup.string()
                  .email("Invalid email")
                  .required("Email is required"),
                phoneNumber: Yup.string().required("Phone number is required"),
                businessAddress: Yup.object({
                  address: Yup.string().required(
                    "Business address is required"
                  ),
                  state: Yup.string(),
                }),
              })}
              onSubmit={async (values) => {
                setLoading(true);
                const userPayload = {
                  fullName: values.fullName,
                  phoneNumber: values.phoneNumber,
                  businessAddress: values.businessAddress,
                  ...(!editingUser && {
                    email: values.email,
                  }),
                  // ...(values.photoPreview && { photo: values.photoPreview }),
                };

                if (editingUser) {
                  const response = await updateUser({
                    _id: editingUser._id,
                    data: userPayload,
                  });
                  if (!response.error) {
                    dispatch(
                      showToast({
                        status: "success",
                        message: "User updated successfully",
                      })
                    );
                    getUsersData(filters);
                    setShowFormModal(false);
                    setEditingUser(null);
                  } else {
                    handleAPIError(response, dispatch, router, showToast);
                  }
                } else {
                  const response = await createUser(userPayload);
                  if (!response.error) {
                    dispatch(
                      showToast({
                        status: "success",
                        message: "User created successfully",
                      })
                    );
                    getUsersData(filters);
                    setShowFormModal(false);
                  } else {
                    handleAPIError(response, dispatch, router, showToast);
                  }
                }
                setLoading(false);
              }}
            >
              {({ setFieldValue, values }) => {
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* <div className="md:col-span-2 flex items-center gap-4">
                        <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                          {values.photoPreview ? (
                            <img src={values.photoPreview} alt="Preview" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-xs text-gray-500">No Image</span>
                          )}
                        </div>
                        <div>
                          <input id="photo-input" type="file" accept="image/*" className="hidden" onChange={(e) => {
                            const file = e.currentTarget.files?.[0];
                            if (!file) return;
                            const url = URL.createObjectURL(file);
                            setFieldValue("photo", file);
                            setFieldValue("photoPreview", url);
                          }} />
                          <button type="button" className="h-9 px-4 rounded-md border text-sm" onClick={() => document.getElementById("photo-input").click()}>Select Image</button>
                        </div>
                      </div> */}
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
                        placeholder="Email"
                        disabled={!!editingUser}
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
                      className="font-semibold w-full md:w-auto px-6 h-12 rounded-lg mt-6 bg-primary text-white hover:bg-green-800 active:scale-[0.98]"
                      type="submit"
                    >
                      Save
                    </button>
                  </Form>
                );
              }}
            </Formik>
          </ModalBody>
        </Modal>
      )}

      {confirmState && (
        <Modal maxW="max-w-md" closeModal={closeConfirm}>
          <ModalHeader>
            <ModalHeaderTitle
              text={
                confirmState.type === "delete"
                  ? "Delete Company"
                  : confirmState.user?.disabled
                  ? "Unblock Company"
                  : "Block Company"
              }
            />
            <ModalHeaderIcon closeModal={closeConfirm} />
          </ModalHeader>
          <ModalBody>
            <p className="mb-5">
              {confirmState.type === "delete"
                ? `Are you sure you want to delete ${confirmState.user?.fullName}? This action cannot be undone.`
                : `Are you sure you want to ${
                    confirmState.user?.disabled ? "unblock" : "block"
                  }`} <span className="font-semibold capitalize">{confirmState.user?.fullName}</span>?
            </p>
            <div className="flex justify-end gap-3 mt-7">
              <button
                className="h-10 px-4 rounded-md border"
                onClick={closeConfirm}
              >
                Cancel
              </button>
              <button
                className={`h-10 px-4 rounded-md text-white ${
                  confirmState.type === "delete"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-gray-700 hover:bg-gray-800"
                }`}
                onClick={() => {
                  if (confirmState.type === "delete") {
                    setUsers((prev) =>
                      prev.filter((u) => u._id !== confirmState.user?._id)
                    );
                  } else {
                    setUsers((prev) =>
                      prev.map((u) =>
                        u._id === confirmState.user?._id
                          ? { ...u, disabled: !u.disabled }
                          : u
                      )
                    );
                  }
                  closeConfirm();
                }}
              >
                Confirm
              </button>
            </div>
          </ModalBody>
        </Modal>
      )}
    </div>
  );
}
