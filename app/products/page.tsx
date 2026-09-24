/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @next/next/no-img-element */

"use client";
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

type Product = {
  id: number;
  title: string;
  description?: string;
  category: string;
  price: number;
  rating: number;
  stock: number;
  thumbnail: string;
  images?: string[];
  brand?: string;
};

type Category = {
  slug: string;
  name: string;
  url: string;
};

type SortOption =
  | ""
  | "price-asc"
  | "price-desc"
  | "rating-asc"
  | "rating-desc"
  | "title-asc"
  | "title-desc";

export default function ProductsPage() {
  const router = useRouter();

  // =========================
  // AUTH
  // =========================

  const [authChecking, setAuthChecking] =
    useState(true);

  useEffect(() => {
    const token =
      localStorage.getItem("token");

    if (!token) {
      router.push("/");
      return;
    }

    setAuthChecking(false);
  }, [router]);

  // =========================
  // PRODUCTS
  // =========================

  const [products, setProducts] =
    useState<Product[]>([]);

  const [total, setTotal] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // =========================
  // SEARCH
  // =========================

  const [search, setSearch] =
    useState("");

  const [debouncedSearch, setDebouncedSearch] =
    useState("");

  // =========================
  // CATEGORY
  // =========================

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [category, setCategory] =
    useState("");

  // =========================
  // SORT
  // =========================

  const [sort, setSort] =
    useState<SortOption>("");

  // =========================
  // PAGINATION
  // =========================

  const [page, setPage] =
    useState(1);

  const [pageSize, setPageSize] =
    useState(10);

  // =========================
  // URL READY
  // =========================

  const [urlReady, setUrlReady] =
    useState(false);

  // =========================
  // READ URL
  // =========================

  useEffect(() => {
    const params =
      new URLSearchParams(
        window.location.search
      );

    const urlPage =
      Number(params.get("page"));

    const urlPageSize =
      Number(params.get("pageSize"));

    const urlSearch =
      params.get("search") || "";

    const urlCategory =
      params.get("category") || "";

    const urlSort =
      (params.get("sort") || "") as SortOption;

    if (
      Number.isInteger(urlPage) &&
      urlPage >= 1
    ) {
      setPage(urlPage);
    }

    if (
      [10, 20, 50].includes(
        urlPageSize
      )
    ) {
      setPageSize(urlPageSize);
    }

    setSearch(urlSearch);
    setDebouncedSearch(urlSearch);
    setCategory(urlCategory);

    const validSorts: SortOption[] = [
      "",
      "price-asc",
      "price-desc",
      "rating-asc",
      "rating-desc",
      "title-asc",
      "title-desc",
    ];

    if (
      validSorts.includes(urlSort)
    ) {
      setSort(urlSort);
    }

    setUrlReady(true);
  }, []);

  // =========================
  // UPDATE URL
  // =========================

  useEffect(() => {
    if (!urlReady) return;

    const params =
      new URLSearchParams();

    params.set(
      "page",
      String(page)
    );

    params.set(
      "pageSize",
      String(pageSize)
    );

    if (
      debouncedSearch.trim()
    ) {
      params.set(
        "search",
        debouncedSearch.trim()
      );
    }

    if (category) {
      params.set(
        "category",
        category
      );
    }

    if (sort) {
      params.set(
        "sort",
        sort
      );
    }

    window.history.replaceState(
      {},
      "",
      `/products?${params.toString()}`
    );
  }, [
    page,
    pageSize,
    debouncedSearch,
    category,
    sort,
    urlReady,
  ]);

  // =========================
  // SEARCH DEBOUNCE
  // =========================

  useEffect(() => {
    const timer =
      setTimeout(() => {
        setDebouncedSearch(
          search
        );

        setPage(1);
      }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  // =========================
  // CATEGORIES
  // =========================

  useEffect(() => {
    const loadCategories =
      async () => {
        try {
          const response =
            await api.get(
              "/products/categories"
            );

          setCategories(
            response.data
          );
        } catch (error) {
          console.error(
            "Category loading failed:",
            error
          );
        }
      };

    loadCategories();
  }, []);

  // =========================
  // SORT
  // =========================

  const sortProducts = (
    items: Product[]
  ) => {
    const copied = [
      ...items,
    ];

    switch (sort) {
      case "price-asc":
        return copied.sort(
          (a, b) =>
            a.price - b.price
        );

      case "price-desc":
        return copied.sort(
          (a, b) =>
            b.price - a.price
        );

      case "rating-asc":
        return copied.sort(
          (a, b) =>
            a.rating - b.rating
        );

      case "rating-desc":
        return copied.sort(
          (a, b) =>
            b.rating - a.rating
        );

      case "title-asc":
        return copied.sort(
          (a, b) =>
            a.title.localeCompare(
              b.title
            )
        );

      case "title-desc":
        return copied.sort(
          (a, b) =>
            b.title.localeCompare(
              a.title
            )
        );

      default:
        return copied;
    }
  };

  // =========================
  // FETCH PRODUCTS
  // =========================

  useEffect(() => {
    if (
      !urlReady ||
      authChecking
    ) {
      return;
    }

    const controller =
      new AbortController();

    const fetchProducts =
      async () => {
        try {
          setLoading(true);
          setError("");

          const skip =
            (page - 1) *
            pageSize;

          // =========================
          // LOCAL PRODUCTS
          // =========================

          const localProducts: Product[] =
            JSON.parse(
              localStorage.getItem(
                "createdProducts"
              ) || "[]"
            );

          // =========================
          // SEARCH + CATEGORY
          // =========================

          if (
            debouncedSearch.trim() &&
            category
          ) {
            const response =
              await api.get(
                `/products/search?q=${encodeURIComponent(
                  debouncedSearch.trim()
                )}&limit=0`,
                {
                  signal:
                    controller.signal,
                }
              );

            const apiProducts: Product[] =
              response.data.products.filter(
                (
                  product: Product
                ) =>
                  product.category ===
                  category
              );

            const matchingLocalProducts =
              localProducts.filter(
                (product) => {
                  const matchesSearch =
                    product.title
                      .toLowerCase()
                      .includes(
                        debouncedSearch
                          .trim()
                          .toLowerCase()
                      );

                  const matchesCategory =
                    product.category ===
                    category;

                  return (
                    matchesSearch &&
                    matchesCategory
                  );
                }
              );

            const combinedProducts = [
              ...matchingLocalProducts,
              ...apiProducts,
            ];

            const uniqueProducts =
              combinedProducts.filter(
                (
                  product,
                  index,
                  self
                ) =>
                  index ===
                  self.findIndex(
                    (item) =>
                      item.id ===
                      product.id
                  )
              );

            const sortedProducts =
              sortProducts(
                uniqueProducts
              );

            setProducts(
              sortedProducts.slice(
                skip,
                skip + pageSize
              )
            );

            setTotal(
              sortedProducts.length
            );

          } else {

            // =========================
            // API URL
            // =========================

            let url = "";

            if (
              debouncedSearch.trim()
            ) {
              url =
                `/products/search?q=${encodeURIComponent(
                  debouncedSearch.trim()
                )}`;
            } else if (
              category
            ) {
              url =
                `/products/category/${encodeURIComponent(
                  category
                )}`;
            } else {
              url =
                "/products";
            }

            const sortQuery =
              sort ===
              "price-asc"
                ? "&sortBy=price&order=asc"
                : sort ===
                  "price-desc"
                ? "&sortBy=price&order=desc"
                : sort ===
                  "rating-asc"
                ? "&sortBy=rating&order=asc"
                : sort ===
                  "rating-desc"
                ? "&sortBy=rating&order=desc"
                : sort ===
                  "title-asc"
                ? "&sortBy=title&order=asc"
                : sort ===
                  "title-desc"
                ? "&sortBy=title&order=desc"
                : "";

            const finalUrl =
              `${url}?limit=${pageSize}&skip=${skip}${sortQuery}`;

            const response =
              await api.get(
                finalUrl,
                {
                  signal:
                    controller.signal,
                }
              );

            // =========================
            // MATCH LOCAL PRODUCTS
            // =========================

            const matchingLocalProducts =
              localProducts.filter(
                (product) => {
                  const matchesSearch =
                    !debouncedSearch.trim() ||
                    product.title
                      .toLowerCase()
                      .includes(
                        debouncedSearch
                          .trim()
                          .toLowerCase()
                      );

                  const matchesCategory =
                    !category ||
                    product.category ===
                      category;

                  return (
                    matchesSearch &&
                    matchesCategory
                  );
                }
              );

            // =========================
            // PAGE 1
            // =========================

            if (page === 1) {

              const combinedProducts = [
                ...matchingLocalProducts,
                ...response.data.products,
              ];

              const uniqueProducts =
                combinedProducts.filter(
                  (
                    product,
                    index,
                    self
                  ) =>
                    index ===
                    self.findIndex(
                      (item) =>
                        item.id ===
                        product.id
                    )
                );

              const sortedProducts =
                sortProducts(
                  uniqueProducts
                );

              setProducts(
                sortedProducts.slice(
                  0,
                  pageSize
                )
              );

              setTotal(
                response.data.total +
                  matchingLocalProducts.length
              );

            } else {

              setProducts(
                response.data.products
              );

              setTotal(
                response.data.total +
                  matchingLocalProducts.length
              );
            }
          }

        } catch (error: unknown) {

          const axiosError =
            error as {
              code?: string;
            };

          if (
            axiosError.code ===
            "ERR_CANCELED"
          ) {
            return;
          }

          console.error(
            "Failed to fetch products:",
            error
          );

          setError(
            "Failed to load products."
          );

        } finally {

          if (
            !controller.signal
              .aborted
          ) {
            setLoading(false);
          }
        }
      };

    fetchProducts();

    return () => {
      controller.abort();
    };

  }, [
    page,
    pageSize,
    debouncedSearch,
    category,
    sort,
    urlReady,
    authChecking,
  ]);

  // =========================
  // DELETE
  // =========================

  const handleDelete =
    async (id: number) => {

      const confirmed =
        window.confirm(
          "Are you sure you want to delete this product?"
        );

      if (!confirmed) return;

      try {

        const localProducts: Product[] =
          JSON.parse(
            localStorage.getItem(
              "createdProducts"
            ) || "[]"
          );

        const isLocalProduct =
          localProducts.some(
            (product) =>
              product.id === id
          );

        if (
          isLocalProduct
        ) {

          const updated =
            localProducts.filter(
              (product) =>
                product.id !== id
            );

          localStorage.setItem(
            "createdProducts",
            JSON.stringify(
              updated
            )
          );

        } else {

          await api.delete(
            `/products/${id}`
          );
        }

        setProducts(
          (current) =>
            current.filter(
              (product) =>
                product.id !== id
            )
        );

        setTotal(
          (current) =>
            Math.max(
              0,
              current - 1
            )
        );

        alert(
          "Product deleted successfully!"
        );

      } catch (error) {

        console.error(
          "Delete failed:",
          error
        );

        alert(
          "Failed to delete product."
        );
      }
    };

  // =========================
  // LOGOUT
  // =========================

  const handleLogout =
    () => {
      localStorage.removeItem(
        "token"
      );

      router.push("/");
    };

  // =========================
  // PAGE SIZE
  // =========================

  const handlePageSizeChange =
    (value: number) => {
      setPageSize(value);
      setPage(1);
    };

  // =========================
  // CATEGORY
  // =========================

  const handleCategoryChange =
    (value: string) => {
      setCategory(value);
      setPage(1);
    };

  // =========================
  // SORT
  // =========================

  const handleSortChange =
    (value: SortOption) => {
      setSort(value);
      setPage(1);
    };

  // =========================
  // PAGINATION
  // =========================

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        total / pageSize
      )
    );

  const startItem =
    total === 0
      ? 0
      : (page - 1) *
          pageSize +
        1;

  const endItem =
    total === 0
      ? 0
      : Math.min(
          page * pageSize,
          total
        );

  const goToPage =
    (newPage: number) => {

      const safePage =
        Math.min(
          Math.max(
            newPage,
            1
          ),
          totalPages
        );

      setPage(
        safePage
      );
    };

  // =========================
  // PAGE NUMBERS
  // =========================

  const getPageNumbers =
    () => {

      const pages: (
        | number
        | string
      )[] = [];

      if (
        totalPages <= 7
      ) {

        for (
          let i = 1;
          i <= totalPages;
          i++
        ) {
          pages.push(i);
        }

        return pages;
      }

      pages.push(1);

      if (page > 4) {
        pages.push("...");
      }

      const start =
        Math.max(
          2,
          page - 1
        );

      const end =
        Math.min(
          totalPages - 1,
          page + 1
        );

      for (
        let i = start;
        i <= end;
        i++
      ) {
        pages.push(i);
      }

      if (
        page <
        totalPages - 3
      ) {
        pages.push("...");
      }

      pages.push(
        totalPages
      );

      return pages;
    };

  // =========================
  // AUTH LOADING
  // =========================

  if (authChecking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100">

        <p className="text-gray-600">
          Checking authentication...
        </p>

      </main>
    );
  }

  // =========================
  // UI
  // =========================

  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-6">

      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div>

            <h1 className="text-3xl font-bold text-gray-800">
              Product Dashboard
            </h1>

            <p className="mt-1 text-gray-500">
              Manage your products
            </p>

          </div>

          <div className="flex gap-2">

            <button
              onClick={() =>
                router.push(
                  "/products/add"
                )
              }
              className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
            >
              + Add Product
            </button>

            <button
              onClick={
                handleLogout
              }
              className="rounded-lg bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700"
            >
              Logout
            </button>

          </div>

        </div>

        {/* SEARCH */}

        <div className="mb-5">

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            placeholder="Search products..."
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          />

        </div>

        {/* FILTER + SORT */}

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">

          <div>

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Category
            </label>

            <select
              value={category}
              onChange={(event) =>
                handleCategoryChange(
                  event.target.value
                )
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
            >

              <option value="">
                All Categories
              </option>

              {categories.map(
                (item) => (
                  <option
                    key={
                      item.slug
                    }
                    value={
                      item.slug
                    }
                  >
                    {item.name}
                  </option>
                )
              )}

            </select>

          </div>

          <div>

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Sort By
            </label>

            <select
              value={sort}
              onChange={(event) =>
                handleSortChange(
                  event.target
                    .value as SortOption
                )
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
            >

              <option value="">
                Default
              </option>

              <option value="price-asc">
                Price: Low to High
              </option>

              <option value="price-desc">
                Price: High to Low
              </option>

              <option value="rating-asc">
                Rating: Low to High
              </option>

              <option value="rating-desc">
                Rating: High to Low
              </option>

              <option value="title-asc">
                Title: A to Z
              </option>

              <option value="title-desc">
                Title: Z to A
              </option>

            </select>

          </div>

        </div>

        {/* LOADING */}

        {loading && (
          <div className="rounded-xl bg-white p-10 text-center shadow">

            <p className="text-gray-600">
              Loading products...
            </p>

          </div>
        )}

        {/* ERROR */}

        {!loading &&
          error && (
            <div className="rounded-xl bg-white p-10 text-center shadow">

              <p className="mb-4 text-red-500">
                {error}
              </p>

              <button
                onClick={() =>
                  window.location.reload()
                }
                className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
              >
                Retry
              </button>

            </div>
          )}

        {/* EMPTY */}

        {!loading &&
          !error &&
          products.length ===
            0 && (
            <div className="rounded-xl bg-white p-10 text-center shadow">

              <p className="text-gray-600">
                No products found.
              </p>

            </div>
          )}

        {/* PRODUCTS */}

        {!loading &&
          !error &&
          products.length > 0 && (
            <>

              {/* =========================
                  MOBILE CARDS
              ========================= */}

              <div className="space-y-4 md:hidden">

                {products.map(
                  (product) => (

                    <div
                      key={
                        product.id
                      }
                      className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
                    >

                      <div className="flex gap-4">

                        <img
                          src={
                            product.thumbnail
                          }
                          alt={
                            product.title
                          }
                          className="h-20 w-20 shrink-0 rounded-lg object-cover"
                        />

                        <div className="min-w-0 flex-1">

                          <button
                            onClick={() =>
                              router.push(
                                `/products/${product.id}`
                              )
                            }
                            className="text-left text-base font-semibold text-gray-900 hover:text-blue-600"
                          >
                            {
                              product.title
                            }
                          </button>

                          <p className="mt-1 text-sm text-gray-500">
                            {
                              product.category
                            }
                          </p>

                          <p className="mt-2 text-lg font-bold text-blue-600">
                            $
                            {
                              product.price
                            }
                          </p>

                        </div>

                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3">

                        <div className="rounded-lg bg-gray-50 p-3">

                          <p className="text-xs text-gray-500">
                            Rating
                          </p>

                          <p className="mt-1 font-semibold">
                            ⭐{" "}
                            {
                              product.rating
                            }
                          </p>

                        </div>

                        <div className="rounded-lg bg-gray-50 p-3">

                          <p className="text-xs text-gray-500">
                            Stock
                          </p>

                          <p className="mt-1 font-semibold">
                            {
                              product.stock
                            }
                          </p>

                        </div>

                      </div>

                      <div className="mt-4 flex gap-2">

                        <button
                          onClick={() =>
                            router.push(
                              `/products/edit/${product.id}`
                            )
                          }
                          className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(
                              product.id
                            )
                          }
                          className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                        >
                          Delete
                        </button>

                      </div>

                    </div>

                  )
                )}

              </div>

              {/* =========================
                  DESKTOP TABLE
              ========================= */}

              <div className="hidden overflow-hidden rounded-xl bg-white shadow md:block">

                <div className="overflow-x-auto">

                  <table className="w-full">

                    <thead className="bg-gray-100">

                      <tr>

                        <th className="whitespace-nowrap p-4 text-left">
                          Image
                        </th>

                        <th className="whitespace-nowrap p-4 text-left">
                          Title
                        </th>

                        <th className="whitespace-nowrap p-4 text-left">
                          Category
                        </th>

                        <th className="whitespace-nowrap p-4 text-left">
                          Price
                        </th>

                        <th className="whitespace-nowrap p-4 text-left">
                          Rating
                        </th>

                        <th className="whitespace-nowrap p-4 text-left">
                          Stock
                        </th>

                        <th className="whitespace-nowrap p-4 text-left">
                          Actions
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      {products.map(
                        (product) => (

                          <tr
                            key={
                              product.id
                            }
                            className="border-t hover:bg-gray-50"
                          >

                            <td className="p-4">

                              <img
                                src={
                                  product.thumbnail
                                }
                                alt={
                                  product.title
                                }
                                className="h-16 w-16 rounded-lg object-cover"
                              />

                            </td>

                            <td className="p-4 font-medium">

                              <button
                                onClick={() =>
                                  router.push(
                                    `/products/${product.id}`
                                  )
                                }
                                className="text-left hover:text-blue-600 hover:underline"
                              >
                                {
                                  product.title
                                }
                              </button>

                            </td>

                            <td className="p-4">
                              {
                                product.category
                              }
                            </td>

                            <td className="p-4">
                              $
                              {
                                product.price
                              }
                            </td>

                            <td className="p-4">
                              ⭐{" "}
                              {
                                product.rating
                              }
                            </td>

                            <td className="p-4">
                              {
                                product.stock
                              }
                            </td>

                            <td className="p-4">

                              <div className="flex gap-2">

                                <button
                                  onClick={() =>
                                    router.push(
                                      `/products/edit/${product.id}`
                                    )
                                  }
                                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                                >
                                  Edit
                                </button>

                                <button
                                  onClick={() =>
                                    handleDelete(
                                      product.id
                                    )
                                  }
                                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                                >
                                  Delete
                                </button>

                              </div>

                            </td>

                          </tr>

                        )
                      )}

                    </tbody>

                  </table>

                </div>

              </div>

              {/* =========================
                  PAGINATION
              ========================= */}

              <div className="mt-4 rounded-xl bg-white p-4 shadow">

                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                  <p className="text-sm text-gray-600">
                    Showing{" "}
                    {startItem}–
                    {endItem} of{" "}
                    {total}
                  </p>

                  <div className="flex flex-wrap items-center gap-2">

                    <select
                      value={
                        pageSize
                      }
                      onChange={(
                        event
                      ) =>
                        handlePageSizeChange(
                          Number(
                            event
                              .target
                              .value
                          )
                        )
                      }
                      className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                    >

                      <option value={10}>
                        10
                      </option>

                      <option value={20}>
                        20
                      </option>

                      <option value={50}>
                        50
                      </option>

                    </select>

                    <button
                      onClick={() =>
                        goToPage(
                          page - 1
                        )
                      }
                      disabled={
                        page === 1
                      }
                      className="rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Previous
                    </button>

                    <div className="flex items-center gap-1">

                      {getPageNumbers().map(
                        (
                          pageNumber,
                          index
                        ) => {

                          if (
                            pageNumber ===
                            "..."
                          ) {
                            return (
                              <span
                                key={`dots-${index}`}
                                className="px-2 text-gray-500"
                              >
                                ...
                              </span>
                            );
                          }

                          return (
                            <button
                              key={
                                pageNumber
                              }
                              onClick={() =>
                                goToPage(
                                  pageNumber as number
                                )
                              }
                              className={`rounded-lg px-3 py-2 text-sm ${
                                page ===
                                pageNumber
                                  ? "bg-blue-600 text-white"
                                  : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
                              }`}
                            >
                              {
                                pageNumber
                              }
                            </button>
                          );
                        }
                      )}

                    </div>

                    <button
                      onClick={() =>
                        goToPage(
                          page + 1
                        )
                      }
                      disabled={
                        page ===
                        totalPages
                      }
                      className="rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Next
                    </button>

                  </div>

                </div>

                <p className="mt-3 text-center text-sm text-gray-500">
                  Page{" "}
                  {page} of{" "}
                  {totalPages}
                </p>

              </div>

            </>
          )}

      </div>

    </main>
  );
}