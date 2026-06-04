import Sidebar from "../components/Sidebar";
import ReminderChecker from "../components/ReminderChecker";

import { useEffect, useState } from "react";

import {
  FaBars,
  FaTimes
} from "react-icons/fa";

import {
  getReminders
} from "../services/reminderService";

export default function MainLayout({
  children
}) {

  const [reminders, setReminders] =
    useState([]);

  const [
    mobileSidebarOpen,
    setMobileSidebarOpen
  ] = useState(false);

  useEffect(() => {

    loadReminders();

    const interval =
      setInterval(() => {

        loadReminders();

      }, 60000);

    return () =>
      clearInterval(interval);

  }, []);

  const loadReminders =
    async () => {

      try {

        const data =
          await getReminders();

        setReminders(data);

      } catch (error) {

        console.log(error);

      }
    };

  return (

    <div
      className="
        min-h-screen
        bg-gray-100
        dark:bg-gray-900
        dark:text-white
        transition-colors
        duration-300
      "
    >

      {/* REMINDER GLOBAL */}
      <ReminderChecker
        reminders={reminders}
      />

      {/* HAMBURGER MOBILE */}
      <button
        onClick={() =>
          setMobileSidebarOpen(true)
        }
        className="
          md:hidden
          fixed
          top-4
          left-4
          z-50
          bg-blue-600
          text-white
          p-3
          rounded-xl
          shadow-lg
        "
      >

        <FaBars />

      </button>

      {/* OVERLAY */}
      {mobileSidebarOpen && (

        <div
          className="
            md:hidden
            fixed
            inset-0
            bg-black/50
            z-40
          "
          onClick={() =>
            setMobileSidebarOpen(false)
          }
        />

      )}

      {/* SIDEBAR MOBILE */}
      <div
        className={`
          md:hidden
          fixed
          top-0
          left-0
          h-full
          z-50
          transition-transform
          duration-300
          ${
            mobileSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >

        <div className="relative">

          {/* CLOSE BUTTON */}
          <button
            onClick={() =>
              setMobileSidebarOpen(false)
            }
            className="
              absolute
              top-4
              right-4
              z-50
              bg-red-500
              text-white
              p-2
              rounded-lg
            "
          >

            <FaTimes />

          </button>

          <Sidebar />

        </div>

      </div>

      <div className="flex">

        {/* SIDEBAR DESKTOP */}
        <div className="hidden md:block">

          <Sidebar />

        </div>

        {/* CONTENT */}
        <div
          className="
            flex-1
          "
        >

          {children}

        </div>

      </div>

    </div>
  );
}