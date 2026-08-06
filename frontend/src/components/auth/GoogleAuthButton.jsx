"use client";

import { GoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";

import { googleLogin } from "@/services/auth.service";

export default function GoogleAuthButton({
  successMessage = "Logged in successfully",
  errorMessage = "Google login failed",
}) {
  const handleGoogleLogin = async (credentialResponse) => {
    try {
      await googleLogin(credentialResponse.credential);

      toast.success(successMessage);

      window.location.assign("/");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || errorMessage
      );
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleGoogleLogin}
      onError={() => toast.error(errorMessage)}
      theme="outline"
      size="large"
      shape="pill"
      width="350"
    />
  );
}