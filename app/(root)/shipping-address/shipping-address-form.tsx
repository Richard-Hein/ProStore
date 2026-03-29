"use client";
import { Controller, useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { shippingAddressSchema } from "@/lib/validators";
import { ShippingAddress } from "@/types";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { shippingAddressDefaultValues } from "@/lib/constants";
import { useTransition } from "react";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader } from "lucide-react";
import { updateUserAddress } from "@/lib/actions/user.actions";
import { toast } from "sonner";

const ShippingAddressForm = ({ address }: { address: ShippingAddress }) => {
  const form = useForm<z.infer<typeof shippingAddressSchema>>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: address || shippingAddressDefaultValues,
    // defaultValues: address,
  });

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const onSubmit:SubmitHandler<z.infer<typeof shippingAddressSchema>> = async (values) => {
    startTransition(async()=> {
        const res = await updateUserAddress(values);
        if(!res.success){
            toast.error(res.message)
        }
        router.push("/payment-method");
    })
  };

  return (
    <>
      <div className="max-w-md mx-auto space-y-4">
        <h1 className="h2-bold mt-4">Shipping Address</h1>
        <p className="text-sm text-muted-foreground">
          Please enter address to ship to
        </p>
        <form
          {...form}
          //   id="address-form"
          method="post"
          className="space-y-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="flex flex-col gap-5 md:flex-row">
            <FieldGroup>
              {/* full name */}
              <Controller
                name="fullName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-demo-fullName">
                      Full Name
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-rhf-demo-fullName"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter Full Name"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              {/* street address */}
              <Controller
                name="streetAddress"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-demo-streetAddress">
                      Street Address
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-rhf-demo-streetAddress"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter Street Address"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              {/* city */}
              <Controller
                name="city"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-demo-city">City</FieldLabel>
                    <Input
                      {...field}
                      id="form-rhf-demo-city"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter City"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              {/* postal code */}
              <Controller
                name="postalCode"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-demo-postalCode">
                      Postal Code
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-rhf-demo-postalCode"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter Postal Code"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              {/* country */}
              <Controller
                name="country"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-demo-country">
                      Country
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-rhf-demo-country"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter Country"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <div className="flex gap-2">
                <Button type="submit" disabled={isPending}>
                  {isPending ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <ArrowRight className="h-4 w-4" />
                  )}{" "}
                  Continue
                </Button>
              </div>
            </FieldGroup>
          </div>
        </form>
      </div>
    </>
  );
};

export default ShippingAddressForm;
