import AdminSidebar
from "../components/AdminSidebar";

export default function AdminLayout({
  children
}) {

  return (

    <div className="
      flex
      min-h-screen
      bg-[#020617]
    ">

      {/* SIDEBAR */}
      <AdminSidebar />

      {/* CONTENT */}
      <main className="
        flex-1
        overflow-y-auto
        p-6
      ">

        {children}

      </main>

    </div>
  )
}