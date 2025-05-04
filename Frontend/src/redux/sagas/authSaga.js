import { toast } from "react-toastify";
import { call, put, takeLatest } from "redux-saga/effects";
import axiosInstance from "../axiosInstance";
import {
  loginRequest,
  loginSuccess,
  loginFailure,
  signupRequest,
  signupSuccess,
  signupFailure,
} from "../actions/authSlice";
import { navigateTo } from "../../navigate"; // 👈 import the helper

function* handleLogin(action) {
  try {
    const res = yield call(
      axiosInstance.post,
      "api/auth/login",
      action.payload
    );
    const { token, user } = res.data;
    toast.success("Login successful");
    localStorage.setItem("token", token);
    yield put(loginSuccess({ token, user }));
    navigateTo("/dashboard"); // 👈 redirect after login
  } catch (error) {
    toast.warn(error.response?.data?.message);
    yield put(loginFailure(error.response?.data?.message || "Login failed"));
  }
}

function* handleSignup(action) {
  try {
    const res = yield call(
      axiosInstance.post,
      "api/auth/signup",
      action.payload
    );
    const { user } = res.data;
    toast.success("Signup successful");
    yield put(signupSuccess({ user }));
    navigateTo("/signin"); // 👈 redirect after signup
  } catch (error) {
    toast.warn(error.response?.data?.message);
    yield put(signupFailure(error.response?.data?.message || "Signup failed"));
  }
}
export default function* authSaga() {
  yield takeLatest(loginRequest.type, handleLogin);
  yield takeLatest(signupRequest.type, handleSignup);
}
