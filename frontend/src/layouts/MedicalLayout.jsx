import MedicalSidebar
from "../components/MedicalSidebar";

export default function MedicalLayout({
  children
}) {

  return (

    <div className="flex">

      <MedicalSidebar />

      <div className="
        flex-1
        p-6
        bg-gray-100
        min-h-screen
      ">

        {children}

      </div>

    </div>
  )
}