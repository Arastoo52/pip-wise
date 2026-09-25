import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import {
  loginUser,
  registerUser,
  verifyOtpCode,
  resendOtpCode,
  logoutUser,
  openAuthModal,
  closeAuthModal,
  switchAuthMode,
  completeOtpLogin,
  clearAuthError,
  checkAuth,
} from "../state/auth.slice.js";

export const useAuth = () => {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  const login = useCallback(async (credentials) => await dispatch(loginUser(credentials)), [dispatch]);
  const register = useCallback(async (credentials) => await dispatch(registerUser(credentials)), [dispatch]);
  const verifyOtp = useCallback(async (payload) => await dispatch(verifyOtpCode(payload)), [dispatch]);
  const finalizeOtpLogin = useCallback((userPayload) => dispatch(completeOtpLogin(userPayload)), [dispatch]);
  const resendOtp = useCallback(async (payload) => await dispatch(resendOtpCode(payload)), [dispatch]);
  const logout = useCallback(async () => await dispatch(logoutUser()), [dispatch]);
  const verifySession = useCallback(async () => await dispatch(checkAuth()), [dispatch]);
  const openLogin = useCallback(() => dispatch(openAuthModal("login")), [dispatch]);
  const openRegister = useCallback(() => dispatch(openAuthModal("register")), [dispatch]);
  const closeModal = useCallback(() => dispatch(closeAuthModal()), [dispatch]);
  const switchMode = useCallback((mode) => dispatch(switchAuthMode(mode)), [dispatch]);
  const clearError = useCallback(() => dispatch(clearAuthError()), [dispatch]);

  return {
    ...authState,
    login,
    register,
    verifyOtp,
    finalizeOtpLogin,
    resendOtp,
    logout,
    verifySession,
    openLogin,
    openRegister,
    closeModal,
    switchMode,
    clearError,
  };
};

export default useAuth;
