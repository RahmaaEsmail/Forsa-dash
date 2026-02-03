import React, { useEffect, useState } from "react";
import { Button } from "../../ui/button";
import { Field, FieldGroup, FieldLabel } from "../../ui/field";
import { Input } from "../../ui/input";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { replace, useNavigate } from "react-router-dom";
import useLogin from "../../../hooks/auth/useLogin";
import { toast } from "sonner";
import { config } from "../../../api/config";
import { apiInstance } from "../../../api/apiInstance";

const formSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email"),
  password: z
    .string()
    .min(1, "Password is required")
});

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate, isPending } = useLogin()

  function onSubmit(data) {
    mutate(
      { body: data },
      {
        onSuccess: (res) => {
          if (!res?.success) {
            toast.error(res?.error?.message || "Login failed");
            return;
          }

          toast.success("User logged in successfully");

          localStorage.setItem(
            config.localStorageUserData,
            JSON.stringify(res?.data || {})
          );
          localStorage.setItem(config.localStorageTokenName , res?.meta?.access_token)
          apiInstance.defaults.headers.common.Authorization =
            `Bearer ${res?.meta?.access_token || ""}`;

          navigate("/", { replace: true });
        },
        onError: (err) => {
          toast.error(err?.response?.data?.error?.message || "Login failed");
        },
      }
    );


  }

  return (
    <div className="p-6 flex flex-col gap-3 lg:p-10">
      <img src="/images/LOGO.svg" className="w-39 h-22" alt="Logo" />

      <div className="flex flex-col mt-9 gap-2">
        <h1 className="text-medium font-bold text-secondary">Login</h1>
        <p className="text-small font-normal text-secondary">
          Enter your Email and Password to access your account
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
        <FieldGroup>
          {/* Email */}
          <Field>
            <FieldLabel className="text-sm font-normal text-secondary">
              Email
            </FieldLabel>

            <div className="bg-input-bg mb-1 h-15 rounded-main flex px-4 items-center gap-2">
              <Mail size={15} />
              <Input
                {...register("email")}
                placeholder="example@gmail.com"
                type="email"
                className="border-none bg-transparent shadow-none px-0 focus:ring-0 focus-visible:border-0 focus-visible:ring-0 focus:outline-none focus:border-none"
              />
            </div>

            <p
              className={`text-xs text-red-500 h-2 ${errors.email ? "visible" : "invisible"
                }`}
              role="alert"
              aria-live="polite"
            >
              {errors.email?.message || "placeholder"}
            </p>
          </Field>

          {/* Password */}
          <Field>
            <FieldLabel className="text-sm font-normal text-secondary">
              Password
            </FieldLabel>

            <div className="bg-input-bg mb-1 h-15 rounded-main flex px-4 items-center gap-2">
              <LockKeyhole size={15} />
              <Input
                {...register("password")}
                placeholder="***********"
                type={showPassword ? "text" : "password"}
                className="border-none bg-transparent shadow-none px-0 focus:ring-0 focus-visible:border-0 focus-visible:ring-0 focus:outline-none focus:border-none"
              />

              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <Eye size={15} /> : <EyeOff size={15} />}
              </button>
            </div>

            <p
              className={`text-xs text-red-500 h-2 ${errors.password ? "visible" : "invisible"
                }`}
              role="alert"
              aria-live="polite"
            >
              {errors.password?.message || "placeholder"}
            </p>
          </Field>
        </FieldGroup>

        <Button
          type="submit"
          disabled={isPending}
          className="w-full mt-8 rounded-2xl flex justify-center items-center p-[8px_20px]"
        >
          {isPending ? "Logging in..." : "Login"}
        </Button>
      </form>
    </div>
  );
}
