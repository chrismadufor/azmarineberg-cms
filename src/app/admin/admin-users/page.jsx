"use client";

import SearchBox from "@/components/SearchBox";
import Table from "@/components/Table";
import EmptyTable from "@/components/EmptyTable";
import Button from "@/components/Button";
import Modal, { ModalBody, ModalHeader, ModalHeaderIcon, ModalHeaderTitle } from "@/components/Modal";
import { TextLabelInput, SelectInput, PasswordInput } from "@/components/FormFields";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan, faPen, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { createAdmin, fetchAdminUsers } from "@/services/adminService";
import { useDispatch } from "react-redux";
import { showToast } from "@/redux/slices/ToastSlice";
import { handleAPIError } from "@/utils/utils";
import { useRouter } from "next/navigation";

export default function AdminUsersPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [adminUsers, setAdminUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paginationData, setPaginationData] = useState({ total: 0, current_page: 1, pages: 1 });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(null); // stores selected admin

  // New: edit form and confirm modals
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [confirmState, setConfirmState] = useState(null); // { type: 'delete'|'block', admin }

  const initialFilters = { pageNumber: 1, searchByName: "", searchByEmail: "", searchByPhone: "", searchByRole: "" };
  const [filters, setFilters] = useState(initialFilters);

  const columns = ["Name", "Email", "Role", "Actions"];
  const mobileColumns = ["Name", "Role"]; 

  const filterData = [
    { name: "Name", value: "searchByName" },
    { name: "Email", value: "searchByEmail" },
    { name: "Phone", value: "searchByPhone" },
    { name: "Role", value: "searchByRole", data: [
      { label: "Admin", value: "admin" },
    ]},
  ];

  const getAdminUsers = async (f) => {
    setLoading(true);
    const response = await fetchAdminUsers(f);
    // console.log("Admin Users (Admins) API Response:", response.data);

    if (!response.error) {
      const data = response.data?.data.data || [];
      // console.log("Admin Users (Admins) Payload:", data);

      let filteredData = Array.isArray(data) ? data : [];
      if (f.searchByName) {
        const search = String(f.searchByName).toLowerCase();
        filteredData = filteredData.filter((u) => (u.fullName || u.name)?.toLowerCase().includes(search));
      }
      if (f.searchByEmail) {
        const search = String(f.searchByEmail).toLowerCase();
        filteredData = filteredData.filter((u) => u.email?.toLowerCase().includes(search));
      }
      if (f.searchByPhone) {
        const search = String(f.searchByPhone);
        filteredData = filteredData.filter((u) => (u.phoneNumber || u.phone)?.includes(search));
      }
      if (f.searchByRole) {
        filteredData = filteredData.filter((u) => u.role === f.searchByRole);
      }

      setPaginationData(response.data?.pagination || { total: filteredData.length, current_page: f.pageNumber || 1, pages: 1 });
      setAdminUsers(filteredData);
    } else {
      handleAPIError(response, dispatch, router, showToast);
      setAdminUsers([]);
      setPaginationData({ total: 0, current_page: f.pageNumber || 1, pages: 1 });
    }

    setLoading(false);
  };

  const onSetFilter = (data) => setFilters({ pageNumber: 1, ...data });
  const onReset = () => setFilters(initialFilters);
  const changePage = (val) => setFilters(prev => ({ ...prev, pageNumber: val }));

  // handlers for actions
  const openAddAdmin = () => { setEditingAdmin(null); setShowFormModal(true); };
  const openEditAdmin = (admin) => { setEditingAdmin(admin); setShowFormModal(true); };
  const openConfirm = (type, admin) => setConfirmState({ type, admin });
  const closeConfirm = () => setConfirmState(null);

  useEffect(() => { getAdminUsers(filters); }, [filters]);

  return (
    <div className="py-5">
      <div className="flex justify-between items-center pb-3 border-b border-gray-200 mb-5">
        <div>
          <h1 className="font-semibold text-lg md:text-xl mb-1">Admin Users</h1>
          <p className="text-sm md:text-base max-w-xl">Manage admin users, roles, and access. Click a row to view details.</p>
        </div>
        <div>
          <Button text={"Add Admin User"} color={"green"} onClick={openAddAdmin} icon={<FontAwesomeIcon icon={faPlus} className="mr-2" />} />
        </div>
      </div>

      <SearchBox setFilter={onSetFilter} reset={onReset} filters={filterData} />

      <div className="flex gap-5 min-h-[500px] py-5">
        <div className="hidden md:block w-full">
          {adminUsers.length > 0 ? (
            <Table data={paginationData} columns={columns} changePage={changePage}>
              {adminUsers.map((item, index) => (
                <tr key={item._id} className="border-b h-14 cursor-pointer hover:bg-gray-50" onClick={() => setShowViewModal(item)}>
                  <td className="pl-5 w-12 text-center">{index + 1}</td>
                  <td className="px-5">{item.fullName || item.name}</td>
                  <td className="px-5">{item.email}</td>
                  <td className="px-5 capitalize">{item.role}</td>
                  <td className="px-5">
                    <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                      <FontAwesomeIcon className="text-primary hover:opacity-80 cursor-pointer" icon={faPen} onClick={() => openEditAdmin(item)} />
                      <FontAwesomeIcon className="text-red-500 hover:text-red-600 cursor-pointer" icon={faTrash} onClick={() => openConfirm('delete', item)} />
                      <FontAwesomeIcon className={`cursor-pointer ${item.blocked ? "text-orange-500" : "text-gray-500 hover:text-gray-700"}`} icon={faBan} onClick={() => openConfirm('block', item)} />
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
          {adminUsers.length > 0 ? (
            <Table data={paginationData} columns={columns} mobileColumns={mobileColumns} changePage={changePage}>
              {adminUsers.map((item, index) => (
                <tr key={item._id} className="border-b h-14 cursor-pointer hover:bg-gray-50" onClick={() => setShowViewModal(item)}>
                  <td className="pl-2 w-12 text-center">{index + 1}</td>
                  <td className="px-2">{item.fullName || item.name}</td>
                  <td className="px-2 capitalize">{item.role}</td>
                </tr>
              ))}
            </Table>
          ) : (
            <EmptyTable loading={loading} columns={columns} mobileColumns={mobileColumns} />
          )}
        </div>
      </div>

      {showFormModal && (
        <Modal maxW="max-w-xl" closeModal={() => setShowFormModal(false)}>
          <ModalHeader>
            <ModalHeaderTitle text={editingAdmin ? "Edit Admin User" : "Add Admin User"} />
            <ModalHeaderIcon closeModal={() => setShowFormModal(false)} />
          </ModalHeader>
          <ModalBody>
            <Formik
              initialValues={{ 
                fullName: editingAdmin?.fullName || editingAdmin?.name || "", 
                email: editingAdmin?.email || "", 
                password: "", 
                role: editingAdmin?.role || "" 
              }}
              validationSchema={Yup.object({
                fullName: Yup.string().required("Full name is required"),
                email: Yup.string().email("Invalid email").required("Email is required"),
                password: editingAdmin ? Yup.string() : Yup.string()
                  .min(6, "Password must be at least 6 characters")
                  .required("Password is required"),
                role: Yup.string().required("Role is required"),
              })}
              onSubmit={async (values) => {
                if (editingAdmin) {
                  // Edit functionality can be added here if updateAdmin service is available
                  setAdminUsers(prev => prev.map(u => u._id === editingAdmin._id ? { ...u, ...values } : u));
                  dispatch(showToast({ status: "success", message: "Admin updated successfully" }));
                  setShowFormModal(false);
                  setEditingAdmin(null);
                } else {
                  setLoading(true);
                  const adminPayload = {
                    fullName: values.fullName,
                    email: values.email,
                    password: values.password,
                    role: values.role,
                  };
                  const response = await createAdmin(adminPayload);
                  // console.log("Create Admin API Response:", response);
                  if (!response.error) {
                    dispatch(showToast({ status: "success", message: "Admin created successfully" }));
                    // Refresh the list or add the new admin
                    getAdminUsers(filters);
                    setShowFormModal(false);
                  } else {
                    handleAPIError(response, dispatch, router, showToast);
                  }
                  setLoading(false);
                }
              }}
            >
              <Form>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextLabelInput label="Full Name" name="fullName" type="text" placeholder="Full Name" />
                  <TextLabelInput label="Email" name="email" type="email" placeholder="Email" />
                  {!editingAdmin && (
                    <PasswordInput label="Password" name="password" placeholder="Enter password" />
                  )}
                  <SelectInput label="Role" name="role" data={[
                    { value: "admin", name: "Admin" },
                    { value: "superAdmin", name: "Super Admin" },
                  ]} />
                </div>
                <button className="font-semibold w-full md:w-auto px-6 h-12 rounded-lg mt-6 bg-primary text-white hover:bg-green-800 active:scale-[0.98]" type="submit">Save</button>
              </Form>
            </Formik>
          </ModalBody>
        </Modal>
      )}

      {confirmState && (
        <Modal maxW="max-w-md" closeModal={closeConfirm}>
          <ModalHeader>
            <ModalHeaderTitle text={confirmState.type === 'delete' ? "Delete Admin" : (confirmState.admin?.blocked ? "Unblock Admin" : "Block Admin")} />
            <ModalHeaderIcon closeModal={closeConfirm} />
          </ModalHeader>
          <ModalBody>
            <p className="mb-5">{confirmState.type === 'delete' ? `Are you sure you want to delete ${confirmState.admin?.name}? This action cannot be undone.` : `Are you sure you want to ${confirmState.admin?.blocked ? 'unblock' : 'block'} ${confirmState.admin?.name}?`}</p>
            <div className="flex justify-end gap-3">
              <button className="h-10 px-4 rounded-md border" onClick={closeConfirm}>Cancel</button>
              <button
                className={`h-10 px-4 rounded-md text-white ${confirmState.type === 'delete' ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-800'}`}
                onClick={() => {
                  if (confirmState.type === 'delete') {
                    setAdminUsers(prev => prev.filter(u => u._id !== confirmState.admin?._id));
                  } else {
                    setAdminUsers(prev => prev.map(u => u._id === confirmState.admin?._id ? { ...u, blocked: !u.blocked } : u));
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

      {showViewModal && (
        <Modal maxW="max-w-lg">
          <ModalHeader>
            <ModalHeaderTitle text="Admin Details" />
            <ModalHeaderIcon closeModal={() => setShowViewModal(null)} />
          </ModalHeader>
          <ModalBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Name</p>
                <p className="font-medium">{showViewModal.fullName || showViewModal.name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="font-medium">{showViewModal.email}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Phone</p>
                <p className="font-medium">{showViewModal.phoneNumber || showViewModal.phone}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Role</p>
                <p className="font-medium capitalize">{showViewModal.role}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Assigned Requests</p>
                <p className="font-medium">{showViewModal.assignedRequests}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Status</p>
                <p className={`font-medium ${showViewModal.blocked ? "text-orange-600" : "text-green-700"}`}>{showViewModal.blocked ? "Blocked" : "Active"}</p>
              </div>
            </div>
          </ModalBody>
        </Modal>
      )}
    </div>
  );
}

