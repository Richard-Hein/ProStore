'use client';

import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { updateUser } from '@/lib/actions/user.actions';
import { USER_ROLES } from '@/lib/constants';
import { updateUserSchema } from '@/lib/validators';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const UpdateUserForm = ({
  user,
}: {
  user: z.infer<typeof updateUserSchema>;
}) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof updateUserSchema>>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: user,
  });

  const onSubmit = async (values: z.infer<typeof updateUserSchema>) => {
    try {
      const res = await updateUser({
        ...values,
        id: user.id,
      });

      if (!res.success) {
        return toast.error(res.message, {
            position: "top-center"
        });
      }

      toast.success(res.message, {
        position: "top-center"
      });
      form.reset();
      router.push('/admin/users');
    } catch (error) {
      toast.error((error as Error).message, {
        position: "top-center"
      });
    }
  };

  return (
    <form method="POST" onSubmit={form.handleSubmit(onSubmit)}>
  <FieldGroup className="space-y-4">
    {/* Email */}
    <Controller
      name="email"
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className="w-full">
          <FieldLabel htmlFor="user-email">Email</FieldLabel>
          <Input
            {...field}
            id="user-email"
            disabled
            placeholder="Enter user email"
            aria-invalid={fieldState.invalid}
            autoComplete="off"
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />

    {/* Name */}
    <Controller
      name="name"
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className="w-full">
          <FieldLabel htmlFor="user-name">Name</FieldLabel>
          <Input
            {...field}
            id="user-name"
            placeholder="Enter user name"
            aria-invalid={fieldState.invalid}
            autoComplete="off"
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />

    {/* Role */}
    <Controller
      name="role"
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className="w-full">
          <FieldLabel htmlFor="user-role">Role</FieldLabel>
          <Select onValueChange={field.onChange} value={field.value?.toString()}>
            <SelectTrigger id="user-role" aria-invalid={fieldState.invalid}>
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              {USER_ROLES.map((role) => (
                <SelectItem key={role} value={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />

    <div className="mt-6 flex-between">
      <Button
      
        type="submit"
        className="w-full"
        disabled={form.formState.isSubmitting}
      >
        {form.formState.isSubmitting ? "Submitting..." : "Update User"}
      </Button>
    </div>
  </FieldGroup>
</form>
  );
};

export default UpdateUserForm;