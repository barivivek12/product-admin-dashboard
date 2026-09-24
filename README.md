# Product Admin Dashboard

A responsive Product Admin Dashboard built with **Next.js, React, TypeScript, Tailwind CSS, Axios, and DummyJSON API**.

The application provides authentication and product management features including search, filtering, sorting, pagination, product details, add, edit, and delete operations.

## Live Demo

https://product-admin-dashboard-three-coral.vercel.app

## GitHub Repository

https://github.com/barivivek12/product-admin-dashboard

---

## Features

### Authentication

- Login using DummyJSON authentication API
- Demo login credentials
- Invalid credential error handling
- Authentication token stored in `localStorage`
- Protected product management pages
- Logout functionality
- Prevents repeated login submissions

### Product Management

- View all products
- Product image
- Product title
- Category
- Price
- Rating
- Stock
- Product details page
- Add product
- Edit product
- Delete product
- Delete confirmation dialog

### Search, Filter & Sort

- Product search
- Debounced search
- Category filtering
- Sort by price, rating, and title
- Search and filter state reflected in the URL

### Pagination

- Page-based pagination
- Previous and Next buttons
- Page numbers
- Page size options:
  - 10
  - 20
  - 50
- URL-based pagination state

### Responsive Design

- Desktop product table
- Mobile product cards
- Responsive search, filter, sorting, and pagination controls

### Error & Loading Handling

- Loading states
- Empty states
- API error handling
- Retry functionality
- Invalid product ID handling
- Invalid URL parameter handling

---

## Tech Stack

- **Next.js**
- **React**
- **TypeScript**
- **Tailwind CSS**
- **Axios**
- **DummyJSON API**
- **Git**
- **GitHub**
- **Vercel**

---

## Demo Credentials

```text
Username: emilys
Password: emilyspass
```

---

## API Endpoints

This project uses the DummyJSON API for authentication and product operations.

### Authentication

```text
POST /auth/login
```

### Products

```text
GET /products
GET /products/search?q=
GET /products/categories
GET /products/category/{category}
GET /products/{id}
POST /products/add
PUT /products/{id}
DELETE /products/{id}
```

---

## Project Structure

```text
product-admin-dashboard/
│
├── app/
│   ├── products/
│   │   ├── [id]/
│   │   │   └── page.tsx
│   │   ├── add/
│   │   │   └── page.tsx
│   │   ├── edit/
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   └── page.tsx
│   │
│   ├── icon.svg
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── lib/
│   ├── axios.ts
│   └── productApi.ts
│
├── public/
│
├── package.json
├── package-lock.json
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
├── eslint.config.mjs
└── README.md
```

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/barivivek12/product-admin-dashboard.git
```

### 2. Navigate to the project

```bash
cd product-admin-dashboard
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

### 5. Open the application

```text
http://localhost:3000
```

---

## Authentication

The application uses the DummyJSON authentication API.

After successful login:

1. The application sends the username and password to the authentication endpoint.
2. The returned authentication token is stored in `localStorage`.
3. The token is attached to API requests through the shared Axios configuration.
4. Product management pages require authentication.
5. Users can log out from the dashboard.

---

## Search

The dashboard provides product search using the DummyJSON search endpoint.

Search input uses debouncing to reduce unnecessary API requests while the user is typing.

The application also handles fast typing so that older search results do not replace newer search results.

---

## Category Filtering

Products can be filtered using the available product categories.

The dashboard retrieves categories from the DummyJSON API and provides them through a category dropdown.

---

## Sorting

Products can be sorted by:

- Price
- Rating
- Title

Sorting is handled through the dashboard controls and reflected in the application state.

---

## Pagination

The product dashboard supports pagination using:

- Page number
- Page size
- Previous button
- Next button

Available page sizes:

```text
10
20
50
```

Example URL:

```text
/products?page=2&pageSize=20
```

The current pagination state is preserved in the URL.

---

## URL State

The dashboard keeps important state in the URL, including:

- Page
- Page size
- Search
- Category
- Sort

Example:

```text
/products?page=1&pageSize=10&search=phone
```

This allows the current dashboard state to be preserved when navigating or refreshing the page.

---

## Product Details

Each product has a dedicated details page.

The details page displays:

- Product images
- Product title
- Description
- Price
- Rating
- Stock
- Category
- Product reviews

Example:

```text
/products/1
```

Invalid product IDs are handled with a Product Not Found state.

---

## Add Product

Users can add a new product through the Add Product page.

The form includes validation before submitting product data.

Example route:

```text
/products/add
```

---

## Edit Product

Existing products can be edited through the Edit Product page.

The application loads the selected product and allows the user to update its information.

Example route:

```text
/products/edit/1
```

---

## Delete Product

Products can be deleted from the dashboard.

Before deletion, the application displays a confirmation step to prevent accidental deletion.

---

## Axios Configuration

The application uses a shared Axios instance for API communication.

The shared configuration provides:

- Common API base URL
- JSON request headers
- Authentication token handling
- Centralized API error handling

---

## Responsive Design

### Desktop

Products are displayed in a table containing:

- Image
- Title
- Category
- Price
- Rating
- Stock
- Actions

### Mobile

Products are displayed as individual responsive cards.

The dashboard is designed to remain usable on smaller screens.

---

## Error Handling

The application handles common error scenarios including:

- Invalid login credentials
- Failed API requests
- Loading states
- Empty search results
- Invalid product IDs
- Invalid URL parameters
- Retry actions
- Delete confirmation
- Repeated form submissions

---

## DummyJSON Limitation

This project uses DummyJSON as a mock API.

Product creation, updating, and deletion are simulated operations and are not permanently persisted on the server.

The application handles the UI state so that product changes can be reflected during the current application session.

---

## AI Usage

AI tools were used during development for:

- Understanding implementation approaches
- Debugging errors
- Understanding API integration
- Reviewing implementation ideas
- Improving responsive UI
- Troubleshooting development issues

AI-generated suggestions were reviewed, modified where required, and tested in the application.

The implementation can be explained during a technical walkthrough.

---

## Testing Checklist

The application was tested for:

- Successful login
- Invalid login credentials
- Protected routes
- Logout
- Product listing
- Product search
- Debounced search
- Category filtering
- Sorting
- Pagination
- Page size changes
- Product details
- Invalid product ID
- Add product
- Edit product
- Delete product
- Delete confirmation
- Loading states
- Error states
- Retry functionality
- Responsive mobile layout

---

## Deployment

The application is deployed using **Vercel**.

### Production URL

https://product-admin-dashboard-three-coral.vercel.app

The project is connected to the GitHub repository, allowing new commits pushed to the repository to trigger new deployments.

---

## Author

**Vivek Bari**

B.Tech Computer Science Engineering

GitHub:

https://github.com/barivivek12

---

## Assignment

This project was developed as a frontend Product Admin Dashboard assignment using:

- Next.js
- React
- TypeScript
- Axios
- Tailwind CSS
- DummyJSON API

The project focuses on responsive UI development, API integration, authentication, product management, URL state management, pagination, search, filtering, sorting, error handling, and deployment.