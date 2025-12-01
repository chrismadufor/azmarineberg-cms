"use client";

import SearchBox from "@/components/SearchBox";
import Table from "@/components/Table";
import EmptyTable from "@/components/EmptyTable";
import Button from "@/components/Button";
import Modal, { ModalBody, ModalHeader, ModalHeaderIcon, ModalHeaderTitle } from "@/components/Modal";
import { SelectInput, TextLabelInput, TextAreaInput } from "@/components/FormFields";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import moment from "moment";
import { useRouter } from "next/navigation";
import { createRequest, fetchAllRequests } from "@/services/adminService";
import { useDispatch, useSelector } from "react-redux";
import { showToast } from "@/redux/slices/ToastSlice";
import { handleAPIError, getRequestStatusColor, formatRequestStatus } from "@/utils/utils";

export default function RequestsPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { services, users } = useSelector((state) => state.admin || { services: [], users: [] });
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paginationData, setPaginationData] = useState({ total: 0, current_page: 1, pages: 1 });
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewRequest, setViewRequest] = useState(null);

  const initialFilters = { pageNumber: 1, searchByService: "", searchByCompany: "", searchByStatus: "" };
  const [filters, setFilters] = useState(initialFilters);

  const columns = ["Company Name", "Service Name", "Date", "Status"];
  const mobileColumns = ["Service Name", "Status"];

  // Build services options from Redux store
  const servicesOptions = [
    { name: "Select service", value: "" },
    ...(Array.isArray(services) ? services.map((service) => ({
      name: service.title || service.name || "Unknown Service",
      value: service._id || service.id || "",
    })) : []),
  ];

  // Build users options from Redux store
  const usersOptions = [
    { name: "Select user", value: "" },
    ...(Array.isArray(users) ? users.map((user) => ({
      name: user.fullName || user.name || "Unknown User",
      value: user._id || user.id || "",
    })) : []),
  ];

  const filterData = [
    { name: "Service", value: "searchByService" },
    { name: "Company", value: "searchByCompany" },
    { name: "Status", value: "searchByStatus", data: [
      { label: "Pending", value: "Pending" },
      { label: "Completed", value: "Completed" },
    ]},
  ];

  const getRequests = async (f) => {
    setLoading(true);
    const response = await fetchAllRequests(f);
    console.log("Admin Requests API Response:", response);

    if (!response.error) {
      const data = response.data?.data?.data;
      console.log("Admin Requests Payload:", data);
      
      const pagination = data.requestCount !== undefined ? {
        total: data.requestCount,
        current_page: data.page || f.pageNumber || 1,
        pages: data.pages || 1,
      } : {
        total: Array.isArray(data.requests) ? data.requests.length : 0,
        current_page: f.pageNumber || 1,
        pages: 1,
      };

      setPaginationData(pagination);
      setRequests(data.requests);
    } else {
      handleAPIError(response, dispatch, router, showToast);
      setRequests([]);
      setPaginationData({ total: 0, current_page: f.pageNumber || 1, pages: 1 });
    }

    setLoading(false);
  };

  const onSetFilter = (data) => setFilters({ pageNumber: 1, ...data });
  const onReset = () => setFilters(initialFilters);
  const changePage = (val) => setFilters(prev => ({ ...prev, pageNumber: val }));

  useEffect(() => { getRequests(filters); }, [filters]);

  return (
    <div className="py-5">
      <div className="flex justify-between items-center pb-3 border-b border-gray-200 mb-5">
        <div>
          <h1 className="font-semibold text-lg md:text-xl mb-1">All Requests</h1>
          <p className="text-sm md:text-base max-w-xl">Track and review all service requests. Click a row to view details.</p>
        </div>
        <div>
          <Button text={"Add New Request"} color={"green"} onClick={() => setShowAddModal(true)} icon={<FontAwesomeIcon icon={faPlus} className="mr-2" />} />
        </div>
      </div>

      <SearchBox setFilter={onSetFilter} reset={onReset} filters={filterData} />

      <div className="flex gap-5 min-h-[500px] py-5">
        <div className="hidden md:block w-full">
          {requests.length > 0 ? (
            <Table data={paginationData} columns={columns} changePage={changePage}>
              {requests.map((item, index) => (
                <tr key={item._id} className="border-b h-14 cursor-pointer hover:bg-gray-50" onClick={() => router.push(`/admin/requests/${item._id}`)}>
                  <td className="pl-5 w-12 text-center">{index + 1}</td>
                  <td className="px-5 capitalize">{item.user.fullName}</td>
                  <td className="px-5">{item.service.title}</td>
                  <td className="px-5">{item.createdAt ? moment(item.createdAt).format("MMMM D, YYYY") : moment(item.date).format("MMMM D, YYYY")}</td>
                  <td className="px-5">
                    {(() => {
                      const statusColors = getRequestStatusColor(item.status);
                      return (
                        <span className={`text-xs py-1 px-2 rounded-md ${statusColors.bg} ${statusColors.text}`}>
                          {formatRequestStatus(item.status)}
                        </span>
                      );
                    })()}
                  </td>
                </tr>
              ))}
            </Table>
          ) : (
            <EmptyTable loading={loading} columns={columns} />
          )}
        </div>
        <div className="md:hidden w-full">
          {requests.length > 0 ? (
            <Table data={paginationData} columns={columns} mobileColumns={mobileColumns} changePage={changePage}>
              {requests.map((item, index) => (
                <tr key={item._id} className="border-b h-14 cursor-pointer hover:bg-gray-50" onClick={() => router.push(`/admin/requests/${item._id}`)}>
                  <td className="pl-2 w-12 text-center">{index + 1}</td>
                  <td className="px-2">{item?.service?.title || item.serviceName || "—"}</td>
                  <td className="px-2">
                    {(() => {
                      const statusColors = getRequestStatusColor(item.status);
                      return (
                        <span className={`text-[10px] py-1 px-2 rounded-md ${statusColors.bg} ${statusColors.text}`}>
                          {formatRequestStatus(item.status)}
                        </span>
                      );
                    })()}
                  </td>
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
            <ModalHeaderTitle text="Add Request" />
            <ModalHeaderIcon closeModal={() => setShowAddModal(false)} />
          </ModalHeader>
          <ModalBody>
            <Formik
              initialValues={{ service: "", company: "", facilityName: "", facilityAddress: "", notes: "" }}
              validationSchema={Yup.object({
                service: Yup.string().required("Service is required"),
                company: Yup.string().required("User/Company is required"),
                notes: Yup.string(),
              })}
              onSubmit={async (values) => {
                let payload = {
                  userId: values.company,
                  data: {
                    service: values.service,
                    note: values.notes,
                  }
                }
                const response = await createRequest(payload);
                if (!response.error) {
                  dispatch(showToast({ status: "success", message: "Request created successfully!" }));
                  setShowAddModal(false);
                  fetchRequests(filters);
                } else {
                  handleAPIError(response, dispatch, router, showToast);
                }
                setShowAddModal(false);
              }}
            >
              <Form>
                <div className="grid grid-cols-1 gap-4">
                  <SelectInput label="Service" name="service" data={servicesOptions} />
                  <SelectInput label="User" name="company" data={usersOptions} />
                  {/* <TextLabelInput label="Facility Name" name="facilityName" type="text" placeholder="Facility name" />
                  <TextLabelInput label="Facility Address" name="facilityAddress" type="text" placeholder="Facility address" /> */}
                  <div className="">
                    <TextAreaInput label="Request Notes" name="notes" placeholder="Notes" />
                  </div>
                </div>
                <button className="font-semibold w-full md:w-auto px-6 h-12 rounded-lg mt-6 bg-primary text-white hover:bg-green-800 active:scale-[0.98]" type="submit">Submit</button>
              </Form>
            </Formik>
          </ModalBody>
        </Modal>
      )}

      {viewRequest && (
        <Modal maxW="max-w-lg">
          <ModalHeader>
            <ModalHeaderTitle text="Request Details" />
            <ModalHeaderIcon closeModal={() => setViewRequest(null)} />
          </ModalHeader>
          <ModalBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Service</p>
                <p className="font-medium">{viewRequest.serviceName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Company</p>
                <p className="font-medium">{viewRequest.companyName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Date</p>
                <p className="font-medium">{moment(viewRequest.date).format("MMMM D, YYYY")}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Status</p>
                <p className={`font-medium ${viewRequest.status === "Completed" ? "text-green-700" : "text-orange-700"}`}>{viewRequest.status}</p>
              </div>
              {viewRequest.facilityName && viewRequest.facilityAddress && (
                <div>
                  <p className="text-xs text-gray-500">Facility</p>
                  <p className="font-medium">{viewRequest.facilityName} — {viewRequest.facilityAddress}</p>
                </div>
              )}
              {viewRequest.notes && (
                <div className="md:col-span-2">
                  <p className="text-xs text-gray-500">Notes</p>
                  <p className="font-medium">{viewRequest.notes}</p>
                </div>
              )}
            </div>
          </ModalBody>
        </Modal>
      )}
    </div>
  );
}




