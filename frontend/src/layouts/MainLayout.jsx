import Sidebar from "../components/Sidebar";
import ReminderChecker from "../components/ReminderChecker";

import { useEffect, useState } from "react";

import {
  getReminders
} from "../services/reminderService";

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
      "
    >

      <ReminderChecker
        reminders={reminders}
      />

      <div className="flex flex-col md:flex-row">

        {/* SIDEBAR COMPONENT (Menangani tampilan Desktop sekaligus Mobile + Auto Hide Scroll) */}
        <Sidebar />

        {/* CONTENT */}
        <main
          className="
            flex-1
            min-h-screen
            pt-16
            md:pt-0
          "
        >

          {children}

        </main>

      </div>

    </div>
  );
}