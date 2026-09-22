import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { authApi } from "../api/auth";
import { getErrorMessage } from "../api/client";
import { useAuth } from "../hooks/useAuth";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type FormValues = z.infer<typeof schema>;

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from || "/busninessList";
  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { email: "", password: "" } });

  async function onSubmit(values: FormValues) {
    try {
      const response = await authApi.login(values);
      login(response.data.access_token);
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to sign in"));
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-6">
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full rounded-3xl border border-ink-200 bg-white p-8 shadow-card">
        <h1 className="font-serif text-3xl text-ink-900">Welcome back</h1>
        <p className="mt-2 text-sm text-ink-700">Sign in to manage client knowledge bases.</p>
        <label className="mt-6 block text-sm">
          Email
          <input
            type="email"
            {...form.register("email")}
            className="mt-2 w-full rounded-xl border border-ink-200 px-3 py-2 outline-none focus:border-accent-600"
          />
        </label>
        {form.formState.errors.email && <p className="mt-1 text-sm text-rose-700">{form.formState.errors.email.message}</p>}
        <label className="mt-4 block text-sm">
          Password
          <input
            type="password"
            {...form.register("password")}
            className="mt-2 w-full rounded-xl border border-ink-200 px-3 py-2 outline-none focus:border-accent-600"
          />
        </label>
        {form.formState.errors.password && (
          <p className="mt-1 text-sm text-rose-700">{form.formState.errors.password.message}</p>
        )}
        <button
          type="submit"
          className="mt-6 w-full rounded-full bg-accent-600 py-2.5 text-sm font-medium text-white hover:bg-accent-700"
        >
          Sign in
        </button>
        <p className="mt-4 text-sm text-ink-700">
          Need an account?{" "}
          <Link to="/register" className="text-accent-700">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
