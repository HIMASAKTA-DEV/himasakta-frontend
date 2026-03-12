import axios from "axios";

const getVisitorId = () => {
  const STORAGE_KEY = "v_uuid";
  let visitorId = localStorage.getItem(STORAGE_KEY);

  if (!visitorId) {
    if (window.crypto && crypto.randomUUID) {
      visitorId = crypto.randomUUID();
    } else {
      visitorId = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
          const r = (Math.random() * 16) | 0,
            v = c === "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        },
      );
    }
    localStorage.setItem(STORAGE_KEY, visitorId);
  }
  return visitorId;
};

export const trackVisit = async () => {
  try {
    const visitorId = getVisitorId();

    await axios.post(
      "https://himasakta-backend.vercel.app/api/v1/analytics/visit",
      {},
      {
        headers: {
          "X-Visitor-Id": visitorId,
        },
      },
    );
  } catch (err) {
    console.warn("Analytics ping err:", err);
  }
};
