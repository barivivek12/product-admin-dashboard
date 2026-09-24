# Product Admin Dashboard

A responsive Product Admin Dashboard built using Next.js, React, TypeScript, Tailwind CSS, and Axios.

This project was developed as a frontend assignment to demonstrate authentication, product management, search, filtering, sorting, pagination, responsive UI, API integration, and error handling.

---

## Live Demo

Coming soon...

---

## GitHub Repository

https://github.com/barivivek12/product-admin-dashboard

---

## Features

### Authentication

- User login using DummyJSON authentication API
- Demo login credentials
- Authentication token stored in localStorage
- Protected product dashboard
- Logout functionality
- Login error handling
- Prevents repeated login requests

### Product Dashboard

- Display product image
- Display product title
- Display category
- Display price
- Display rating
- Display stock
- Edit product
- Delete product
- Add new product
- Product details page

### Search

- Search products by name
- Uses DummyJSON search API
- Debounced search
- Search state stored in URL
- Search resets pagination to page 1
- Empty search result handling

### Category Filter

- Load available product categories
- Filter products by category
- Category state stored in URL

### Sorting

Products can be sorted by:

- Default
- Price: Low to High
- Price: High to Low
- Rating
- Title

Sorting state is stored in the URL.

### Pagination

The dashboard supports:

- Previous button
- Next button
- Page numbers
- Page size 10
- Page size 20
- Page size 50
- Current result range
- URL-based pagination
- Invalid page value handling

Example:

    /products?page=1&pageSize=10

### Responsive Design

The dashboard is responsive for desktop and mobile devices.

#### Desktop

Products are displayed in a table containing:

- Image
- Title
- Category
- Price
- Rating
- Stock
- Actions

#### Mobile

Products are displayed as responsive cards for better usability on smaller screens.

---

## Product Details

Each product has a dedicated details page.

Route:

    /products/[id]

The product details page displays:

- Product images
- Product title
- Description
- Category
- Price
- Rating
- Stock
- Brand
- Reviews

If an invalid product ID is entered, the application displays a Product Not Found state.

---

## Add Product

New products can be added from:

    /products/add

The form contains:

- Product title
- Description
- Category
- Price
- Stock

### Validation

The application validates:

- Product title is required
- Description is required
- Category is required
- Price must be valid
- Stock must be valid
- Negative values are rejected
- Repeated Save clicks are prevented

The added product is stored on the client side so that the change can be displayed in the application.

---

## Edit Product

Products can be edited from:

    /products/edit/[id]

The edit form allows the user to update product information.

The form includes:

- Product title
- Description
- Category
- Price
- Stock
- Validation
- Loading state
- Save button protection

---

## Delete Product

Products can be deleted from the dashboard.

Before deleting a product, the application asks for confirmation to prevent accidental deletion.

The deleted product is removed from the application.

---

## URL State Management

The dashboard keeps important state in the URL.

### Pagination

    /products?page=1&pageSize=10

### Search

    /products?page=1&pageSize=10&search=phone

### Category

    /products?page=1&pageSize=10&category=beauty

### Sorting

    /products?page=1&pageSize=10&sort=price-asc

### Combined Example

    /products?page=1&pageSize=10&search=phone&category=beauty&sort=price-asc

This makes the current dashboard state shareable and refresh-friendly.

---

## API

This project uses the DummyJSON API.

### Authentication

    POST /auth/login

### Get Products

    GET /products

### Search Products

    GET /products/search?q=

### Get Categories

    GET /products/categories

### Get Products by Category

    GET /products/category/:category

### Get Product Details

    GET /products/:id

### Add Product

    POST /products/add

### Update Product

    PUT /products/:id

### Delete Product

    DELETE /products/:id

---

## Demo Login Credentials

Use the following credentials to log in:

    Username: emilys
    Password: emilyspass

---

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Axios
- DummyJSON API
- Git
- GitHub
- Vercel

---

## Project Structure

    product-admin-dashboard/
    │
    ├── app/
    │   ├── products/
    │   │   ├── [id]/
    │   │   │   └── page.tsx
    │   │   │
    │   │   ├── add/
    │   │   │   └── page.tsx
    │   │   │
    │   │   ├── edit/
    │   │   │   └── [id]/
    │   │   │       └── page.tsx
    │   │   │
    │   │   └── page.tsx
    │   │
    │   ├── page.tsx
    │   ├── layout.tsx
    │   └── globals.css
    │
    ├── lib/
    │   ├── axios.ts
    │   └── productApi.ts
    │
    ├── public/
    │
    ├── .gitignore
    ├── package.json
    ├── package-lock.json
    ├── next.config.ts
    ├── postcss.config.mjs
    ├── tsconfig.json
    └── README.md

