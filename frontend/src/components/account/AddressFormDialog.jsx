"use client";

import { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { addressSchema } from "@/schemas/address.schema";

export const defaultAddressValues = {
  fullName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
  isDefault: false,
};

export function normalizeAddressValues(address) {
  return {
    fullName: address?.fullName || "",
    phone: address?.phone || "",
    addressLine1: address?.addressLine1 || "",
    addressLine2: address?.addressLine2 || "",
    city: address?.city || "",
    state: address?.state || "",
    pincode: address?.pincode || "",
    country: address?.country || "India",
    isDefault: !!address?.isDefault,
  };
}

export default function AddressFormDialog({
  open,
  onOpenChange,
  mode,
  initialValues,
  onSubmit,
  isPending,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues: initialValues,
    shouldUnregister: true,
  });

  useEffect(() => {
    if (open) {
      reset(initialValues);
    }
  }, [open, initialValues, reset]);

  const submit = async (values) => {
    try {
      await onSubmit(values);
      reset(defaultAddressValues);
    } catch {
      // Mutation layer handles user feedback.
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!isPending) {
          onOpenChange(value);
        }
      }}
    >
      <DialogContent
        className="sm:max-w-2xl bg-white rounded-xl shadow-xl border border-slate-200"
        onEscapeKeyDown={(event) => {
          if (isPending) {
            event.preventDefault();
          }
        }}
        onPointerDownOutside={(event) => {
          if (isPending) {
            event.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add Address" : "Edit Address"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(submit)} className="space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" disabled={isPending} {...register("fullName")} />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-500">{errors.fullName.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" type="tel" disabled={isPending} {...register("phone")} />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="addressLine1">Address Line 1</Label>
            <Input id="addressLine1" disabled={isPending} {...register("addressLine1")} />
            {errors.addressLine1 && (
              <p className="mt-1 text-sm text-red-500">{errors.addressLine1.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="addressLine2">Address Line 2</Label>
            <Textarea id="addressLine2" rows={3} disabled={isPending} {...register("addressLine2")} />
            {errors.addressLine2 && (
              <p className="mt-1 text-sm text-red-500">{errors.addressLine2.message}</p>
            )}
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <Label htmlFor="city">City</Label>
              <Input id="city" disabled={isPending} {...register("city")} />
              {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city.message}</p>}
            </div>

            <div>
              <Label htmlFor="state">State</Label>
              <Input id="state" disabled={isPending} {...register("state")} />
              {errors.state && <p className="mt-1 text-sm text-red-500">{errors.state.message}</p>}
            </div>

            <div>
              <Label htmlFor="pincode">Pincode</Label>
              <Input id="pincode" disabled={isPending} {...register("pincode")} />
              {errors.pincode && (
                <p className="mt-1 text-sm text-red-500">{errors.pincode.message}</p>
              )}
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <Label htmlFor="country">Country</Label>
              <Input id="country" disabled={isPending} {...register("country")} />
              {errors.country && (
                <p className="mt-1 text-sm text-red-500">{errors.country.message}</p>
              )}
            </div>

            <label className="flex items-center gap-3 pt-7 text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                className="size-4 rounded border-slate-300 text-(--color-secondary) focus:ring-(--color-secondary)"
                disabled={isPending}
                {...register("isDefault")}
              />
              Default Address
            </label>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={isPending} className="min-w-36">
              {isPending
                ? mode === "add"
                  ? "Adding..."
                  : "Saving..."
                : mode === "add"
                ? "Add Address"
                : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}