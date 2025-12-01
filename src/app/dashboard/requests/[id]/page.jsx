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
import { faDownload, faFile, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { fetchRequestById, sendQuery } from "@/services/dashboardService";
import { useDispatch, useSelector } from "react-redux";
import { showToast } from "@/redux/slices/ToastSlice";
import { handleAPIError, getRequestStatusColor, formatRequestStatus } from "@/utils/utils";
import { useRouter } from "next/navigation";

export default function RequestDetailsPage() {
  const params = useParams();
  const { id } = params || {};
  const dispatch = useDispatch();
  const router = useRouter();
  const { services } = useSelector((state) => state.dashboard || { services: [] });
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showQueryModal, setShowQueryModal] = useState(false);
  const [submittingQuery, setSubmittingQuery] = useState(false);

  useEffect(() => {
    if (id) {
      fetchRequestData();
    }
  }, [id]);

  const fetchRequestData = async () => {
    setLoading(true);
    const response = await fetchRequestById(id);
    console.log("Dashboard Request Details Payload:", response.data?.data?.[0] || response.data);

    if (!response.error) {
      const data = response.data?.data?.[0] || response.data?.data || response.data || {};
      
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
      
      setRequest(populatedRequest);
    } else {
      handleAPIError(response, dispatch, router, showToast);
      setRequest(null);
    }
    setLoading(false);
  };

  const handleSendQuery = async (values) => {
    setSubmittingQuery(true);
    const payload = {
      requestId: id,
      data: {
        title: values.query,
      },
    };
    
    const response = await sendQuery(payload);
    
    if (!response.error) {
      dispatch(
        showToast({
          status: "success",
          message: "Your query has been sent successfully!",
        })
      );
      setShowQueryModal(false);
      fetchRequestData(); // Refresh request data to get updated queries
    } else {
      handleAPIError(response, dispatch, router, showToast);
    }
    
    setSubmittingQuery(false);
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
        <div className="flex items-center gap-3 mb-1">
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-800 transition-colors"
            aria-label="Go back"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="text-lg" />
          </button>
          <h1 className="font-semibold text-lg md:text-xl">{request?.service?.title || request?.serviceName || "Request Details"}</h1>
        </div>
        <p className="text-sm md:text-base text-gray-600 ml-8">{request?.serviceId || request?._id || ""}</p>
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
          {request?.note && (
            <div className="md:col-span-2">
              <DetailsBox label="Notes">{request.note}</DetailsBox>
            </div>
          )}
        </div>
      </div>

      {/* Pending Status Message */}
      {(request?.status === "pending" || request?.status === "Pending") && (
        <div className="mb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-md p-6">
            <p className="text-sm text-blue-800">
              Your request has been sent to the Azmarineberg team. They will get back to you shortly.
            </p>
          </div>
        </div>
      )}

      {/* Request Document Section */}
      {((request?.status === "processing" || request?.status === "Processing") || 
        (request?.status === "completed" || request?.status === "Completed")) && (
        <div>
          <h2 className="font-semibold text-base mb-4">Request Document</h2>
          <div className="bg-white border border-gray-300 rounded-md p-6">
            {(request?.status === "processing" || request?.status === "Processing") && (
              <div>
                <p className="text-sm text-gray-700 mb-4">The document is being worked on and will be ready soon.</p>
                <button
                  onClick={() => setShowQueryModal(true)}
                  className="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 hover:border-gray-400 transition-colors"
                >
                  Send Query
                </button>
              </div>
            )}
            
            {(request?.status === "completed" || request?.status === "Completed") && (
              <div>
                <p className="text-sm text-gray-700 mb-4">Your request has been completed. Download the document here.</p>
                {request.fileUrl ? (
                  <a
                    href={request.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-white text-sm font-medium hover:bg-green-800 transition-colors"
                  >
                    <FontAwesomeIcon icon={faDownload} />
                    <span>Download</span>
                  </a>
                ) : (
                  <p className="text-sm text-gray-500">Document will be available soon.</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

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
                <button
                  disabled={submittingQuery}
                  className="font-semibold w-full md:w-auto px-6 h-12 rounded-lg bg-primary text-white hover:bg-green-800 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  type="submit"
                >
                  {submittingQuery ? "Sending..." : "Send Query"}
                </button>
              </Form>
            </Formik>
          </ModalBody>
        </Modal>
      )}
    </div>
  );
}

