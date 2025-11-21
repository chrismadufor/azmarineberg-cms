import DashboardLayout from "@/components/DashboardLayout";

export default function DashboardHomeLayout({ children }) {
    return (
      <DashboardLayout role={"admin"}>
        {children}
      </DashboardLayout>
    );
  }