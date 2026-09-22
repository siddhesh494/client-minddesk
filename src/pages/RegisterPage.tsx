import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { authApi } from "../api/auth";
import { getErrorMessage } from "../api/client";
import { useAuth } from "../hooks/useAuth";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Use at least 8 characters"),
});

type FormValues = z.infer<typeof schema>;

export function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", password: "" },
  });

  async function onSubmit(values: FormValues) {
    try {
      await authApi.register(values);
      const response = await authApi.login({ email: values.email, password: values.password });
      login(response.data.access_token);
      toast.success("Account created");
      navigate("/busninessList");
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to register"));
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-6">
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full rounded-3xl border border-ink-200 bg-white p-8 shadow-card">
        <h1 className="font-serif text-3xl text-ink-900">Create your workspace</h1>
        <p className="mt-2 text-sm text-ink-700">Register as a platform administrator.</p>
        <label className="mt-6 block text-sm">
          Name
          <input {...form.register("name")} className="mt-2 w-full rounded-xl border border-ink-200 px-3 py-2 outline-none focus:border-accent-600" />
        </label>
        {form.formState.errors.name && <p className="mt-1 text-sm text-rose-700">{form.formState.errors.name.message}</p>}
        <label className="mt-4 block text-sm">
          Email
          <input type="email" {...form.register("email")} className="mt-2 w-full rounded-xl border border-ink-200 px-3 py-2 outline-none focus:border-accent-600" />
        </label>
        {form.formState.errors.email && <p className="mt-1 text-sm text-rose-700">{form.formState.errors.email.message}</p>}
        <label className="mt-4 block text-sm">
          Password
          <input type="password" {...form.register("password")} className="mt-2 w-full rounded-xl border border-ink-200 px-3 py-2 outline-none focus:border-accent-600" />
        </label>
        {form.formState.errors.password && (
          <p className="mt-1 text-sm text-rose-700">{form.formState.errors.password.message}</p>
        )}
        <button type="submit" className="mt-6 w-full rounded-full bg-accent-600 py-2.5 text-sm font-medium text-white hover:bg-accent-700">
          Create account
        </button>
        <p className="mt-4 text-sm text-ink-700">
          Already registered?{" "}
          <Link to="/login" className="text-accent-700">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
