"use client";

import Table from "@/components/Table";
import EmptyTable from "@/components/EmptyTable";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import moment from "moment";
import DetailsBox from "@/components/DetailsBox";
import { fetchUserById, fetchUserRequests } from "@/services/adminService";
import { useDispatch } from "react-redux";
import { showToast } from "@/redux/slices/ToastSlice";
import { handleAPIError } from "@/utils/utils";

export default function UserDetailsPage() {
  const params = useParams();
  const { id } = params || {};
  const router = useRouter();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("details");
  const [user, setUser] = useState(null);
  const [requests, setRequests] = useState([]);
  const [paginationData, setPaginationData] = useState({ total: 0, current_page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [requestsLoading, setRequestsLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    getUserDetails(id);
    getUserRequests(id);
  }, [id]);

  const getUserDetails = async (userId) => {
    setLoading(true);
    const response = await fetchUserById(userId);
    // console.log("Admin User Details API Response:", response);

    if (!response.error) {
      const data = response.data?.data || response.data || {};
      // console.log("Admin User Details Payload:", data);

      const userData = data?.user || data;
      setUser(userData);
    } else {
      setUser(null);
      setRequests([]);
      setPaginationData({ total: 0, current_page: 1, pages: 1 });
      handleAPIError(response, dispatch, router, showToast);
    }

    setLoading(false);
  };

  const getUserRequests = async (userId) => {
    setRequestsLoading(true);
    const response = await fetchUserRequests(userId);
    // console.log("Admin User Requests API Response:", response);

    if (!response.error) {
      const payload = response.data?.data || response.data || {};
      const rawRequests =
        payload?.requests ||
        payload?.data?.requests ||
        payload?.data ||
        payload?.requestsData ||
        payload;
      const normalizedRequests = Array.isArray(rawRequests) ? rawRequests : [];
      const paginationPayload =
        payload?.pagination ||
        payload?.data?.pagination ||
        payload?.meta ||
        {};

      setRequests(normalizedRequests);
      setPaginationData({
        total:
          paginationPayload.total ??
          paginationPayload.requestCount ??
          normalizedRequests.length,
        current_page:
          paginationPayload.current_page ??
          paginationPayload.page ??
          1,
        pages:
          paginationPayload.pages ??
          paginationPayload.total_pages ??
          1,
      });
    } else {
      setRequests([]);
      setPaginationData({ total: 0, current_page: 1, pages: 1 });
      handleAPIError(response, dispatch, router, showToast);
    }

    setRequestsLoading(false);
  };

  const columns = ["Service Name", "Date", "Status"];

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase() || "";
    if (statusLower === "completed") {
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

  if (loading && !user) {
    return (
      <div className="py-5">
        <div className="pb-3 border-b border-gray-200 mb-5">
          <h1 className="font-semibold text-2xl md:text-3xl mb-1">Loading...</h1>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="py-5">
        <div className="pb-3 border-b border-gray-200 mb-5">
          <h1 className="font-semibold text-2xl md:text-3xl mb-1">User Not Found</h1>
          <p className="text-sm md:text-base text-gray-600">The user you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-5">
      <div className="pb-3 border-b border-gray-200 mb-5">
        <div className="flex items-center gap-4 mb-4">
          {/* {user?.photo ? (
            <img src={user.photo} alt={user.fullName || user.name} className="w-20 h-20 rounded-full object-cover" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold uppercase">
              {(user?.fullName || user?.name)?.split(" ").map((n) => n[0]).join("").slice(0, 2) || "—"}
            </div>
          )} */}
          <div>
            <h1 className="font-semibold text-2xl md:text-3xl mb-1 capitalize">{user?.fullName || user?.name || "User"}</h1>
            <p className="text-sm md:text-base text-gray-600">{user?.email || ""}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-4 mb-5">
        <button className={`px-4 py-2 rounded-md border text-sm ${activeTab === "details" ? "bg-primary text-white" : "bg-white"}`} onClick={() => setActiveTab("details")}>Details</button>
        <button className={`px-4 py-2 rounded-md border text-sm ${activeTab === "requests" ? "bg-primary text-white" : "bg-white"}`} onClick={() => setActiveTab("requests")}>
          Requests {requests.length > 0 && `(${requests.length})`}
        </button>
      </div>

      {activeTab === "details" && user && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <DetailsBox label="User ID">{user?.azmarineUserId || user?._id || "—"}</DetailsBox>
          <DetailsBox label="Status">
            <span className={`text-xs py-1 px-2 rounded-md ${
              user?.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
            }`}>
              {user?.status ? user.status.charAt(0).toUpperCase() + user.status.slice(1) : "—"}
            </span>
          </DetailsBox>
          <DetailsBox label="Full Name"><span className="capitalize">{user?.fullName || user?.name || "—"}</span></DetailsBox>
          <DetailsBox label="Email">
            <div className="flex items-center gap-2">
              <span>{user?.email || "—"}</span>
              {user?.emailVerified !== undefined && (
                <span className={`text-xs py-1 px-2 rounded-md ${
                  user.emailVerified ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                }`}>
                  {user.emailVerified ? "Verified" : "Unverified"}
                </span>
              )}
            </div>
          </DetailsBox>
          <DetailsBox label="Phone Number">{user?.phoneNumber || user?.phone || "—"}</DetailsBox>
          <DetailsBox label="Creator">{user?.creator || "—"}</DetailsBox>
          {user?.businessAddress && (
            <>
              <div className="md:col-span-2">
                <p className="text-xs text-gray-500 font-semibold mb-2">Business Address</p>
              </div>
              <DetailsBox label="Address">{user.businessAddress.address || "—"}</DetailsBox>
              <DetailsBox label="State">{user.businessAddress.state || "—"}</DetailsBox>
            </>
          )}
          <DetailsBox label="Registered At">{user?.createdAt ? moment(user.createdAt).format("MMMM D, YYYY") : "—"}</DetailsBox>
          <DetailsBox label="Last Updated">{user?.updatedAt ? moment(user.updatedAt).format("MMMM D, YYYY") : "—"}</DetailsBox>
        </div>
      )}

      {activeTab === "requests" && (
        <div className="mt-3">
          {requestsLoading ? (
            <div className="text-center py-8">
              <p className="text-sm text-gray-500">Loading requests...</p>
            </div>
          ) : requests.length > 0 ? (
            <Table data={paginationData} columns={columns} changePage={() => {}}>
              {requests.map((item, index) => (
                <tr key={item._id || index} className="border-b h-14 cursor-pointer hover:bg-gray-50" onClick={() => router.push(`/admin/requests/${item._id}`)}>
                  <td className="pl-5 w-12 text-center">{index + 1}</td>
                  <td className="px-5">{item?.service?.title || item?.serviceName || item?.service?.name || "—"}</td>
                  <td className="px-5">{item?.createdAt ? moment(item.createdAt).format("MMMM D, YYYY") : item?.date ? moment(item.date).format("MMMM D, YYYY") : "—"}</td>
                  <td className="px-5">
                    <span className={`text-xs py-1 px-2 rounded-md ${getStatusColor(item?.status)}`}>
                      {formatStatus(item?.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </Table>
          ) : (
            <EmptyTable loading={false} columns={columns} />
          )}
        </div>
      )}
    </div>
  );
}