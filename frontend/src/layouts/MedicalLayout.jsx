import MedicalSidebar from "../components/MedicalSidebar";

export default function MedicalLayout({ children }) {
  return (
    
    <div className="flex bg-[#0f172a] min-h-screen text-white overflow-x-hidden">
      
      
      <MedicalSidebar />

      <div className="
        flex-1 
        p-4 
        sm:p-6 
        pt-20 
        md:pt-6 
        bg-[#0f172a] 
        min-h-screen 
        h-screen 
        overflow-y-auto
      ">
        {children}
      </div>

    </div>
  );
}