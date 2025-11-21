"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import moment from "moment";
import DetailsBox from "@/components/DetailsBox";
import Modal, { ModalBody, ModalHeader, ModalHeaderIcon, ModalHeaderTitle } from "@/components/Modal";
import { TextAreaInput } from "@/components/FormFields";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faFile } from "@fortawesome/free-solid-svg-icons";
import { fetchRequestById } from "@/services/dashboardService";
import { useDispatch } from "react-redux";
import { showToast } from "@/redux/slices/ToastSlice";
import { handleAPIError, getRequestStatusColor, formatRequestStatus } from "@/utils/utils";
import { useRouter } from "next/navigation";

export default function RequestDetailsPage() {
  const params = useParams();
  const { id } = params || {};
  const dispatch = useDispatch();
  const router = useRouter();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showQueryModal, setShowQueryModal] = useState(false);

  useEffect(() => {
    if (id) {
      fetchRequestData();
    }
  }, [id]);

  const fetchRequestData = async () => {
    setLoading(true);
    const response = await fetchRequestById(id);
    console.log("Dashboard Request Details API Response:", response);
    console.log("Dashboard Request Details Payload:", response.data);

    if (!response.error) {
      const data = response.data?.data || response.data || {};
      setRequest(data);
    } else {
      handleAPIError(response, dispatch, router, showToast);
      setRequest(null);
    }
    setLoading(false);
  };

  const handleSendQuery = (values) => {
    // In production, submit query to API
    console.log("Query submitted:", values.query);
    setShowQueryModal(false);
    alert("Your query has been sent successfully!");
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
        <h1 className="font-semibold text-lg md:text-xl mb-1">{request?.service?.title || request?.serviceName || "Request Details"}</h1>
        <p className="text-sm md:text-base text-gray-600">{request?.serviceId || request?._id || ""}</p>
      </div>

      {/* Request Details Section */}
      <div className="mb-8">
        <h2 className="font-semibold text-base mb-4">Request Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <DetailsBox label="Service Name">{request?.service?.title || request?.serviceName || "—"}</DetailsBox>
          <DetailsBox label="Service ID">{request?.serviceId || request?._id || "—"}</DetailsBox>
          <DetailsBox label="Date">{request?.createdAt ? moment(request.createdAt).format("MMMM D, YYYY") : request?.date ? moment(request.date).format("MMMM D, YYYY") : "—"}</DetailsBox>
          <DetailsBox label="Status">
            <span className={`text-xs py-1 px-2 rounded-md ${getRequestStatusColor(request?.status).bg} ${getRequestStatusColor(request?.status).text}`}>
              {formatRequestStatus(request?.status)}
            </span>
          </DetailsBox>
          {request?.facilityName && (
            <DetailsBox label="Facility Name">{request.facilityName}</DetailsBox>
          )}
          {request?.facilityAddress && (
            <DetailsBox label="Facility Address">{request.facilityAddress}</DetailsBox>
          )}
          {request?.notes && (
            <div className="md:col-span-2">
              <DetailsBox label="Notes">{request.notes}</DetailsBox>
            </div>
          )}
        </div>
      </div>

      {/* Request Document Section */}
      <div>
        <h2 className="font-semibold text-base mb-4">Request Document</h2>
        <div className="bg-white border border-gray-300 rounded-md p-6">
          {(request?.status === "Accepted" || request?.status === "accepted" || request?.status === "processing") && (
            <div className="mb-4">
              <p className="text-sm text-gray-700 mb-4">Your request has been accepted. Our team is working on it.</p>
              <button
                onClick={() => setShowQueryModal(true)}
                className="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 hover:border-gray-400 transition-colors"
              >
                Send Query
              </button>
            </div>
          )}
          
          {(request?.status === "Completed" || request?.status === "completed") && (
            <div>
              <p className="text-sm text-gray-700 mb-4">Your request has been completed. Download the document here.</p>
              {request.document ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-gray-700">
                    <FontAwesomeIcon icon={faFile} className="text-gray-400" />
                    <span className="text-sm">{request.document.name}</span>
                  </div>
                  <a
                    href={request.document.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-md bg-primary text-white text-sm font-medium hover:bg-green-800 transition-colors flex items-center gap-2"
                  >
                    <FontAwesomeIcon icon={faDownload} />
                    <span>Download</span>
                  </a>
                </div>
              ) : (
                <p className="text-sm text-gray-500">Document will be available soon.</p>
              )}
            </div>
          )}

          {(request?.status === "Pending" || request?.status === "pending") && (
            <p className="text-sm text-gray-700">Your request is pending review. We'll update you once it's processed.</p>
          )}
        </div>
      </div>

      {/* Send Query Modal */}
      {showQueryModal && (
        <Modal maxW="max-w-md" closeModal={() => setShowQueryModal(false)}>
          <ModalHeader>
            <ModalHeaderTitle text="Send Query" />
            <ModalHeaderIcon closeModal={() => setShowQueryModal(false)} />
          </ModalHeader>
          <ModalBody>
            <Formik
              initialValues={{ query: "" }}
              validationSchema={Yup.object({
                query: Yup.string().required("Query is required"),
              })}
              onSubmit={handleSendQuery}
            >
              <Form>
                <div className="mb-5">
                  <TextAreaInput label="Your Query" name="query" placeholder="Enter your question or concern..." />
                </div>
                <button className="font-semibold w-full md:w-auto px-6 h-12 rounded-lg bg-primary text-white hover:bg-green-800 active:scale-[0.98]" type="submit">Send Query</button>
              </Form>
            </Formik>
          </ModalBody>
        </Modal>
      )}
    </div>
  );
}

