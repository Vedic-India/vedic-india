"use client";

import { useMemo, useState } from "react";
import { MapPin, Plus, PencilLine, Trash2, Star, Home } from "lucide-react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useAuth } from "@/context/AuthContext";
import { queryKeys } from "@/constants/queryKeys";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  addAddress,
  deleteAddress,
  editAddress,
  makeAddressDefault,
} from "@/services/user.service";
import AddressFormDialog, {
  defaultAddressValues,
  normalizeAddressValues,
} from "./AddressFormDialog";

function getErrorMessage(error, fallback) {
  return error?.response?.data?.message || fallback;
}

function ConfirmDeleteDialog({ open, onOpenChange, onConfirm, isPending, address }) {
  return (
    <Dialog open={open} onOpenChange={(value) => !isPending && onOpenChange(value)}>
      <DialogContent
        className="sm:max-w-lg"
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
          <DialogTitle>Delete Address</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 text-sm leading-6 text-slate-600">
          <p>
            Are you sure you want to delete the address for <span className="font-semibold text-slate-900">{address?.fullName}</span>?
          </p>
          <p>This action cannot be undone.</p>
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

          <Button
            type="button"
            variant="destructive"
            disabled={isPending}
            onClick={onConfirm}
          >
            {isPending ? "Deleting..." : "Delete Address"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AddressCard({ address, onEdit, onDelete, onMakeDefault, isMakingDefault }) {
  return (
    <article className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_18px_60px_-40px_rgba(15,61,46,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_70px_-40px_rgba(15,61,46,0.45)] sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--color-secondary),#0f3d2e)] text-white shadow-sm">
            <MapPin className="size-5" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-semibold text-slate-900">{address.fullName}</h3>
              {address.isDefault && (
                <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                  Default
                </span>
              )}
            </div>

            <p className="mt-1 text-sm text-slate-500">{address.phone}</p>
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-2 text-sm leading-6 text-slate-600">
        <p className="font-medium text-slate-800">{address.addressLine1}</p>
        {address.addressLine2 ? <p>{address.addressLine2}</p> : null}
        <p>
          {address.city}, {address.state} {address.pincode}
        </p>
        <p>{address.country || "India"}</p>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={onEdit}>
          <PencilLine className="size-4" />
          Edit
        </Button>

        <Button variant="outline" size="sm" onClick={onDelete}>
          <Trash2 className="size-4" />
          Delete
        </Button>

        {!address.isDefault && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onMakeDefault}
            disabled={isMakingDefault}
          >
            <Star className="size-4" />
            {isMakingDefault ? "Making Default..." : "Make Default"}
          </Button>
        )}
      </div>
    </article>
  );
}

function EmptyState({ onAdd }) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-200 bg-white px-6 py-14 text-center shadow-[0_18px_60px_-48px_rgba(15,61,46,0.45)] sm:px-10">
      <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--color-secondary),#0f3d2e)] text-white shadow-sm">
        <Home className="size-8" />
      </div>

      <h2 className="mt-5 text-2xl font-semibold text-slate-900">
        No saved addresses yet
      </h2>

      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
        Add a shipping address so checkout and delivery details are ready when you need them.
      </p>

      <div className="mt-8 flex justify-center">
        <Button onClick={onAdd} className="h-12 rounded-2xl px-6">
          <Plus className="size-4" />
          Add Address
        </Button>
      </div>
    </div>
  );
}

