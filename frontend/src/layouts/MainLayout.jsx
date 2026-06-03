import Sidebar from "../components/Sidebar";
import MobileNav from "../components/MobileNav";
import ReminderChecker from "../components/ReminderChecker";

import { useEffect, useState } from "react";
import { getReminders } from "../services/reminderService";

export default function MainLayout({
  children
}) {

  const [reminders, setReminders] =
    useState([]);

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

      <div className="flex">

        {/* Sidebar Desktop */}
        <div className="hidden md:block">

          <Sidebar />

        </div>

        {/* Content */}
        <div
          className="
            flex-1
            pb-20
            md:pb-0
          "
        >

          {children}

        </div>

      </div>

      {/* Bottom Navigation Mobile */}
      <div className="md:hidden">

        <MobileNav />

      </div>

    </div>
  )
}