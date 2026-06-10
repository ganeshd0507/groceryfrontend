import axios from 'axios';
import { PRODUCTS, CATEGORIES } from '../services/mockData';
import { store } from '../redux/store';

const useMockApi = import.meta.env.VITE_USE_MOCK_API !== 'false';

// Create a custom Axios instance
// const apiClient = axios.create({
//   baseURL: useMockApi 
//     ? 'https://api.grocerydelivery.mock/v1'
//     : 'http://localhost:8080/api/v1',
//   timeout: 10000,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

const apiClient = axios.create({
  baseURL: useMockApi
    ? 'https://api.grocerydelivery.mock/v1'
    : 'https://grocerybackend-i2k6.onrender.com/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});


// Axios request interceptor to automatically attach authorization header
apiClient.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Mock database in memory for CRUD actions
let localProducts = [...PRODUCTS];
let localCategories = [...CATEGORIES];
let localOrders = [
  {
    id: 'ORD-1002',
    date: '2026-06-02T14:30:00Z',
    items: [
      { id: '1', name: 'Fresh Guava', price: 34, quantity: 2 },
      { id: '5', name: 'Amul Table Butter', price: 56, quantity: 1 }
    ],
    subtotal: 124,
    delivery: 25,
    discount: 0,
    total: 149,
    status: 'Delivered',
    address: 'DLF Phase 3, Gurgaon, Haryana',
    paymentMethod: 'UPI',
    slot: 'Instant 10-Min'
  },
  {
    id: 'ORD-1001',
    date: '2026-05-28T09:15:00Z',
    items: [
      { id: '4', name: 'Organic Banana (Robusta)', price: 35, quantity: 1 }
    ],
    subtotal: 35,
    delivery: 25,
    discount: 5,
    total: 55,
    status: 'Delivered',
    address: 'DLF Phase 3, Gurgaon, Haryana',
    paymentMethod: 'Cash on Delivery',
    slot: 'Morning 7-9 AM'
  }
];

// Helper to simulate network latency (300ms)
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Custom adapter to mock all requests instead of hitting a real server
if (useMockApi) {
  apiClient.defaults.adapter = async (config) => {
  await delay(350); // Simulate network lag

  const { url, method, data } = config;
  const parsedData = data ? JSON.parse(data) : {};

  // GET /products
  if (/\/products(\?|$)/.test(url) && method === 'get') {
    return {
      data: localProducts,
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
    };
  }

  // GET /products/:id
  const productDetailMatch = url.match(/\/products\/([a-zA-Z0-9-]+)/);
  if (productDetailMatch && method === 'get') {
    const prodId = productDetailMatch[1];
    const item = localProducts.find(p => p.id === prodId);
    if (item) {
      return {
        data: item,
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      };
    } else {
      return {
        status: 404,
        statusText: 'Not Found',
        headers: {},
        config,
        data: { message: 'Product not found' }
      };
    }
  }

  // POST /products (Admin - Add product)
  if (url.includes('/products') && method === 'post') {
    const newProduct = {
      id: String(localProducts.length + 1),
      reviewsCount: 0,
      rating: 5.0,
      inStock: true,
      images: [parsedData.image],
      ...parsedData
    };
    localProducts.unshift(newProduct);
    return {
      data: newProduct,
      status: 201,
      statusText: 'Created',
      headers: {},
      config
    };
  }

  // PUT /products/:id (Admin - Update product)
  const productUpdateMatch = url.match(/\/products\/([a-zA-Z0-9-]+)/);
  if (productUpdateMatch && method === 'put') {
    const prodId = productUpdateMatch[1];
    const index = localProducts.findIndex(p => p.id === prodId);
    if (index !== -1) {
      localProducts[index] = { ...localProducts[index], ...parsedData };
      return {
        data: localProducts[index],
        status: 200,
        statusText: 'OK',
        headers: {},
        config
      };
    }
  }

  // DELETE /products/:id (Admin - Delete product)
  const productDeleteMatch = url.match(/\/products\/([a-zA-Z0-9-]+)/);
  if (productDeleteMatch && method === 'delete') {
    const prodId = productDeleteMatch[1];
    localProducts = localProducts.filter(p => p.id !== prodId);
    return {
      data: { success: true },
      status: 200,
      statusText: 'OK',
      headers: {},
      config
    };
  }

  // GET /categories
  if (url.includes('/categories') && method === 'get') {
    return {
      data: localCategories,
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
    };
  }

  // POST /categories
  if (url.includes('/categories') && method === 'post') {
    const newCategory = {
      id: parsedData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name: parsedData.name,
      image: parsedData.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=200',
      count: parsedData.count ? Number(parsedData.count) : 0,
    };
    localCategories.push(newCategory);
    return {
      data: newCategory,
      status: 201,
      statusText: 'Created',
      headers: {},
      config,
    };
  }

  // POST /orders (Place order)
  if (url.includes('/orders') && method === 'post') {
    const orderId = 'ORD-' + Math.floor(1000 + Math.random() * 9000);
    const newOrder = {
      id: orderId,
      date: new Date().toISOString(),
      status: 'Processing',
      ...parsedData
    };
    localOrders.unshift(newOrder);
    return {
      data: newOrder,
      status: 201,
      statusText: 'Created',
      headers: {},
      config,
    };
  }

  // GET /orders
  if (url.includes('/orders') && method === 'get') {
    return {
      data: localOrders,
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
    };
  }

  // PUT /orders/:id (Update status - Admin)
  const orderUpdateMatch = url.match(/\/orders\/([a-zA-Z0-9-]+)/);
  if (orderUpdateMatch && method === 'put') {
    const orderId = orderUpdateMatch[1];
    const index = localOrders.findIndex(o => o.id === orderId);
    if (index !== -1) {
      localOrders[index] = { ...localOrders[index], status: parsedData.status };
      return {
        data: localOrders[index],
        status: 200,
        statusText: 'OK',
        headers: {},
        config
      };
    }
  }

  // POST /auth/login
  if (url.includes('/auth/login') && method === 'post') {
    const { email, password } = parsedData;
    if (email && password) {
      return {
        data: {
          user: {
            name: 'Alex Mercer',
            email: email,
            phone: '+91 98765 43210',
            savedAddresses: [
              { id: '1', tag: 'Home', address: 'Apartment 402, DLF Phase 3, Gurgaon, Haryana' },
              { id: '2', tag: 'Office', address: 'Tech Park Tower B, Cyber City, Gurgaon, Haryana' }
            ],
            wishlist: ['1', '4']
          },
          token: 'mock-jwt-token-12345'
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      };
    }
  }

  // POST /auth/register
  if (url.includes('/auth/register') && method === 'post') {
    return {
      data: {
        user: {
          name: parsedData.name || 'New User',
          email: parsedData.email,
          phone: parsedData.phone || '+91 99999 88888',
          savedAddresses: [],
          wishlist: []
        },
        token: 'mock-jwt-token-67890'
      },
      status: 201,
      statusText: 'Created',
      headers: {},
      config,
    };
  }

  // Default Fallback
  return {
    status: 404,
    statusText: 'Not Found',
    headers: {},
    config,
    data: { message: 'Mock API path not handled' }
  };
};
}

export default apiClient;
