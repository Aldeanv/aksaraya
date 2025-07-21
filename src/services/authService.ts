import api from "./api";
import { LoginPayload, RegisterPayload } from "../types";
import { AxiosError } from "axios";

export const login = async (payload: LoginPayload) => {
  try {
    const res = await api.post("/auth/login", payload);
    return res.data;
  } catch (err: unknown) {
    if (isAxiosError(err)) {
      throw new Error(err.response?.data?.message || "Login gagal.");
    }
    throw new Error("Login gagal.");
  }
};

export const register = async (payload: RegisterPayload) => {
  try {
    const res = await api.post("/auth/register", payload);
    return res.data;
  } catch (err: unknown) {
    if (isAxiosError(err)) {
      throw new Error(err.response?.data?.message || "Registrasi gagal.");
    }
    throw new Error("Registrasi gagal.");
  }
};

function isAxiosError(error: unknown): error is AxiosError<{ message?: string }> {
  return (
    typeof error === "object" &&
    error !== null &&
    "isAxiosError" in error
  );
}
