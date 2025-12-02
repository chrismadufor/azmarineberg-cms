"use client";

import Button from "@/components/Button";
import { faBuilding, faUserShield, faDatabase, faListCheck, faCheck, faClock, faArrowRight, faCheckCircle, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { fetchAdminAnalytics, fetchAllServices, fetchAllUsers, fetchAllRequests } from "@/services/adminService";
import { useDispatch } from "react-redux";
import { showToast } from "@/redux/slices/ToastSlice";
import { saveServices, saveUsers, saveRequests, saveAnalytics } from "@/redux/slices/adminSlice";
import { handleAPIError, getRequestStatusColor, formatRequestStatus } from "@/utils/utils";
import { useRouter } from "next/navigation";
import moment from "moment";

export default function AdminHome() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [requestsData, setRequestsData] = useState([]);
  const [servicesData, setServicesData] = useState([]);
  const [servicesCount, setServicesCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    
    // Fetch all data in parallel
    const [analyticsResponse, servicesResponse, usersResponse, requestsResponse] = await Promise.all([
      fetchAdminAnalytics(),
      fetchAllServices(),
      fetchAllUsers(),
      fetchAllRequests(),
    ]);

    // Handle analytics
    if (!analyticsResponse.error) {
      const data = analyticsResponse.data?.data.data;
      setAnalytics(data);
      dispatch(saveAnalytics(data));
    } else {
      setAnalytics(null);
      setRequestsData([]);
      setServicesData([]);
      handleAPIError(analyticsResponse, dispatch, router, showToast);
    }

    // Handle services
    if (!servicesResponse.error) {
      const servicesData = servicesResponse.data?.data?.data;
      const servicesArray = Array.isArray(servicesData) ? servicesData : [];
      dispatch(saveServices(servicesArray));
      setServicesCount(servicesArray.length);
      setServicesData(servicesData.slice(0, 5));
    } else {
      console.error("Failed to fetch services:", servicesResponse);
      dispatch(saveServices([]));
      setServicesCount(0);
    }

    // Handle users
    if (!usersResponse.error) {
      // console.log("Admin Users API Response:", usersResponse);
      const usersData = usersResponse.data?.data.users;
      const usersArray = Array.isArray(usersData) ? usersData : [];
      dispatch(saveUsers(usersArray));
      setUsersCount(usersArray.length);
    } else {
      console.error("Failed to fetch users:", usersResponse);
      dispatch(saveUsers([]));
      setUsersCount(0);
    }

    // Handle requests
    if (!requestsResponse.error) {
      // console.log("Admin Requests API Response:", requestsResponse);
      const requestsData = requestsResponse.data?.data?.data.requests;
      dispatch(saveRequests(Array.isArray(requestsData) ? requestsData : []));
      setRequestsData(requestsData.slice(0, 5));
    } else {
      console.error("Failed to fetch requests:", requestsResponse);
      dispatch(saveRequests([]));
    }

    setLoading(false);
  };

  const cardData = [
    {
      title: "Total Companies",
      icon: faBuilding,
      value: analytics?.totalCompanies || usersCount || "0",
    },
    // {
    //   title: "Total Admins",
    //   icon: faUserShield,
    //   value: analytics?.totalAdmins || "0",
    // },
    {
      title: "Total Services",
      icon: faDatabase,
      value: analytics?.totalServices || servicesCount || "0",
    },
    {
      title: "Total Requests",
      icon: faListCheck,
      value: analytics?.totalRequest || "0",
    },
    {
      title: "Completed Requests",
      icon: faCheckCircle,
      value: analytics?.totalCompletedRequest || "0",
    },
    {
      title: "Pending Requests",
      icon: faClock,
      value: analytics?.totalPendingRequest || "0",
    },
    {
      title: "Processing Requests",
      icon: faSpinner,
      value: analytics?.totalProcessingRequest || "0",
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="mt-3 mb-6">
          <h1 className="font-semibold text-xl">Welcome Admin!</h1>
          <p>What will you do today?</p>
        </div>
        {/* Hidden per request */}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {cardData.map((item, index) => (
          <div
            key={index}
            className="bg-white border border-gray-300 rounded-md px-4 py-5 min-h-[120px]"
          >
            <p className="text-sm font-medium mb-4">{item.title}</p>
            <div className="flex items-center justify-between">
              <p className="font-semibold text-xl">{item.value}</p>
              <div className="flex-shrink-0">
                <FontAwesomeIcon icon={item.icon} className="text-primary text-2xl" style={{ width: '1.5rem', height: '1.5rem', display: 'block' }} />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 mb-6 grid grid-cols-1 md:grid-cols-5 gap-5">
        <div className="col-span-1 lg:col-span-3">
          <div className="mb-2 flex items-center justify-between pr-2 md:pr-4">
            <h1 className="text-sm font-semibold">Recent Requests</h1>
            <Link href="/admin/requests" className="text-sm font-medium text-primary flex items-center gap-1">
              <span>View all</span>
              <FontAwesomeIcon icon={faArrowRight} />
            </Link>
          </div>
          <div className="bg-white border border-gray-300 rounded-md overflow-hidden">
            <table className="w-full text-sm text-gray-700">
              <thead className="bg-gray-200">
                <tr className="h-12">
                  <th className="text-left px-4">Company</th>
                  <th className="text-left px-4">Title</th>
                  <th className="text-left px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="3" className="px-4 py-4 text-center text-sm text-gray-500">Loading...</td>
                  </tr>
                ) : requestsData.length > 0 ? (
                  requestsData.map((item, index) => (
                    <tr key={item._id || index} className="border-t h-12">
                      <td className="px-4 capitalize">{item.user?.fullName}</td>
                      <td className="px-4">{item.service?.title}</td>
                      <td className="px-4">
                        <span className={`text-xs py-1 px-2 rounded-md ${getRequestStatusColor(item.status).bg} ${getRequestStatusColor(item.status).text}`}>
                          {formatRequestStatus(item.status)}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-4 py-4 text-center text-sm text-gray-500">No data found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="col-span-1 lg:col-span-2">
          <div className="mb-2 flex items-center justify-between pr-2 md:pr-4">
            <h1 className="text-sm font-semibold">Top Services</h1>
            <Link href="/admin/services" className="text-sm font-medium text-primary flex items-center gap-1">
              <span>View all</span>
              <FontAwesomeIcon icon={faArrowRight} />
            </Link>
          </div>
          <div className="bg-white border border-gray-300 rounded-md overflow-hidden">
            <table className="w-full text-sm text-gray-700">
              <thead className="bg-gray-200">
                <tr className="h-12">
                  <th className="text-left px-4">Service</th>
                  <th className="text-left px-4">Requests</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="2" className="px-4 py-4 text-center text-sm text-gray-500">Loading...</td>
                  </tr>
                ) : servicesData.length > 0 ? (
                  servicesData.map((item, index) => (
                    <tr key={item._id || item.serviceId || index} className="border-t h-12">
                      <td className="px-4">{item.serviceName || item.name || item.title || "N/A"}</td>
                      <td className="px-4">{item.requestCount || item.requests || item.count || 0}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" className="px-4 py-4 text-center text-sm text-gray-500">No data found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
