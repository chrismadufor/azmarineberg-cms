import React from "react";

export default function AuthLayout({ children }) {
  return (
    <div className="">
      <div className="grid lg:grid-cols-2">
        {/* image */}
        <div className="hidden lg:flex auth-bg min-h-screen max-h-[600px] items-end px-5 pb-20">
          <div className="text-white">
            <h1 className="font-semibold mb-3 text-2xl">
              Azmarineberg Limited
            </h1>
            <p>
              We deliver uncompromising integrity, Azmarineberg Limited strives
              to earn enduring credibility through commitment and loyalty, which
              we believe is essential in building long-term personal and
              business relationships
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
