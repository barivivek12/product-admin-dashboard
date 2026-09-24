"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";

type Review = {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
};

type Product = {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  rating: number;
  stock: number;
  brand?: string;
  thumbnail: string;
  images: string[];
  reviews: Review[];
};

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/products/${params.id}`
        );

        setProduct(response.data);
      } catch (error) {
        console.error(
          "Failed to fetch product:",
          error
        );

        setError("Product not found.");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  // Loading
  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100 p-6">
        <div className="mx-auto max-w-5xl rounded-xl bg-white p-10 text-center shadow">
          <p className="text-gray-600">
            Loading product...
          </p>
        </div>
      </main>
    );
  }

  // Not found
  if (error || !product) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
        <div className="rounded-xl bg-white p-10 text-center shadow">
          <h1 className="mb-3 text-2xl font-bold text-red-600">
            Product Not Found
          </h1>

          <p className="mb-6 text-gray-600">
            The product you are looking for does not exist.
          </p>

          <button
            onClick={() => router.push("/products")}
            className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Back to Products
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="mx-auto max-w-6xl">

        {/* Back Button */}
        <button
          onClick={() => router.push("/products")}
          className="mb-6 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
        >
          ← Back to Products
        </button>

        {/* Product Details */}
        <div className="rounded-xl bg-white p-6 shadow md:p-8">

          <div className="grid gap-8 md:grid-cols-2">

            {/* Product Image */}
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.thumbnail}
                alt={product.title}
                className="h-80 w-full rounded-xl object-contain"
              />
            </div>

            {/* Product Information */}
            <div>
              <p className="mb-2 text-sm text-gray-500">
                {product.category}
              </p>

              <h1 className="mb-4 text-3xl font-bold text-gray-800">
                {product.title}
              </h1>

              <p className="mb-6 text-gray-600">
                {product.description}
              </p>

              <div className="mb-4 text-3xl font-bold text-blue-600">
                ${product.price}
              </div>

              <div className="mb-6 flex flex-wrap gap-4">
                <span className="rounded-lg bg-yellow-100 px-3 py-2 text-sm">
                  ⭐ {product.rating}
                </span>

                <span className="rounded-lg bg-green-100 px-3 py-2 text-sm">
                  Stock: {product.stock}
                </span>

                {product.brand && (
                  <span className="rounded-lg bg-gray-100 px-3 py-2 text-sm">
                    Brand: {product.brand}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Reviews */}
          <div className="mt-10 border-t pt-8">

            <h2 className="mb-6 text-2xl font-bold text-gray-800">
              Reviews
            </h2>

            {product.reviews &&
            product.reviews.length > 0 ? (
              <div className="space-y-4">
                {product.reviews.map(
                  (review, index) => (
                    <div
                      key={index}
                      className="rounded-lg border border-gray-200 p-5"
                    >
                      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                        <h3 className="font-semibold">
                          {review.reviewerName}
                        </h3>

                        <span>
                          ⭐ {review.rating}
                        </span>
                      </div>

                      <p className="text-gray-600">
                        {review.comment}
                      </p>

                      <p className="mt-2 text-xs text-gray-400">
                        {new Date(
                          review.date
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  )
                )}
              </div>
            ) : (
              <p className="text-gray-500">
                No reviews available.
              </p>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}