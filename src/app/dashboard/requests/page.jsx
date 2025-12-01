"use client";

import SearchBox from "@/components/SearchBox";
import Table from "@/components/Table";
import EmptyTable from "@/components/EmptyTable";
import RequestForm from "@/components/RequestForm";
import { useEffect, useState } from "react";
import moment from "moment";
import { useRouter } from "next/navigation";
import { getSerialNumber } from "@/utils/utils";
import { fetchRequests } from "@/services/dashboardService";
import { useDispatch } from "react-redux";
import { showToast } from "@/redux/slices/ToastSlice";
import { handleAPIError, getRequestStatusColor, formatRequestStatus } from "@/utils/utils";

export default function RequestsHome() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paginationData, setPaginationData] = useState({ total: 0, current_page: 1, pages: 1 });

  const initialFilters = { pageNumber: 1, searchByService: "", searchByServiceId: "", searchByStatus: "" };
  const [filters, setFilters] = useState(initialFilters);

  const columns = ["Service Name", "Date", "Status"];
  const mobileColumns = ["Service Name", "Status"];

  const filterData = [
    { name: "Service", value: "searchByService" },
    { name: "Status", value: "searchByStatus", data: [
      { label: "Pending", value: "Pending" },
      { label: "Accepted", value: "Accepted" },
      { label: "Completed", value: "Completed" },
    ]},
  ];

  const getRequests = async (f) => {
    setLoading(true);
    const response = await fetchRequests(f);
    console.log("Dashboard Requests API Response:", response);

    if (!response.error) {
      const data = response.data?.data;
      console.log("Dashboard Requests Payload:", data);

      setPaginationData({ total: data.requestCount, current_page: data.page, pages: data.pages });
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
      <div className="pb-3 border-b border-gray-200 mb-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-semibold text-lg md:text-xl mb-1">My Requests</h1>
            <p className="text-sm md:text-base max-w-xl">View and track all your service requests. Click a row to view details.</p>
          </div>
          <div>
            <RequestForm />
          </div>
        </div>
      </div>

      <SearchBox setFilter={onSetFilter} reset={onReset} filters={filterData} />

      <div className="flex gap-5 min-h-[500px] py-5">
        <div className="hidden md:block w-full">
          {requests.length > 0 ? (
            <Table data={paginationData} columns={columns} changePage={changePage}>
              {requests.map((item, index) => (
                <tr key={item._id} className="border-b h-14 cursor-pointer hover:bg-gray-50" onClick={() => router.push(`/dashboard/requests/${item._id}`)}>
                  <td className="pl-5 w-12 text-center">{getSerialNumber(index, paginationData.current_page)}</td>
                  <td className="px-5">{item.service?.title || item.serviceName || item.title || "—"}</td>
                  <td className="px-5">{item.createdAt ? moment(item.createdAt).format("MMMM D, YYYY") : item.date ? moment(item.date).format("MMMM D, YYYY") : "—"}</td>
                  <td className="px-5">
                    <span className={`text-xs py-1 px-2 rounded-md ${getRequestStatusColor(item.status).bg} ${getRequestStatusColor(item.status).text}`}>
                      {formatRequestStatus(item.status)}
                    </span>
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
                <tr key={item._id} className="border-b h-14 cursor-pointer hover:bg-gray-50" onClick={() => router.push(`/dashboard/requests/${item._id}`)}>
                  <td className="pl-2 w-12 text-center">{getSerialNumber(index, paginationData.current_page)}</td>
                  <td className="px-2">{item.service?.title || item.serviceName || item.title || "—"}</td>
                  <td className="px-2">
                    <span className={`text-[10px] py-1 px-2 rounded-md ${getRequestStatusColor(item.status).bg} ${getRequestStatusColor(item.status).text}`}>
                      {formatRequestStatus(item.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </Table>
          ) : (
            <EmptyTable loading={loading} columns={columns} mobileColumns={mobileColumns} />
          )}
        </div>
      </div>
    </div>
  );
}
