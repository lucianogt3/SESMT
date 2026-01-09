import { apiDataService } from "./apiDataService";
import { mockDataService } from "./mockDataService";

// If VITE_USE_API=true -> use backend; else keep localStorage mock.
export const dataService = (import.meta.env.VITE_USE_API === "true")
  ? apiDataService
  : (mockDataService as any);