---

## Axios Configuration

The project uses a shared Axios instance.

The Axios configuration handles:

- DummyJSON base URL
- JSON request headers
- Authentication token
- Centralized API error handling

The authentication token is automatically added to API requests when the user is logged in.

---

## Loading States

The application provides loading states while API requests are being processed.

Examples include:

- Login loading
- Product loading
- Add Product saving
- Edit Product saving

Repeated button clicks are prevented while requests are in progress.

---

## Error Handling

The application handles:

- Invalid login credentials
- API request failures
- Invalid product IDs
- Empty search results
- Empty product results
- Invalid URL parameters
- Loading states
- Retry actions

When an API request fails, an appropriate error state is displayed to the user.

---

## Search Debouncing

The search input uses a debounce mechanism.

Instead of making an API request for every keystroke, the application waits until the user stops typing before performing the search.

This reduces unnecessary API requests and provides a better user experience.

---

## Search Request Handling

The application also handles fast search changes so that an older request does not incorrectly replace the latest search result.

This is especially useful when API responses are delayed.

---

## DummyJSON Mutation Limitation

DummyJSON simulates POST, PUT, and DELETE operations.

These operations do not permanently modify the DummyJSON database.

Therefore, the application maintains the user-facing changes on the client side where required.

### Add

A newly added product is stored locally and displayed in the application.

### Edit

Edited product information is reflected in the application.

### Delete

Deleted products are removed from the application.

This behavior is documented because the API itself does not provide permanent persistence for these mutations.

---

## Category + Search Handling

DummyJSON does not provide a single endpoint that directly combines search and category filtering.

Therefore, the application handles this situation on the client side when both search and category filters are active.

---

## Responsive UI

### Desktop Layout

The desktop dashboard uses a product table.

    Image | Title | Category | Price | Rating | Stock | Actions

### Mobile Layout

The mobile dashboard uses product cards.

    Product Image
    Product Title
    Category
    Price
    Rating
    Stock

    Edit | Delete

This prevents the desktop table from becoming difficult to use on small screens.

---

## Getting Started

### Prerequisites

Make sure you have Node.js installed on your system.

### Clone the Repository

    git clone https://github.com/barivivek12/product-admin-dashboard.git

### Navigate to the Project

    cd product-admin-dashboard

### Install Dependencies

    npm install

### Start Development Server

    npm run dev

### Open in Browser

    http://localhost:3000

---

## Production Build

To create a production build:

    npm run build

To start the production server:

    npm start

---

## Deployment

The application will be deployed using Vercel.

Live deployment link:

    Coming soon...

Once deployed, the live URL will be added here.

---

## GitHub

Repository:

https://github.com/barivivek12/product-admin-dashboard

The repository contains the complete source code and project documentation.

---

## AI Usage

AI tools were used during development for:

- Understanding implementation approaches
- Debugging errors
- Troubleshooting API integration
- Improving code structure
- Understanding React and Next.js concepts
- Reviewing responsive UI behavior

All AI-assisted code was reviewed, tested, and understood before being used in the project.

---

## Development Notes

This project focuses on:

- Clean React component structure
- Responsive design
- API integration
- User experience
- Error handling
- URL state management
- Client-side state management
- Maintainable project organization

---

## What I Learned

Through this project, I practiced:

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Axios
- REST API integration
- Authentication
- CRUD operations
- Product search
- Debouncing
- Category filtering
- Sorting
- Pagination
- URL state management
- Responsive UI development
- Error handling
- Git and GitHub
- Deployment preparation

---

## Author

### Vivek Bari

B.Tech Computer Science Engineering

GitHub:

https://github.com/barivivek12

---

## Assignment Summary

This project implements a Product Admin Dashboard with authentication and product management functionality using:

- Next.js
- React
- Tailwind CSS
- Axios
- DummyJSON API

The application includes responsive desktop and mobile layouts, product CRUD operations, search, filtering, sorting, pagination, URL state management, loading states, and error handling.

---

## Status

### Completed

- [x] Login
- [x] Authentication
- [x] Product dashboard
- [x] Product search
- [x] Category filtering
- [x] Sorting
- [x] Pagination
- [x] Responsive desktop table
- [x] Responsive mobile cards
- [x] Product details
- [x] Add Product
- [x] Edit Product
- [x] Delete Product
- [x] Loading states
- [x] Error states
- [x] Retry
- [x] URL state
- [x] GitHub repository
- [ ] Vercel deployment
- [ ] Live demo URL