"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

export default function AddProductPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (saving) return;

    setError("");

    // =========================
    // VALIDATION
    // =========================

    if (!title.trim()) {
      setError("Product title is required.");
      return;
    }

    if (!description.trim()) {
      setError("Product description is required.");
      return;
    }

    if (!category.trim()) {
      setError("Category is required.");
      return;
    }

    const priceNumber = Number(price);
    const stockNumber = Number(stock);

    if (
      price === "" ||
      Number.isNaN(priceNumber) ||
      priceNumber < 0
    ) {
      setError("Please enter a valid price.");
      return;
    }

    if (
      stock === "" ||
      Number.isNaN(stockNumber) ||
      stockNumber < 0
    ) {
      setError("Please enter a valid stock.");
      return;
    }

    // =========================
    // ADD PRODUCT
    // =========================

    try {
      setSaving(true);

      const response = await api.post(
        "/products/add",
        {
          title: title.trim(),
          description: description.trim(),
          category: category.trim(),
          price: priceNumber,
          stock: stockNumber,
        }
      );

      const apiProduct = response.data;

      // =========================
      // GET EXISTING LOCAL PRODUCTS
      // =========================

      const createdProducts: Product[] =
        JSON.parse(
          localStorage.getItem(
            "createdProducts"
          ) || "[]"
        );

      // =========================
      // CREATE LOCAL PRODUCT
      // =========================

      const newProduct: Product = {
        id: apiProduct.id,

        title:
          apiProduct.title ||
          title.trim(),

        description:
          apiProduct.description ||
          description.trim(),

        category:
          apiProduct.category ||
          category.trim(),

        price:
          apiProduct.price ??
          priceNumber,

        stock:
          apiProduct.stock ??
          stockNumber,

        rating: 0,

        thumbnail:
          apiProduct.thumbnail ||
          "https://dummyjson.com/image/150",
      };

      // =========================
      // SAVE TO LOCAL STORAGE
      // =========================

      createdProducts.unshift(
        newProduct
      );

      localStorage.setItem(
        "createdProducts",
        JSON.stringify(
          createdProducts
        )
      );

      // =========================
      // SUCCESS
      // =========================

      alert(
        "Product added successfully!"
      );

      router.push("/products");
    } catch (error) {
      console.error(
        "Failed to add product:",
        error
      );

      setError(
        "Failed to add product. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-8">

      <div className="mx-auto max-w-3xl">

        {/* BACK */}

        <button
          onClick={() =>
            router.push("/products")
          }
          className="mb-6 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
        >
          ← Back to Products
        </button>

        {/* HEADER */}

        <div className="mb-6">

          <h1 className="text-3xl font-bold text-gray-800">
            Add Product
          </h1>

          <p className="mt-1 text-gray-500">
            Create a new product
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
                setTitle(e.target.value)
              }
              placeholder="Enter product title"
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
              placeholder="Enter product description"
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
              placeholder="Example: beauty"
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
                placeholder="9.99"
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
                placeholder="100"
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
                : "Add Product"}
            </button>

          </div>

        </form>

      </div>

    </main>
  );
}