export default function AddressesPage() {
  const { user, updateUser } = useAuth();
  const queryClient = useQueryClient();
  const [addressDialog, setAddressDialog] = useState({
    open: false,
    mode: "add",
    address: null,
  });
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    address: null,
  });
  const [pendingDefaultId, setPendingDefaultId] = useState(null);

  const addresses = useMemo(() => user?.addresses || [], [user?.addresses]);
  const dialogInitialValues = useMemo(() => {
    if (addressDialog.mode === "edit") {
      return normalizeAddressValues(addressDialog.address);
    }

    return defaultAddressValues;
  }, [addressDialog.mode, addressDialog.address]);

  const refreshCurrentUser = (updatedUser) => {
    updateUser(updatedUser);
    queryClient.invalidateQueries({ queryKey: queryKeys.currentUser });
  };

  const addressMutation = useMutation({
    mutationFn: async ({ mode, addressId, values }) => {
      if (mode === "add") {
        return addAddress(values);
      }

      return editAddress(addressId, values);
    },
    onSuccess: (updatedUser) => {
      refreshCurrentUser(updatedUser);
      setAddressDialog({ open: false, mode: "add", address: null });
      toast.success(
        addressDialog.mode === "add"
          ? "Address added successfully"
          : "Address updated successfully"
      );
    },
    onError: (error) => {
      toast.error(
        getErrorMessage(error, "Unable to save address")
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAddress,
    onSuccess: (updatedUser) => {
      refreshCurrentUser(updatedUser);
      setDeleteDialog({ open: false, address: null });
      toast.success("Address deleted successfully");
    },
    onError: (error) => {
      toast.error(
        getErrorMessage(error, "Unable to delete address")
      );
    },
  });

  const defaultMutation = useMutation({
    mutationFn: makeAddressDefault,
    onSuccess: (updatedUser) => {
      refreshCurrentUser(updatedUser);
      setPendingDefaultId(null);
      toast.success("Default address updated");
    },
    onError: (error) => {
      setPendingDefaultId(null);
      toast.error(
        getErrorMessage(error, "Unable to update default address")
      );
    },
  });

  const openAddDialog = () => {
    setAddressDialog({
      open: true,
      mode: "add",
      address: null,
    });
  };

  const openEditDialog = (address) => {
    setAddressDialog({
      open: true,
      mode: "edit",
      address,
    });
  };

  const handleAddressSubmit = async (values) => {
    const payload = {
      ...values,
      addressLine2: values.addressLine2?.trim() || undefined,
      country: values.country?.trim(),
    };

    return addressMutation.mutateAsync({
      mode: addressDialog.mode,
      addressId: addressDialog.address?._id,
      values: payload,
    });
  };

  const handleDelete = async () => {
    if (!deleteDialog.address?._id) return;

    await deleteMutation.mutateAsync(deleteDialog.address._id);
  };

  const handleMakeDefault = async (addressId) => {
    setPendingDefaultId(addressId);

    try {
      await defaultMutation.mutateAsync(addressId);
    } finally {
      setPendingDefaultId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.28em] text-(--color-secondary)">
            Account
          </p>

          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              My Addresses
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Save and manage your shipping addresses for faster checkout.
            </p>
          </div>
        </div>

        <Button onClick={openAddDialog} className="h-12 rounded-2xl px-5">
          <Plus className="size-4" />
          Add New Address
        </Button>
      </div>

      {addresses.length === 0 ? (
        <EmptyState onAdd={openAddDialog} />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {addresses.map((address) => (
            <AddressCard
              key={address._id}
              address={address}
              onEdit={() => openEditDialog(address)}
              onDelete={() => setDeleteDialog({ open: true, address })}
              onMakeDefault={() => handleMakeDefault(address._id)}
              isMakingDefault={pendingDefaultId === address._id || defaultMutation.isPending}
            />
          ))}
        </div>
      )}

      <AddressFormDialog
        open={addressDialog.open}
        onOpenChange={(open) => setAddressDialog((current) => ({ ...current, open }))}
        mode={addressDialog.mode}
        initialValues={dialogInitialValues}
        onSubmit={handleAddressSubmit}
        isPending={addressMutation.isPending}
      />

      <ConfirmDeleteDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog((current) => ({ ...current, open }))}
        onConfirm={handleDelete}
        isPending={deleteMutation.isPending}
        address={deleteDialog.address}
      />
    </div>
  );
}