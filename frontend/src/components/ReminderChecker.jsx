import {
  useEffect
} from "react";

import {
  toast
} from "react-toastify";

import {
  updateReminder
} from "../services/reminderService";

export default function ReminderChecker({
  reminders
}) {

  useEffect(() => {

    // Minta izin browser notification
    if (
      "Notification" in window &&
      Notification.permission !==
        "granted"
    ) {

      Notification.requestPermission();
    }

    const interval =
      setInterval(async () => {

        const now =
          new Date();

        const currentTime =
          now.toLocaleTimeString(
            [],
            {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false
            }
          );

        for (const reminder of reminders) {

          if (
            reminder.is_active &&
            reminder.reminder_time &&
            reminder.reminder_time
              .slice(0, 5) ===
              currentTime
          ) {

            // Toast Notification
            toast.success(
              reminder.message
            );

            // Browser Notification
            if (
              "Notification" in
                window &&
              Notification.permission ===
                "granted"
            ) {

              new Notification(
                "Health Reminder",
                {
                  body:
                    reminder.message,
                  icon:
                    "/logo.png"
                }
              );
            }

            // Sound Notification
            try {

              const audio =
                new Audio(
                  "/notification.mp3"
                );

              audio.play();

            } catch (err) {

              console.log(
                "Audio Error:",
                err
              );
            }

            // Auto OFF setelah berbunyi
            try {

              await updateReminder(
                reminder.id,
                {
                  is_active: false
                }
              );

            } catch (err) {

              console.log(
                "Update Error:",
                err
              );
            }
          }
        }

      }, 10000);

    return () =>
      clearInterval(interval);

  }, [reminders]);

  return null;
}