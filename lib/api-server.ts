// lib/api-server.ts
import axios from "axios";

const apiServer = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor สำหรับ Server Side (เน้น Logging)
apiServer.interceptors.response.use(
  (response) => response,
  (error) => {
    // บน server เราจะไม่ใช้ Alert แต่จะ Log ลง Terminal แทน
    console.error("🔴 Server API Error:", {
      url: error.config?.url,
      status: error.response?.status,
      message: error.response?.data?.error || error.message,
    });
    return Promise.reject(error);
  },
);

export default apiServer;
