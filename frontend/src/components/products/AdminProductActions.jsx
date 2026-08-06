"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function AdminProductActions({ onAddProduct }) {
  return (
    <div className="mb-8 flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">
          Manage Products
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Add, edit and manage your products.
        </p>
      </div>

      <Button
        onClick={onAddProduct}
        className="gap-2 rounded-xl"
      >
        <Plus className="h-4 w-4" />

        Add Product
      </Button>
    </div>
  );
}