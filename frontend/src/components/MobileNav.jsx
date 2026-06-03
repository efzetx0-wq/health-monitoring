import {
  Link
} from "react-router-dom";

import {
  FaHome,
  FaRunning,
  FaMoon,
  FaChartBar
} from "react-icons/fa";

export default function MobileNav() {

  return (

    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg flex justify-around p-3">

      <Link
        to="/dashboard"
        className="flex flex-col items-center text-sm"
      >
        <FaHome />
        Home
      </Link>

      <Link
        to="/activities"
        className="flex flex-col items-center text-sm"
      >
        <FaRunning />
        Activity
      </Link>

      <Link
        to="/sleep"
        className="flex flex-col items-center text-sm"
      >
        <FaMoon />
        Sleep
      </Link>

      <Link
        to="/reports"
        className="flex flex-col items-center text-sm"
      >
        <FaChartBar />
        Reports
      </Link>

    </div>
  )
}