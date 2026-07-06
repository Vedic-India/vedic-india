"use client";

import { useForm } from "react-hook-form";

export default function NewsletterForm() {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-10 flex flex-col gap-4 sm:flex-row"
    >
      <input
        {...register("email")}
        type="email"
        placeholder="Enter your email"
        className="h-14 flex-1 rounded-full border border-white/30 bg-white/70 px-6 backdrop-blur-xl outline-none"
      />

      <button
        type="submit"
        className="h-14 rounded-full bg-[var(--color-primary)] px-8 font-semibold text-white transition hover:bg-[var(--color-secondary)]"
      >
        Subscribe
      </button>
    </form>
  );
}