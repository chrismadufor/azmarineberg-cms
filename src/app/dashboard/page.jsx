import Button from "@/components/Button";
import { faList } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export default function DashboardHome() {
  const cardData = [
    {
      title: "Total Requests",
      icon: faList,
      value: "17",
    },
    {
      title: "Completed Requests",
      icon: faList,
      value: "5",
    },
    {
      title: "Pending Requests",
      icon: faList,
      value: "2",
    },
    {
      title: "Approved Requests",
      icon: faList,
      value: "10",
    },
  ];

  const requestsData = [
    {
      title: "Laboratory Analysis",
      date: "21st August, 2025",
      status: "Pending",
    },
    {
      title: "Environmental Air Quality",
      date: "14th August, 2025",
      status: "Completed",
    },
    {
      title: "Pest Control Services",
      date: "3rd August, 2025",
      status: "Accepted",
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="mt-3 mb-6">
          <h1 className="font-semibold text-xl">Welcome Chris!</h1>
          <p>What will you do today?</p>
        </div>
        <div>
          <Button text={"Request Service"} color={"green"} />
        </div>
      </div>
      <div className="grid grid-cols-4 gap-5">
        {cardData.map((item, index) => (
          <div
            key={index}
            className="bg-white border border-gray-300 rounded-md px-4 py-5"
          >
            <p className="text-sm font-medium mb-4">{item.title}</p>
            <div className="flex items-center justify-between">
              <p className="font-semibold text-xl">{item.value}</p>
              <FontAwesomeIcon icon={item.icon} className="text-primary" />
            </div>
          </div>
        ))}
      </div>
      <div className="my-6">
        <div className="mb-2">
          <h1 className="text-sm font-semibold">Recent Requests</h1>
        </div>
        <div className="grid grid-cols-3 gap-5">
          {requestsData.map((item, index) => (
            <div
              key={index}
              className="bg-white border border-gray-300 rounded-md px-4 py-5"
            >
              <h1 className="font-medium">{item.title}</h1>
              <p className="text-gray-700 text-sm">{item.date}</p>
              <p className="mt-5 text-xs bg-orange-300 text-orange-500 py-2 px-3 rounded-md inline-block">
                {item.status}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="my-6">
        <div className="mb-2">
          <h1 className="text-sm font-semibold">Top Services</h1>
        </div>
        <div className="grid grid-cols-3 gap-5">
          {requestsData.map((item, index) => (
            <div
              key={index}
              className="bg-white border border-gray-300 rounded-md px-4 py-5"
            >
              <h1 className="font-medium">{item.title}</h1>
              <p className="text-gray-700 text-sm">{item.date}</p>
              <p className="mt-5 text-xs bg-orange-300 text-orange-500 py-2 px-3 rounded-md inline-block">
                {item.status}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
