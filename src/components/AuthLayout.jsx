import React from "react";

export default function AuthLayout({ children }) {
  return (
    <div className="">
      <div className="grid grid-cols-2">
        {/* image */}
        <div className="bg-green-600 min-h-screen max-h-[600px] flex items-end px-5 pb-20">
          <div className="text-white">
            <h1 className="font-semibold mb-3 text-2xl">
              Azmarineberg Limited
            </h1>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa
              dolorum autem sint, impedit assumenda quis quasi tempora harum
              unde ducimus?
            </p>
          </div>
        </div>
        {/* form */}
        <div className="h-screen min-h-[600px] overflow-scroll bg-blue-50 flex items-center justify-center wrap">
          <div className="max-w-[450px] w-full">{children}</div>
        </div>
      </div>
    </div>
  );
}
