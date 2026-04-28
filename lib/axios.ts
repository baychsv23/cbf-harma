import axios from "axios";

declare module "axios" {
  export interface AxiosRequestConfig {
    isSilent?: boolean;
  }
}
export const api = axios.create({
  baseURL: "/api",
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  // สำหรับ client-side, สามารถดึง locale จาก pathname
  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "";
  const locale = pathname.split("/")[1] || "lo";

  config.headers["X-Locale"] = locale;

  return config;
});

api.interceptors.response.use(
  (response) => {
    // Check for the custom isSilent flag
    const isSilent = response.config.isSilent;

    const isMutation = ["post", "put", "patch", "delete"].includes(
      response.config.method || "",
    );

    // Only dispatch if it's a mutation, has a message, AND is not silent
    if (!isSilent && isMutation && response.data?.message) {
      window.dispatchEvent(
        new CustomEvent("api-success", { detail: response.data.message }),
      );
    }
    return response;
  },
  (error) => {
    // error.config might be undefined if the request failed to even send (e.g., network error)
    const isSilent = error.config?.isSilent;
    const message = error.response?.data?.error || error.message;

    // Only dispatch the error event if it's not silent
    if (!isSilent) {
      window.dispatchEvent(new CustomEvent("api-error", { detail: message }));
    }
    return Promise.reject(error);
  },
);
