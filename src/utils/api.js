import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

const token = localStorage.getItem("TeamWork-user-token");

if (token) {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}
