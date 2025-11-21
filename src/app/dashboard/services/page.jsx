"use client";

import React, { useState, useEffect, useMemo } from "react";
import RequestForm from "@/components/RequestForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { fetchServices } from "@/services/dashboardService";
import { useDispatch } from "react-redux";
import { showToast } from "@/redux/slices/ToastSlice";
import { handleAPIError } from "@/utils/utils";
import { useRouter } from "next/navigation";

export default function ServicesHome() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [triggerOpen, setTriggerOpen] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchServicesData();
  }, []);

  const fetchServicesData = async () => {
    const response = await fetchServices();
    console.log("Dashboard Services API Response:", response);

    if (!response.error) {
      const data = response.data?.data || response.data?.services || response.data || [];
      console.log("Dashboard Services Payload:", data);
      setServices(Array.isArray(data) ? data : []);
    } else {
      handleAPIError(response, dispatch, router, showToast);
      setServices([]);
    }
  };

  const filteredServices = useMemo(() => {
    if (!searchQuery.trim()) {
      return services;
    }
    const query = searchQuery.toLowerCase();
    return services.filter(
      (service) =>
        (service.title || service.name || "").toLowerCase().includes(query) ||
        (service.description || "").toLowerCase().includes(query)
    );
  }, [services, searchQuery]);

  const handleRequestService = (service) => {
    setSelectedService(service.title || service.name);
    setTriggerOpen(prev => prev + 1);
  };

  return (
    <div className="py-5">
      <div className="mb-6">
        <h1 className="font-semibold text-xl md:text-2xl mb-2">Our Services</h1>
        <p className="text-sm text-gray-600 mb-4">Choose a service to request assistance</p>
        <div className="relative max-w-md">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <FontAwesomeIcon icon={faSearch} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a service..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div
              key={service._id || service.id}
              className="bg-white border border-gray-300 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <h2 className="font-semibold text-lg mb-3 text-gray-800">{service.title || service.name || service.serviceName || "N/A"}</h2>
              <p className="text-sm text-gray-600 mb-5 leading-relaxed">{service.description || "No description available"}</p>
              <button
                onClick={() => handleRequestService(service)}
                className="w-full px-4 py-2.5 rounded-md border border-gray-300 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 hover:border-gray-400 transition-colors"
              >
                Request Service
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-sm">
            {searchQuery.trim() ? `No services found matching "${searchQuery}"` : "No services available"}
          </p>
        </div>
      )}

      <RequestForm
        preSelectedService={selectedService}
        showButton={false}
        triggerOpen={triggerOpen}
      />
    </div>
  );
}
