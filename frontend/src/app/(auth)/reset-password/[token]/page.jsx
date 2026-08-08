import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export default async function ResetPasswordPage({ params }) {
  const { token } = await params;

  return <ResetPasswordForm token={token} />;
}