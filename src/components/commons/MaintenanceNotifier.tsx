"use client";

import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { getWebSettings } from "@/services/landing_page/WebSettings";

/**
 * MaintenanceNotifier handles alerting visitors once when the site is in maintenance mode.
 * It resets the 'alerted' state when the site is back to normal.
 */
export default function MaintenanceNotifier() {
  useEffect(() => {
    const checkMaintenance = async () => {
      try {
        const settings = await getWebSettings();
        const storageKey = "maintenance_warned_once";

        if (settings.InMaintenance) {
          const hasSeen = localStorage.getItem(storageKey);
          if (!hasSeen) {
            toast.error(
              "Website sedang dalam mode pemeliharaan. Beberapa fitur mungkin tidak tersedia.",
              {
                duration: 6000,
                position: "top-center",
              },
            );
            localStorage.setItem(storageKey, "true");
          }
        } else {
          // Reset the state when NOT in maintenance anymore
          localStorage.removeItem(storageKey);
        }
      } catch (err) {
        // Silently fail to not disturb the user if API is down
        console.error("Maintenance check failed:", err);
      }
    };

    checkMaintenance();
  }, []);

  return null;
}
