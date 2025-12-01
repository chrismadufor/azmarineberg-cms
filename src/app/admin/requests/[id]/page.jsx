"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import moment from "moment";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { TextAreaInput, SelectInput } from "@/components/FormFields";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faEye, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import DetailsBox from "@/components/DetailsBox";
import Modal, { ModalBody, ModalHeader, ModalHeaderIcon, ModalHeaderTitle } from "@/components/Modal";
import { fetchRequestById, fetchUserById, updateRequestStatus, updateRequestFile, fileUpload } from "@/services/adminService";
import { useDispatch, useSelector } from "react-redux";
import { showToast } from "@/redux/slices/ToastSlice";
import { handleAPIError } from "@/utils/utils";
import { useRouter } from "next/navigation";

export default function RequestDetailsPage() {
  const params = useParams();
  const { id } = params || {};
  const dispatch = useDispatch();
  const router = useRouter();
  const { services } = useSelector((state) => state.admin || { services: [] });
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details");
  const [showAssigneeModal, setShowAssigneeModal] = useState(false);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);

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

    if (!response.error) {
      const data = response.data?.data.data[0] || response.data || {};
      
      // Populate service from Redux store if service is just an ID
      let populatedRequest = { ...data };
      
      if (data.service && typeof data.service === 'string') {
        const serviceData = Array.isArray(services) 
          ? services.find(s => s._id === data.service || s.id === data.service)
          : null;
        if (serviceData) {
          populatedRequest.service = serviceData;
        }
      }
      
      // Fetch user data if user is just an ID
      if (data.user && typeof data.user === 'string') {
        try {
          const userResponse = await fetchUserById(data.user);
          if (!userResponse.error) {
            const userData = userResponse.data?.data?.user || userResponse.data?.data || userResponse.data || {};
            populatedRequest.user = userData;
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
        }
      }
      
      setRequest(populatedRequest);
    } else {
      handleAPIError(response, dispatch, router, showToast);
      setRequest(null);
    }
    setLoading(false);
  };

  const handleStatusUpdate = async (newStatus) => {
    setLoading(true);
    const response = await updateRequestStatus(id, newStatus);
    
    if (!response.error) {
      dispatch(
        showToast({
          status: "success",
          message: `Request ${newStatus} successfully!`,
        })
      );
      setShowAcceptModal(false);
      setShowRejectModal(false);
      setShowCompleteModal(false);
      fetchRequestData(); // Refresh request details
    } else {
      handleAPIError(response, dispatch, router, showToast);
    }
    setLoading(false);
  };

  const handleAcceptRequest = () => {
    handleStatusUpdate("processing");
  };

  const handleRejectRequest = () => {
    handleStatusUpdate("rejected");
  };

  const handleCompleteRequest = () => {
    handleStatusUpdate("completed");
  };

  const handleFileUpload = async (file) => {
    setUploadingFile(true);
    
    try {
      // Create FormData with 'file' key
      const formData = new FormData();
      formData.append('file', file);
      
      // Upload file
      const uploadResponse = await fileUpload(formData);
      
      if (!uploadResponse.error) {
        const fileUrl = uploadResponse.data?.data[0]?.url;
        
        if (fileUrl) {
          // Update request file with the file URL
          const updateResponse = await updateRequestFile(id, fileUrl);
          
          if (!updateResponse.error) {
            console.log("Update Request File Success Payload:", updateResponse.data);
            dispatch(
              showToast({
                status: "success",
                message: "File uploaded successfully!",
              })
            );
            fetchRequestData(); // Refresh request details
          } else {
            handleAPIError(updateResponse, dispatch, router, showToast);
          }
        } else {
          dispatch(
            showToast({
              status: "error",
              message: "File URL not found in upload response",
            })
          );
        }
      } else {
        handleAPIError(uploadResponse, dispatch, router, showToast);
      }
    } catch (err) {
      console.error("Error uploading file:", err);
      dispatch(
        showToast({
          status: "error",
          message: "Failed to upload file",
        })
      );
    }
    
    setUploadingFile(false);
  };

  const handleDocumentUpload = (file) => {
    handleFileUpload(file);
  };

  const handleDocumentUpdate = (file) => {
    handleFileUpload(file);
  };

  const getStatusColor = (status) => {
    const statusLowerLocal = status?.toLowerCase() || "";
    if (statusLowerLocal === "completed") {
      return "bg-green-100 text-green-700";
    } else if (statusLowerLocal === "processing" || statusLowerLocal === "accepted") {
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

  // Status checks
  const statusLower = request?.status?.toLowerCase() || "";
  const isPending = statusLower === "pending";
  const isProcessing = statusLower === "processing";
  const isCompleted = statusLower === "completed";
  const isRejected = statusLower === "rejected";
  const showQueriesTab = isProcessing || isCompleted;
  const showDocumentsTab = isCompleted; // Only show when status is completed
  const showMarkCompleteButton = isProcessing; // Show for processing status

  return (
    <div className="py-5">
      <div className="pb-3 border-b border-gray-200 mb-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-800 transition-colors"
              aria-label="Go back"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="text-lg" />
            </button>
            <div>
              <h1 className="font-semibold text-lg md:text-xl mb-1">Request Details</h1>
              <p className="text-sm md:text-base max-w-xl capitalize">
                {request?.user?.fullName || "Company"} · {request?.service?.title || "Service"}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            {isPending && (
              <>
                <button
                  onClick={() => setShowAcceptModal(true)}
                  className="px-4 py-2 rounded-md bg-green-600 text-white text-sm font-medium hover:bg-green-700"
                >
                  Accept Request
                </button>
                <button
                  onClick={() => setShowRejectModal(true)}
                  className="px-4 py-2 rounded-md bg-red-600 text-white text-sm font-medium hover:bg-red-700"
                >
                  Reject Request
                </button>
              </>
            )}
            {showMarkCompleteButton && (
              <button
                onClick={() => setShowCompleteModal(true)}
                className="px-4 h-12 rounded-md bg-primary text-white text-sm font-medium hover:bg-green-800"
              >
                Mark as Complete
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-4 mb-5">
        <button className={`px-4 py-2 rounded-md border text-sm ${activeTab === "details" ? "bg-primary text-white" : "bg-white"}`} onClick={() => setActiveTab("details")}>Details</button>
        {showQueriesTab && (
          <button className={`px-4 py-2 rounded-md border text-sm ${activeTab === "queries" ? "bg-primary text-white" : "bg-white"}`} onClick={() => setActiveTab("queries")}>
            Queries {request?.query?.length > 0 && `(${request.query.length})`}
          </button>
        )}
        {showDocumentsTab && (
          <button className={`px-4 py-2 rounded-md border text-sm ${activeTab === "document" ? "bg-primary text-white" : "bg-white"}`} onClick={() => setActiveTab("document")}>Document</button>
        )}
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
          <DetailsBox label="Company Name"><span className="capitalize">{request?.user?.fullName || "—"}</span></DetailsBox>
          <DetailsBox label="Company Email">{request?.user?.email || "—"}</DetailsBox>
          <DetailsBox label="Company Phone">{request?.user?.phoneNumber || "—"}</DetailsBox>
          <DetailsBox label="User ID">{request?.user?.azmarineUserId || "—"}</DetailsBox>
          {request?.user?.businessAddress && (
            <>
              {/* <div className="md:col-span-2">
                <p className="text-xs text-gray-500 font-semibold mb-2 mt-2">Business Address</p>
              </div> */}
              <div className="md:col-span-2">
              <DetailsBox label="Address">{request.user.businessAddress.address + ", " + request.user.businessAddress.state || "—"}</DetailsBox></div>
            </>
          )}
          {request?.note && (
            <div className="md:col-span-2"><DetailsBox label="Notes">{request.note}</DetailsBox></div>
          )}
          {/* <div className="md:col-span-2">
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
          </div> */}
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
          {!request.fileUrl ? (
            <div>
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
                    disabled={uploadingFile}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleDocumentUpload(file);
                    }}
                  />
                </div>
                {uploadingFile && (
                  <p className="text-sm text-gray-500 mt-2 text-center">Uploading file...</p>
                )}
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-5">
                <label className="text-sm font-semibold mb-2 block">Document</label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="px-4 h-10 rounded-md bg-primary text-white flex items-center gap-2 hover:bg-green-800"
                    onClick={() => {
                      if (request.fileUrl) window.open(request.fileUrl, '_blank');
                    }}
                  >
                    <FontAwesomeIcon icon={faEye} />
                    <span>View</span>
                  </button>
                  <button
                    type="button"
                    className="px-4 h-10 rounded-md bg-blue-600 text-white flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={uploadingFile}
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
                    disabled={uploadingFile}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleDocumentUpdate(file);
                    }}
                  />
                </div>
                {uploadingFile && (
                  <p className="text-sm text-gray-500 mt-2">Uploading file...</p>
                )}
              </div>
            </div>
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

      {showAcceptModal && (
        <Modal maxW="max-w-md" closeModal={() => setShowAcceptModal(false)}>
          <ModalHeader>
            <ModalHeaderTitle text="Accept Request" />
            <ModalHeaderIcon closeModal={() => setShowAcceptModal(false)} />
          </ModalHeader>
          <ModalBody>
            <div className="mb-5">
              <p className="text-sm text-gray-700">Are you sure you want to accept this request? The status will be changed to "Processing".</p>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowAcceptModal(false)}
                className="px-4 py-2 rounded-md border bg-white text-gray-700 text-sm font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAcceptRequest}
                disabled={loading}
                className="px-4 py-2 rounded-md bg-green-600 text-white text-sm font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Accepting..." : "Accept Request"}
              </button>
            </div>
          </ModalBody>
        </Modal>
      )}

      {showRejectModal && (
        <Modal maxW="max-w-md" closeModal={() => setShowRejectModal(false)}>
          <ModalHeader>
            <ModalHeaderTitle text="Reject Request" />
            <ModalHeaderIcon closeModal={() => setShowRejectModal(false)} />
          </ModalHeader>
          <ModalBody>
            <div className="mb-5">
              <p className="text-sm text-red-600 font-medium mb-2">Warning: This action is irreversible.</p>
              <p className="text-sm text-gray-700">Are you sure you want to reject this request? The status will be changed to "Rejected".</p>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 rounded-md border bg-white text-gray-700 text-sm font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectRequest}
                disabled={loading}
                className="px-4 py-2 rounded-md bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Rejecting..." : "Reject Request"}
              </button>
            </div>
          </ModalBody>
        </Modal>
      )}

      {showCompleteModal && (
        <Modal maxW="max-w-md" closeModal={() => setShowCompleteModal(false)}>
          <ModalHeader>
            <ModalHeaderTitle text="Complete Request" />
            <ModalHeaderIcon closeModal={() => setShowCompleteModal(false)} />
          </ModalHeader>
          <ModalBody>
            <div className="mb-5">
              <p className="text-sm text-gray-700">Are you sure you want to mark this request as completed? The status will be changed to "Completed".</p>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowCompleteModal(false)}
                className="px-4 py-2 rounded-md border bg-white text-gray-700 text-sm font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCompleteRequest}
                disabled={loading}
                className="px-4 py-2 rounded-md bg-primary text-white text-sm font-medium hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Completing..." : "Complete Request"}
              </button>
            </div>
          </ModalBody>
        </Modal>
      )}
    </div>
  );
}
