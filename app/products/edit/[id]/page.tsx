/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";

type Product = {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  rating: number;
  thumbnail: string;
};

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();

  const id = Number(params.id);

  // =========================
  // FORM STATE
  // =========================

  const [title, setTitle] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [price, setPrice] =
    useState("");

  const [stock, setStock] =
    useState("");

  // =========================
  // PAGE STATE
  // =========================

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [isLocalProduct, setIsLocalProduct] =
    useState(false);

  // =========================
  // LOAD PRODUCT
  // =========================

  useEffect(() => {
    if (!id || Number.isNaN(id)) {
      setError("Invalid product ID.");
      setLoading(false);
      return;
    }

    const loadProduct =
      async () => {
        try {
          setLoading(true);
          setError("");

          // =========================
          // FIRST CHECK LOCAL STORAGE
          // =========================

          const createdProducts: Product[] =
            JSON.parse(
              localStorage.getItem(
                "createdProducts"
              ) || "[]"
            );

          const localProduct =
            createdProducts.find(
              (product) =>
                product.id === id
            );

          // =========================
          // LOCAL PRODUCT FOUND
          // =========================

          if (localProduct) {
            setIsLocalProduct(true);

            setTitle(
              localProduct.title
            );

            setDescription(
              localProduct.description
            );

            setCategory(
              localProduct.category
            );

            setPrice(
              String(
                localProduct.price
              )
            );

            setStock(
              String(
                localProduct.stock
              )
            );

            setLoading(false);

            return;
          }

          // =========================
          // OTHERWISE GET FROM API
          // =========================

          const response =
            await api.get(
              `/products/${id}`
            );

          const product =
            response.data;

          setTitle(
            product.title || ""
          );

          setDescription(
            product.description || ""
          );

          setCategory(
            product.category || ""
          );

          setPrice(
            String(
              product.price ?? ""
            )
          );

          setStock(
            String(
              product.stock ?? ""
            )
          );

          setIsLocalProduct(false);

        } catch (error) {
          console.error(
            "Failed to load product:",
            error
          );

          setError(
            "Failed to load product."
          );
        } finally {
          setLoading(false);
        }
      };

    loadProduct();
  }, [id]);

  // =========================
  // SAVE PRODUCT
  // =========================

  const handleSubmit =
    async (
      e: React.FormEvent
    ) => {
      e.preventDefault();

      if (saving) return;

      setError("");

      // =========================
      // VALIDATION
      // =========================

      if (!title.trim()) {
        setError(
          "Product title is required."
        );
        return;
      }

      if (!description.trim()) {
        setError(
          "Product description is required."
        );
        return;
      }

      if (!category.trim()) {
        setError(
          "Category is required."
        );
        return;
      }

      const priceNumber =
        Number(price);

      const stockNumber =
        Number(stock);

      if (
        price === "" ||
        Number.isNaN(priceNumber) ||
        priceNumber < 0
      ) {
        setError(
          "Please enter a valid price."
        );
        return;
      }

      if (
        stock === "" ||
        Number.isNaN(stockNumber) ||
        stockNumber < 0
      ) {
        setError(
          "Please enter a valid stock."
        );
        return;
      }

      try {
        setSaving(true);

        // =========================
        // LOCAL PRODUCT UPDATE
        // =========================

        if (isLocalProduct) {

          const createdProducts: Product[] =
            JSON.parse(
              localStorage.getItem(
                "createdProducts"
              ) || "[]"
            );

          const updatedProducts =
            createdProducts.map(
              (product) => {

                if (
                  product.id === id
                ) {
                  return {
                    ...product,

                    title:
                      title.trim(),

                    description:
                      description.trim(),

                    category:
                      category.trim(),

                    price:
                      priceNumber,

                    stock:
                      stockNumber,
                  };
                }

                return product;
              }
            );

          localStorage.setItem(
            "createdProducts",
            JSON.stringify(
              updatedProducts
            )
          );

          alert(
            "Product updated successfully!"
          );

          router.push(
            "/products"
          );

          return;
        }

        // =========================
        // API PRODUCT UPDATE
        // =========================

        await api.put(
          `/products/${id}`,
          {
            title:
              title.trim(),

            description:
              description.trim(),

            category:
              category.trim(),

            price:
              priceNumber,

            stock:
              stockNumber,
          }
        );

        alert(
          "Product updated successfully!"
        );

        router.push(
          "/products"
        );

      } catch (error) {
        console.error(
          "Failed to update product:",
          error
        );

        setError(
          "Failed to update product. Please try again."
        );
      } finally {
        setSaving(false);
      }
    };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4">

        <div className="rounded-xl bg-white p-8 text-center shadow">

          <p className="text-gray-600">
            Loading product...
          </p>

        </div>

      </main>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (error && !title) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4">

        <div className="rounded-xl bg-white p-8 text-center shadow">

          <h1 className="mb-4 text-2xl font-bold text-red-600">
            Error
          </h1>

          <p className="mb-6 text-gray-600">
            {error}
          </p>

          <button
            onClick={() =>
              router.push(
                "/products"
              )
            }
            className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Back to Products
          </button>

        </div>

      </main>
    );
  }

  // =========================
  // UI
  // =========================

  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-8">

      <div className="mx-auto max-w-3xl">

        {/* BACK */}

        <button
          onClick={() =>
            router.push(
              "/products"
            )
          }
          className="mb-6 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
        >
          ← Back to Products
        </button>

        {/* HEADER */}

        <div className="mb-6">

          <h1 className="text-3xl font-bold text-gray-800">
            Edit Product
          </h1>

          <p className="mt-1 text-gray-500">
            Update product information
          </p>

        </div>

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="rounded-xl bg-white p-6 shadow md:p-8"
        >

          {/* ERROR */}

          {error && (
            <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* TITLE */}

          <div className="mb-5">

            <label className="mb-2 block font-medium text-gray-700">
              Product Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) =>
                setTitle(
                  e.target.value
                )
              }
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            />

          </div>

          {/* DESCRIPTION */}

          <div className="mb-5">

            <label className="mb-2 block font-medium text-gray-700">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              rows={5}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            />

          </div>

          {/* CATEGORY */}

          <div className="mb-5">

            <label className="mb-2 block font-medium text-gray-700">
              Category
            </label>

            <input
              type="text"
              value={category}
              onChange={(e) =>
                setCategory(
                  e.target.value
                )
              }
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            />

          </div>

          {/* PRICE + STOCK */}

          <div className="mb-6 grid gap-5 md:grid-cols-2">

            <div>

              <label className="mb-2 block font-medium text-gray-700">
                Price
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) =>
                  setPrice(
                    e.target.value
                  )
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />

            </div>

            <div>

              <label className="mb-2 block font-medium text-gray-700">
                Stock
              </label>

              <input
                type="number"
                min="0"
                value={stock}
                onChange={(e) =>
                  setStock(
                    e.target.value
                  )
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />

            </div>

          </div>

          {/* BUTTONS */}

          <div className="flex gap-3">

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/products"
                )
              }
              disabled={saving}
              className="rounded-lg border border-gray-300 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>

          </div>

        </form>

      </div>

    </main>
  );
}