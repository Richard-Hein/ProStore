"use client";

import { productDefaultValues } from "@/lib/constants";
import { createProduct, updateProduct } from "@/lib/actions/product.action";
import { UploadButton } from "@/lib/uploadthing";
import { insertProductSchema, updateProductSchema } from "@/lib/validators";
import { Product } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import slugify from "slugify";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Card, CardContent } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { toast } from "sonner";
import Image from "next/image";

const ProductForm = ({
  type,
  product,
  productId,
}: {
  type: "Create" | "Update";
  product?: Product;
  productId?: string;
}) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof insertProductSchema>>({
    resolver:
      type === "Update"
        ? zodResolver(updateProductSchema)
        : zodResolver(insertProductSchema),
    defaultValues:
      product && type === "Update"
        ? {
            ...product,
            images: product.images ?? [],
            banner: product.banner ?? "",
          }
        : {
            ...productDefaultValues,
            images: productDefaultValues.images ?? [],
            banner: productDefaultValues.banner ?? "",
          },
  });

  const onSubmit: SubmitHandler<z.infer<typeof insertProductSchema>> = async (
    values
  ) => {
    if (type === "Create") {
      const res = await createProduct(values);

      if (!res.success) {
        toast.error(res.message, {
          position: "top-center"
        });
      } else {
        toast.success(res.message, {
          position: "top-center"
        });
        router.push("/admin/products");
      }
    }

    if (type === "Update") {
      if (!productId) {
        router.push("/admin/products");
        return;
      }

      const res = await updateProduct({ ...values, id: productId });

      if (!res.success) {
        toast.error(res.message, {
          position: "top-center"
        });
      } else {
        toast.success(res.message, {
          position: "top-center"
        });
        router.push("/admin/products");
      }
    }
  };

  const isFeatured = form.watch("isFeatured");
  const banner = form.watch("banner");

  return (
    <form
      method="POST"
      className="space-y-4"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <FieldGroup className="space-y-5">
        {/* Row 1 */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="product-name">Name</FieldLabel>
                <Input
                  {...field}
                  id="product-name"
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter product name"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="slug"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="product-slug">Slug</FieldLabel>

                <div className="space-y-2">
                  <Input
                    {...field}
                    id="product-slug"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter slug"
                    autoComplete="off"
                  />

                  <Button
                    type="button"
                    className="bg-gray-500 text-white hover:bg-gray-600"
                    onClick={() => {
                      form.setValue(
                        "slug",
                        slugify(form.getValues("name"), { lower: true }),
                        {
                          shouldValidate: true,
                          shouldDirty: true,
                          shouldTouch: true,
                        }
                      );
                    }}
                  >
                    Generate
                  </Button>
                </div>

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Controller
            name="category"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="product-category">Category</FieldLabel>
                <Input
                  {...field}
                  id="product-category"
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter category"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="brand"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="product-brand">Brand</FieldLabel>
                <Input
                  {...field}
                  id="product-brand"
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter brand"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Controller
            name="price"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="product-price">Price</FieldLabel>
                <Input
                  {...field}
                  id="product-price"
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter product price"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="stock"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="product-stock">Stock</FieldLabel>
                <Input
                  {...field}
                  id="product-stock"
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter stock"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

        {/* Images */}
        <Controller
          name="images"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="w-full">
              <FieldLabel htmlFor="product-images">Images</FieldLabel>

              <Card>
                <CardContent className="mt-2 min-h-48 space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(field.value) &&
                      field.value.length > 0 &&
                      field.value.map((image: string, index: number) => (
                        <div
                          key={`${image}-${index}`}
                          className="h-20 w-20 overflow-hidden rounded-sm border bg-muted"
                        >
                          <Image
                            src={image}
                            alt={`product-${index}`}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ))}
                  </div>

                  <UploadButton
                    endpoint="imageUploader"
                    onClientUploadComplete={(res) => {
                      const uploadedUrls = res.map(
                        (file) => file.ufsUrl ?? file.url
                      );

                      form.setValue(
                        "images",
                        [...(field.value ?? []), ...uploadedUrls],
                        {
                          shouldValidate: true,
                          shouldDirty: true,
                          shouldTouch: true,
                        }
                      );

                      toast.success("Images uploaded successfully", {
                        position: "top-center"
                      });
                    }}
                    onUploadError={(error: Error) => {
                      console.error("UploadThing error:", error);
                      toast.error(error.message || "Upload failed", {
                        position: "top-center"
                      });
                    }}
                    appearance={{
                      button:
                        "ut-ready:bg-primary ut-uploading:cursor-not-allowed rounded-md bg-primary px-4 py-2 text-primary-foreground",
                      allowedContent: "text-xs text-muted-foreground",
                    }}
                  />
                </CardContent>
              </Card>

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Featured Product */}
        <Controller
          name="isFeatured"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="product-featured">
                Featured Product
              </FieldLabel>

              <Card>
                <CardContent className="mt-2 space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="product-featured"
                      checked={!!field.value}
                      onCheckedChange={field.onChange}
                    />
                    <label htmlFor="product-featured" className="text-sm">
                      Is Featured?
                    </label>
                  </div>

                  {isFeatured && banner && (
                    <div className="overflow-hidden rounded-sm border bg-muted">
                      <Image
                        src={banner}
                        alt="banner image"
                        className="h-auto w-full object-cover"
                      />
                    </div>
                  )}

                  {isFeatured && !banner && (
                    <UploadButton
                      endpoint="imageUploader"
                      onClientUploadComplete={(res) => {
                        form.setValue(
                          "banner",
                          res[0]?.ufsUrl ?? res[0]?.url ?? "",
                          {
                            shouldValidate: true,
                            shouldDirty: true,
                            shouldTouch: true,
                          }
                        );

                        toast.success("Banner uploaded successfully", {
                          position: "top-center"
                        });
                      }}
                      onUploadError={(error: Error) => {
                        console.error("UploadThing banner error:", error);
                        toast.error(error.message || "Upload failed", {
                          position: "top-center"
                        });
                      }}
                      appearance={{
                        button:
                          "ut-ready:bg-primary ut-uploading:cursor-not-allowed rounded-md bg-primary px-4 py-2 text-primary-foreground",
                        allowedContent: "text-xs text-muted-foreground",
                      }}
                    />
                  )}
                </CardContent>
              </Card>

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Description */}
        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="product-description">Description</FieldLabel>
              <Textarea
                {...field}
                id="product-description"
                aria-invalid={fieldState.invalid}
                placeholder="Enter product description"
                className="resize-none"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className="flex gap-2">
          <Button
            type="submit"
            size="lg"
            disabled={form.formState.isSubmitting}
            className="w-full"
          >
            {form.formState.isSubmitting ? "Submitting" : `${type} Product`}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
};

export default ProductForm;