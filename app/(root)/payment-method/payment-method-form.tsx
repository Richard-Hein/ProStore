"use client";

import { Button } from "@/components/ui/button";
import { DEFAULT_PAYMENT_METHOD, PAYMENT_METHODS } from "@/lib/constants";
import { paymentMethodSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { updateUserPaymentMethod } from "@/lib/actions/user.actions";
import { toast } from "sonner";

const PaymentMethodForm = ({
  preferredPaymentMethod,
}: {
  preferredPaymentMethod: string | null;
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof paymentMethodSchema>>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      type: preferredPaymentMethod || DEFAULT_PAYMENT_METHOD,
    },
  });

  const onSubmit = (values: z.infer<typeof paymentMethodSchema>) => {
    startTransition(async()=> {
        const res = await updateUserPaymentMethod(values);
        if(!res.success){
            toast.error(res.message);
            return;
        }
        router.push('/place-order');

    })
  };

  return (
    <div className="max-w-md mx-auto space-y-4">
      <h1 className="h2-bold mt-4">Payment Method</h1>
      <p className="text-sm text-muted-foreground">
        Please select a payment method
      </p>

      <form
        method="post"
        className="space-y-4 mt-2"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <Controller
          control={form.control}
          name="type"
          render={({ field }) => (
            <RadioGroup
              value={field.value}
              onValueChange={field.onChange}
              className="flex flex-col gap-5 "
            >
              {PAYMENT_METHODS.map((paymentMethod) => (
                <Field key={paymentMethod} orientation="horizontal">
                  <RadioGroupItem value={paymentMethod} id={paymentMethod} />
                  <FieldContent>
                    <FieldLabel htmlFor={paymentMethod}>
                      {paymentMethod}
                    </FieldLabel>
                  </FieldContent>
                </Field>
              ))}
            </RadioGroup>
          )}
        />

        {form.formState.errors.type && (
          <p className="text-sm text-red-500">
            {form.formState.errors.type.message}
          </p>
        )}

        <div className="flex gap-2">
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <ArrowRight className="h-4 w-4" />
            )}
            {" "}Continue
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PaymentMethodForm;