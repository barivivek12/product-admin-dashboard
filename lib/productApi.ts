import api from "./axios";

// -----------------------------
// Product Type
// -----------------------------
export type Product = {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  rating: number;
  stock: number;
  thumbnail: string;
  images: string[];
};

// -----------------------------
// Product Form Data
// -----------------------------
export type ProductInput = {
  title: string;
  description: string;
  category: string;
  price: number;
  stock: number;
};

// -----------------------------
// Get All Products
// -----------------------------
export const getProducts = async (
  limit = 10,
  skip = 0
) => {
  const response = await api.get(
    `/products?limit=${limit}&skip=${skip}`
  );

  return response.data;
};

// -----------------------------
// Get Single Product
// -----------------------------
export const getProduct = async (
  id: number
) => {
  const response = await api.get(
    `/products/${id}`
  );

  return response.data;
};

// -----------------------------
// Add Product
// -----------------------------
export const addProduct = async (
  product: ProductInput
) => {
  const response = await api.post(
    "/products/add",
    product
  );

  return response.data;
};

// -----------------------------
// Update Product
// -----------------------------
export const updateProduct = async (
  id: number,
  product: ProductInput
) => {
  const response = await api.put(
    `/products/${id}`,
    product
  );

  return response.data;
};

// -----------------------------
// Delete Product
// -----------------------------
export const deleteProduct = async (
  id: number
) => {
  const response = await api.delete(
    `/products/${id}`
  );

  return response.data;
};