import AdminGuardClient from "./AdminGuardClient";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminGuardClient>{children}</AdminGuardClient>;
}
