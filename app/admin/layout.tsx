import { AdminNavbar } from "./_components/admin-navbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminNavbar />
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
        <div className="container mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}