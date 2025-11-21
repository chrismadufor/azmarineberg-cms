"use client";

import Button from "@/components/Button";
import Modal, { ModalBody, ModalHeader, ModalHeaderIcon, ModalHeaderTitle } from "@/components/Modal";
import { SelectInput, TextAreaInput } from "@/components/FormFields";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import React, { useState, useEffect } from "react";
import { createRequest, fetchServices } from "@/services/dashboardService";
import { useDispatch } from "react-redux";
import { showToast } from "@/redux/slices/ToastSlice";
import { handleAPIError } from "@/utils/utils";
import { useRouter } from "next/navigation";

export default function RequestForm({ preSelectedService, showButton = true, triggerOpen, onSuccess }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [servicesOptions, setServicesOptions] = useState([
    { name: "Select service", value: "" },
    { name: "Water Quality Testing", value: "Water Quality Testing" },
    { name: "Laboratory Analysis", value: "Laboratory Analysis" },
    { name: "Pest Control Services", value: "Pest Control Services" },
    { name: "Environmental Air Quality", value: "Environmental Air Quality" },
  ]);

  useEffect(() => {
    fetchServicesData();
  }, []);

  const fetchServicesData = async () => {
    const response = await fetchServices();
    console.log("Fetch Services API Response:", response);
    if (!response.error) {
      const services = response.data?.data || response.data?.services || response.data || [];
      if (Array.isArray(services) && services.length > 0) {
        const options = [
          { name: "Select service", value: "" },
          ...services.map((service) => ({
            name: service.name || service.serviceName || service.title || "Unknown",
            value: service._id || service.id || service.name || service.serviceName || "",
          })),
        ];
        setServicesOptions(options);
      }
    }
  };

  useEffect(() => {
    if (triggerOpen) {
      setShowModal(true);
    }
  }, [triggerOpen]);

  const handleClose = () => {
    setShowModal(false);
    if (triggerOpen !== undefined) {
      // Reset trigger if needed
    }
  };

  return (
    <>
      {showButton && (
        <Button
          text={"Request Service"}
          color={"green"}
          onClick={() => setShowModal(true)}
          icon={<FontAwesomeIcon icon={faPlus} className="mr-2" />}
        />
      )}

      {showModal && (
        <Modal maxW="max-w-xl" closeModal={handleClose}>
          <ModalHeader>
            <ModalHeaderTitle text="Request Service" />
            <ModalHeaderIcon closeModal={handleClose} />
          </ModalHeader>
          <ModalBody>
            <Formik
              initialValues={{ service: preSelectedService || "", notes: "" }}
              enableReinitialize
              validationSchema={Yup.object({
                service: Yup.string().required("Service is required"),
                notes: Yup.string(),
              })}
              onSubmit={async (values) => {
                setLoading(true);
                const payload = {
                  service: values.service,
                  notes: values.notes || "",
                };
                const response = await createRequest(payload);
                console.log("Create Request API Response:", response);
                if (!response.error) {
                  dispatch(showToast({ status: "success", message: "Service request submitted successfully!" }));
                  setShowModal(false);
                  if (onSuccess) onSuccess();
                } else {
                  handleAPIError(response, dispatch, router, showToast);
                }
                setLoading(false);
              }}
            >
              {({ setFieldValue }) => {
                // Set the service field value when preSelectedService is provided
                React.useEffect(() => {
                  if (preSelectedService) {
                    setFieldValue('service', preSelectedService);
                  }
                }, [preSelectedService, setFieldValue]);

                return (
                  <Form>
                    <div className="mb-5">
                      {preSelectedService ? (
                        <div>
                          <label className="text-gray-800 font-semibold text-sm mb-1 block">Service</label>
                          <input
                            type="text"
                            value={preSelectedService}
                            readOnly
                            className="bg-gray-50 text-input block w-full border border-gray-300 h-12 rounded-md px-3 text-gray-700"
                          />
                        </div>
                      ) : (
                        <SelectInput label="Service" name="service" data={servicesOptions} />
                      )}
                    </div>
                    <div className="mb-5">
                      <TextAreaInput label="Notes" name="notes" placeholder="Add any additional notes or requirements" />
                    </div>
                    <button disabled={loading} className="font-semibold w-full md:w-auto px-6 h-12 rounded-lg bg-primary text-white hover:bg-green-800 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed" type="submit">
                      {loading ? "Submitting..." : "Submit Request"}
                    </button>
                  </Form>
                );
              }}
            </Formik>
          </ModalBody>
        </Modal>
      )}
    </>
  );
}

