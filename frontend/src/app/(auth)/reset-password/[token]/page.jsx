import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export default function ResetPasswordPage({ params }) {
  return <ResetPasswordForm token={params.token} />;
}