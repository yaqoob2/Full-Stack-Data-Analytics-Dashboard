import axios from "axios";

const API_BASE = "http://127.0.0.1:8000";

// Create axios instance (in case we need headers later)
const api = axios.create({
  baseURL: API_BASE,
});

// ✅ Overview
export const getOverview = () => api.get("/analytics/overview");

// ✅ Jobs per Category
export const getJobsByCategory = () => api.get("/analytics/jobs/by_category");

// ✅ Jobs per Day
export const getJobsPerDay = () => api.get("/analytics/jobs-per-day");

// ✅ Jobs by User
export const getJobsByUser = () => api.get("/analytics/jobs-by-user");

// (Optional) Users list
export const getUsers = () => api.get("/users/");

// (Optional) Jobs list
export const getJobs = () => api.get("/jobs/");

// ✅ Active Users by Role
export const getActiveUsers = () => api.get("/analytics/active-users");

// ✅ Disputes
export const getDisputes = () => api.get("/disputes/");
export const getDisputesAnalytics = () => api.get("/analytics/disputes");
