"use client";

import SearchBox from "@/components/SearchBox";
import Table from "@/components/Table";
import EmptyTable from "@/components/EmptyTable";
import Button from "@/components/Button";
import Modal, { ModalBody, ModalHeader, ModalHeaderIcon, ModalHeaderTitle } from "@/components/Modal";
import { TextLabelInput, TextAreaInput } from "@/components/FormFields";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import moment from "moment";
import { fetchAllServices, createService, updateService } from "@/services/adminService";
import { useDispatch } from "react-redux";
import { showToast } from "@/redux/slices/ToastSlice";
import { handleAPIError, shortenSentence } from "@/utils/utils";
import { useRouter } from "next/navigation";

export default function ServicesPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [paginationData, setPaginationData] = useState({ total: 0, current_page: 1, pages: 1 });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [confirmState, setConfirmState] = useState(null); // { type: 'delete', service }

  const initialFilters = { pageNumber: 1, searchByName: "" };
  const [filters, setFilters] = useState(initialFilters);

  const columns = ["Service Name", "Description", "Created On", "Actions"];
  const mobileColumns = ["Service Name"];

  const filterData = [
    { name: "Service Name", value: "searchByName" },
  ];

  const getServices = async (f) => {
    setLoading(true);
    const response = await fetchAllServices(f);
    // console.log("Admin Services API Response:", response);

    if (!response.error) {
      const data = response.data?.data.data;

      // setPaginationData({ total: data.serviceCount, current_page: data.page, pages: data.pages });

      setServices(data);
    } else {
      handleAPIError(response, dispatch, router, showToast);
      setServices([]);
      setPaginationData({ total: 0, current_page: f.pageNumber || 1, pages: 1 });
    }

    setLoading(false);
  };

  const onSetFilter = (data) => setFilters({ pageNumber: 1, ...data });
  const onReset = () => setFilters(initialFilters);
  const changePage = (val) => setFilters(prev => ({ ...prev, pageNumber: val }));

  const openEdit = (service) => { setEditingService(service); setShowEditModal(true); };
  const openConfirmDelete = (service) => setConfirmState({ type: 'delete', service });
  const closeConfirm = () => setConfirmState(null);

  useEffect(() => { getServices(filters); }, [filters]);

  return (
    <div className="py-5">
      <div className="flex justify-between items-center pb-3 border-b border-gray-200 mb-5">
        <div>
          <h1 className="font-semibold text-lg md:text-xl mb-1">All Services</h1>
          <p className="text-sm md:text-base max-w-xl">Create and manage services offered on the platform.</p>
        </div>
        <div>
          <Button text={"Add New Service"} color={"green"} onClick={() => setShowAddModal(true)} icon={<FontAwesomeIcon icon={faPlus} className="mr-2" />} />
        </div>
      </div>

      <SearchBox setFilter={onSetFilter} reset={onReset} filters={filterData} />

      <div className="flex gap-5 min-h-[500px] py-5">
        <div className="hidden md:block w-full">
          {services.length > 0 ? (
            <Table data={paginationData} columns={columns} changePage={changePage}>
              {services.map((item, index) => (
                <tr key={item._id} className="border-b h-14 hover:bg-gray-50">
                  <td className="pl-5 w-12 text-center">{index + 1}</td>
                  <td className="px-5">{item.title || item.name || "—"}</td>
                  <td className="px-5">{shortenSentence(item.description) || "—"}</td>
                  <td className="px-5">{item.createdAt ? moment(item.createdAt).format("MMMM D, YYYY") : item.createdOn ? moment(item.createdOn).format("MMMM D, YYYY") : "—"}</td>
                  <td className="px-5">
                    <div className="flex items-center gap-3">
                      <FontAwesomeIcon className="text-primary hover:opacity-80 cursor-pointer" icon={faPen} onClick={() => openEdit(item)} />
                      <FontAwesomeIcon className="text-red-500 hover:text-red-600 cursor-pointer" icon={faTrash} onClick={() => openConfirmDelete(item)} />
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
          {services.length > 0 ? (
            <Table data={paginationData} columns={columns} mobileColumns={mobileColumns} changePage={changePage}>
              {services.map((item, index) => (
                <tr key={item._id} className="border-b h-14">
                  <td className="pl-2 w-12 text-center">{index + 1}</td>
                  <td className="px-2">{item.title || item.name || "—"}</td>
                </tr>
              ))}
            </Table>
          ) : (
            <EmptyTable loading={loading} columns={columns} mobileColumns={mobileColumns} />
          )}
        </div>
      </div>

      {showAddModal && (
        <Modal maxW="max-w-xl">
          <ModalHeader>
            <ModalHeaderTitle text="Add Service" />
            <ModalHeaderIcon closeModal={() => setShowAddModal(false)} />
          </ModalHeader>
          <ModalBody>
            <Formik
              initialValues={{ title: "", description: "" }}
              validationSchema={Yup.object({
                title: Yup.string().required("Service title is required"),
                description: Yup.string().required("Service description is required"),
              })}
              onSubmit={async (values) => {
                setSubmitting(true);
                const response = await createService(values);
                // console.log("Create Service API Response:", response);

                if (!response.error) {
                  dispatch(showToast({ status: "success", message: "Service created successfully" }));
                  setShowAddModal(false);
                  getServices(filters);
                } else {
                  handleAPIError(response, dispatch, router, showToast);
                }
                setSubmitting(false);
              }}
            >
              <Form>
                <div className="grid grid-cols-1 gap-4">
                  <TextLabelInput label="Service Title" name="title" type="text" placeholder="Enter service title" />
                  <TextAreaInput label="Description" name="description" placeholder="Enter service description" />
                </div>
                <button 
                  className="font-semibold w-full md:w-auto px-6 h-12 rounded-lg mt-6 bg-primary text-white hover:bg-green-800 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed" 
                  type="submit"
                  disabled={submitting}
                >
                  {submitting ? "Saving..." : "Save"}
                </button>
              </Form>
            </Formik>
          </ModalBody>
        </Modal>
      )}

      {showEditModal && (
        <Modal maxW="max-w-xl" closeModal={() => setShowEditModal(false)}>
          <ModalHeader>
            <ModalHeaderTitle text="Edit Service" />
            <ModalHeaderIcon closeModal={() => setShowEditModal(false)} />
          </ModalHeader>
          <ModalBody>
            <Formik
              initialValues={{ 
                title: editingService?.title || editingService?.name || "", 
                description: editingService?.description || "" 
              }}
              validationSchema={Yup.object({
                title: Yup.string().required("Service title is required"),
                description: Yup.string().required("Service description is required"),
              })}
              onSubmit={async (values) => {
                setSubmitting(true);
                const response = await updateService({ _id: editingService._id, data: values });
                // console.log("Update Service API Response:", response);

                if (!response.error) {
                  dispatch(showToast({ status: "success", message: "Service updated successfully" }));
                  setShowEditModal(false);
                  setEditingService(null);
                  getServices(filters);
                } else {
                  handleAPIError(response, dispatch, router, showToast);
                }
                setSubmitting(false);
              }}
            >
              <Form>
                <div className="grid grid-cols-1 gap-4">
                  <TextLabelInput label="Service Title" name="title" type="text" placeholder="Enter service title" />
                  <TextAreaInput label="Description" name="description" placeholder="Enter service description" />
                </div>
                <button 
                  className="font-semibold w-full md:w-auto px-6 h-12 rounded-lg mt-6 bg-primary text-white hover:bg-green-800 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed" 
                  type="submit"
                  disabled={submitting}
                >
                  {submitting ? "Saving..." : "Save Changes"}
                </button>
              </Form>
            </Formik>
          </ModalBody>
        </Modal>
      )}

      {confirmState && (
        <Modal maxW="max-w-md" closeModal={closeConfirm}>
          <ModalHeader>
            <ModalHeaderTitle text="Delete Service" />
            <ModalHeaderIcon closeModal={closeConfirm} />
          </ModalHeader>
          <ModalBody>
            <p className="mb-5">Are you sure you want to delete {confirmState.service?.title || confirmState.service?.name}? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button className="h-10 px-4 rounded-md border" onClick={closeConfirm}>Cancel</button>
              <button
                className="h-10 px-4 rounded-md text-white bg-red-600 hover:bg-red-700"
                onClick={() => {
                  setServices(prev => prev.filter(s => s._id !== confirmState.service?._id));
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



