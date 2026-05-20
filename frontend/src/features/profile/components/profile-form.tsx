"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { profileApi } from "@/features/profile/api/profileApi";
import { FormField } from "@/features/auth/components/form-field";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Spinner } from "@/shared/components/spinner";
import { getApiErrorMessage } from "@/services/api/apiClient";
import { useAuthStore } from "@/store/authStore";

const profileSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email().max(100),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function ProfileForm() {
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((s) => s.setAuth);
  const token = useAuthStore((s) => s.token);
  const refreshToken = useAuthStore((s) => s.refreshToken);

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: profileApi.getProfile,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { username: "", email: "" },
  });

  useEffect(() => {
    if (profile) {
      reset({ username: profile.username, email: profile.email });
    }
  }, [profile, reset]);

  const mutation = useMutation({
    mutationFn: profileApi.updateProfile,
    onSuccess: (data) => {
      if (token && refreshToken) {
        setAuth({ username: data.username, role: data.role }, token, refreshToken);
      } else if (token) {
        useAuthStore.setState({
          user: { username: data.username, role: data.role },
        });
      }
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Profile updated");
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  if (isLoading || !profile) {
    return (
      <div className="flex justify-center py-8">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit((values) => mutation.mutate(values))}
      className="mx-auto max-w-md space-y-4"
    >
      <p className="text-sm text-muted-foreground">
        Active loans: {profile.activeBorrows} / {profile.maxBooksPerUser}
      </p>

      <FormField label="Username" htmlFor="username" error={errors.username?.message}>
        <Input id="username" {...register("username")} disabled={mutation.isPending} />
      </FormField>

      <FormField label="Email" htmlFor="email" error={errors.email?.message}>
        <Input id="email" type="email" {...register("email")} disabled={mutation.isPending} />
      </FormField>

      <Button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "Saving..." : "Save profile"}
      </Button>
    </form>
  );
}
