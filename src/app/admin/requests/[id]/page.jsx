"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import moment from "moment";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { TextAreaInput, SelectInput } from "@/components/FormFields";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faEye } from "@fortawesome/free-solid-svg-icons";
import DetailsBox from "@/components/DetailsBox";
import Modal, { ModalBody, ModalHeader, ModalHeaderIcon, ModalHeaderTitle } from "@/components/Modal";
import { fetchRequestById } from "@/services/adminService";
import { useDispatch } from "react-redux";
import { showToast } from "@/redux/slices/ToastSlice";
import { handleAPIError } from "@/utils/utils";
import { useRouter } from "next/navigation";

export default function RequestDetailsPage() {
  const params = useParams();
  const { id } = params || {};
  const dispatch = useDispatch();
  const router = useRouter();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details");
  const [showAssigneeModal, setShowAssigneeModal] = useState(false);

  const assigneesOptions = [
    { name: "Select assignee", value: "" },
    { name: "Grace Hopper", value: "Grace Hopper" },
    { name: "Ada Lovelace", value: "Ada Lovelace" },
    { name: "Linus Torvalds", value: "Linus Torvalds" },
  ];

  useEffect(() => {
    if (id) {
      fetchRequestData();
    }
  }, [id]);

  const fetchRequestData = async () => {
    setLoading(true);
    const response = await fetchRequestById(id);
    console.log("Admin Request Details API Response:", response);
    console.log("Admin Request Details Payload:", response.data);

    if (!response.error) {
      const data = response.data?.data || response.data || {};
      setRequest(data);
    } else {
      handleAPIError(response, dispatch, router, showToast);
      setRequest(null);
    }
    setLoading(false);
  };

  const handleDocumentUpload = (file) => {
    setRequest(prev => ({
      ...prev,
      document: {
        name: file.name,
        url: URL.createObjectURL(file), // In production, this would be the actual uploaded URL
        file: file,
      }
    }));
  };

  const handleDocumentUpdate = (file) => {
    setRequest(prev => ({
      ...prev,
      document: {
        ...prev.document,
        name: file.name,
        url: URL.createObjectURL(file),
        file: file,
      }
    }));
  };

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase() || "";
    if (statusLower === "completed" || statusLower === "completed") {
      return "bg-green-100 text-green-700";
    } else if (statusLower === "processing" || statusLower === "accepted") {
      return "bg-blue-100 text-blue-700";
    } else {
      return "bg-orange-100 text-orange-700";
    }
  };

  const formatStatus = (status) => {
    if (!status) return "Pending";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (loading) {
    return (
      <div className="py-5">
        <div className="pb-3 border-b border-gray-200 mb-5">
          <h1 className="font-semibold text-lg md:text-xl mb-1">Loading...</h1>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="py-5">
        <div className="pb-3 border-b border-gray-200 mb-5">
          <h1 className="font-semibold text-lg md:text-xl mb-1">Request Not Found</h1>
          <p className="text-sm md:text-base text-gray-600">The request you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-5">
      <div className="pb-3 border-b border-gray-200 mb-5">
        <h1 className="font-semibold text-lg md:text-xl mb-1">Request Details</h1>
        <p className="text-sm md:text-base max-w-xl">
          {request?.user?.fullName || "Company"} · {request?.service?.title || "Service"}
        </p>
      </div>

      <div className="flex gap-4 mb-5">
        <button className={`px-4 py-2 rounded-md border text-sm ${activeTab === "details" ? "bg-primary text-white" : "bg-white"}`} onClick={() => setActiveTab("details")}>Details</button>
        <button className={`px-4 py-2 rounded-md border text-sm ${activeTab === "queries" ? "bg-primary text-white" : "bg-white"}`} onClick={() => setActiveTab("queries")}>
          Queries {request?.query?.length > 0 && `(${request.query.length})`}
        </button>
        <button className={`px-4 py-2 rounded-md border text-sm ${activeTab === "document" ? "bg-primary text-white" : "bg-white"}`} onClick={() => setActiveTab("document")}>Document</button>
      </div>

      {activeTab === "details" && request && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <DetailsBox label="Service Name">{request?.service?.title || "—"}</DetailsBox>
          <DetailsBox label="Status">
            <span className={`text-xs py-1 px-2 rounded-md ${getStatusColor(request?.status)}`}>
              {formatStatus(request?.status)}
            </span>
          </DetailsBox>
          <DetailsBox label="Date Created">{request?.createdAt ? moment(request.createdAt).format("MMMM D, YYYY") : "—"}</DetailsBox>
          {request?.expiryDate && (
            <DetailsBox label="Expiry Date">{moment(request.expiryDate).format("MMMM D, YYYY")}</DetailsBox>
          )}
          <div className="md:col-span-2">
            <p className="text-xs text-gray-500 font-semibold mb-2">Company Details</p>
          </div>
          <DetailsBox label="Company Name">{request?.user?.fullName || "—"}</DetailsBox>
          <DetailsBox label="Company Email">{request?.user?.email || "—"}</DetailsBox>
          <DetailsBox label="Company Phone">{request?.user?.phoneNumber || "—"}</DetailsBox>
          {request?.user?.businessAddress && (
            <>
              <div className="md:col-span-2">
                <p className="text-xs text-gray-500 font-semibold mb-2 mt-2">Business Address</p>
              </div>
              <DetailsBox label="Address">{request.user.businessAddress.address || "—"}</DetailsBox>
              <DetailsBox label="State">{request.user.businessAddress.state || "—"}</DetailsBox>
            </>
          )}
          {request?.note && (
            <div className="md:col-span-2"><DetailsBox label="Notes">{request.note}</DetailsBox></div>
          )}
          <div className="md:col-span-2">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <DetailsBox label="Admin Assigned">{request?.assignee || "—"}</DetailsBox>
              </div>
              <button
                className="px-4 h-[40px] rounded-md border bg-white hover:bg-gray-50 text-sm whitespace-nowrap mt-[20px]"
                onClick={() => setShowAssigneeModal(true)}
              >
                Change Assignee
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === "queries" && request && (
        <div className="max-w-[800px]">
          {request?.query && request.query.length > 0 ? (
            <div className="space-y-4">
              {request.query.map((queryItem, index) => (
                <div key={queryItem._id || index} className="bg-white border border-gray-300 rounded-md p-4">
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-sm font-medium text-gray-800">{queryItem.title || "Query"}</p>
                    <span className="text-xs text-gray-500">
                      {queryItem.date ? moment(queryItem.date).format("MMM D, YYYY h:mm A") : "—"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-gray-300 rounded-md p-8 text-center">
              <p className="text-sm text-gray-500">No queries yet</p>
            </div>
          )}
        </div>
      )}

      {activeTab === "document" && request && (
        <div className=" max-w-[800px]">
          {!request.document ? (
            <Formik
              initialValues={{ notes: request?.note || "" }}
              validationSchema={Yup.object({
                notes: Yup.string(),
              })}
              onSubmit={(values) => {
                setRequest(prev => ({ ...prev, note: values.notes }));
                // In production, submit to API
                alert("Document and notes submitted");
              }}
            >
              {({ setFieldValue }) => (
                <Form>
                  <div className="mb-5">
                    <label className="text-sm font-semibold mb-2 block">Request Document</label>
                    <div
                      className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                      onDragOver={(e) => { e.preventDefault(); }}
                      onDrop={(e) => {
                        e.preventDefault();
                        const file = e.dataTransfer.files[0];
                        if (file) handleDocumentUpload(file);
                      }}
                      onClick={() => document.getElementById("file-input").click()}
                    >
                      <FontAwesomeIcon icon={faFile} className="text-gray-400 text-4xl mb-2" />
                      <p className="text-sm text-gray-600 mb-1">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-500">PDF, DOC, DOCX (Max 10MB)</p>
                      <input
                        id="file-input"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleDocumentUpload(file);
                        }}
                      />
                    </div>
                  </div>
                  <div className="mb-5">
                    <TextAreaInput label="Notes for Company" name="notes" placeholder="Add notes for the company" />
                  </div>
                  <button className="font-semibold px-6 h-12 rounded-lg bg-primary text-white hover:bg-green-800 active:scale-[0.98]" type="submit">Submit</button>
                </Form>
              )}
            </Formik>
          ) : (
            <Formik
              initialValues={{ notes: request?.note || "" }}
              validationSchema={Yup.object({
                notes: Yup.string(),
              })}
              onSubmit={(values) => {
                setRequest(prev => ({ ...prev, note: values.notes }));
                // In production, submit to API
                alert("Notes updated");
              }}
            >
              {() => (
                <Form>
                  <div className="mb-5">
                    <label className="text-sm font-semibold mb-2 block">Document</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        value={request.document.name}
                        readOnly
                        className="flex-1 border border-gray-300 rounded-md px-3 h-10 bg-white"
                      />
                      <button
                        type="button"
                        className="px-4 h-10 rounded-md bg-primary text-white flex items-center gap-2 hover:bg-green-800"
                        onClick={() => {
                          if (request.document.url) window.open(request.document.url, '_blank');
                        }}
                      >
                        <FontAwesomeIcon icon={faEye} />
                        <span>View</span>
                      </button>
                      <button
                        type="button"
                        className="px-4 h-10 rounded-md bg-blue-600 text-white flex items-center gap-2 hover:bg-blue-700"
                        onClick={() => document.getElementById("update-file-input").click()}
                      >
                        <FontAwesomeIcon icon={faFile} />
                        <span>Update</span>
                      </button>
                      <input
                        id="update-file-input"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleDocumentUpdate(file);
                        }}
                      />
                    </div>
                  </div>
                  <div className="mb-5">
                    <TextAreaInput label="Notes for Company" name="notes" placeholder="Add notes for the company" />
                  </div>
                  <button className="font-semibold px-6 h-12 rounded-lg bg-primary text-white hover:bg-green-800 active:scale-[0.98]" type="submit">Submit</button>
                </Form>
              )}
            </Formik>
          )}
        </div>
      )}

      {showAssigneeModal && request && (
        <Modal maxW="max-w-md" closeModal={() => setShowAssigneeModal(false)}>
          <ModalHeader>
            <ModalHeaderTitle text="Change Assignee" />
            <ModalHeaderIcon closeModal={() => setShowAssigneeModal(false)} />
          </ModalHeader>
          <ModalBody>
            <Formik
              initialValues={{ assignee: request.assignee || "" }}
              validationSchema={Yup.object({
                assignee: Yup.string().required("Assignee is required"),
              })}
              onSubmit={(values) => {
                setRequest(prev => ({ ...prev, assignee: values.assignee }));
                setShowAssigneeModal(false);
                // In production, submit to API
              }}
            >
              <Form>
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2">Current Assignee</p>
                  <div className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-800 min-h-[40px] flex items-center">
                    {request.assignee || "—"}
                  </div>
                </div>
                <div className="mb-5">
                  <SelectInput label="New Assignee" name="assignee" data={assigneesOptions} />
                </div>
                <button className="font-semibold w-full md:w-auto px-6 h-12 rounded-lg bg-primary text-white hover:bg-green-800 active:scale-[0.98]" type="submit">Save Changes</button>
              </Form>
            </Formik>
          </ModalBody>
        </Modal>
      )}
    </div>
  );
}
