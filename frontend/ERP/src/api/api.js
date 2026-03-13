/**
 * Centralized API service for the ERP frontend.
 * All requests use the VITE_API_BASE_URL env var (defaults to http://localhost:5000).
 * JWT token is read from localStorage key `erp_token`.
 */

const BASE_URL =
  (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '');

function getToken() {
  return localStorage.getItem('erp_token');
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = {
    ...(options.body && !(options.body instanceof FormData)
      ? { 'Content-Type': 'application/json' }
      : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    throw new Error(data?.message || `Request failed with status ${res.status}`);
  }

  return data;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authApi = {
  login: (email, password) =>
    request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (name, email, password) =>
    request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),

  forgotPassword: (email) =>
    request('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
};

// ─── Sales ────────────────────────────────────────────────────────────────────
export const salesApi = {
  getLeads: () => request('/api/sales/getleads'),

  createLead: (clientName, requirement) =>
    request('/api/sales/leads', {
      method: 'POST',
      body: JSON.stringify({ clientName, requirement }),
    }),

  getQuotationsByLead: (leadId) =>
    request(`/api/sales/leads/${leadId}/quotations`),

  createQuotation: (leadId, basePrice) =>
    request('/api/sales/quotations', {
      method: 'POST',
      body: JSON.stringify({ leadId, basePrice }),
    }),

  negotiateQuotation: (quotationId, negotiatedPrice, status) =>
    request(`/api/sales/quotations/${quotationId}/negotiate`, {
      method: 'PUT',
      body: JSON.stringify({ negotiatedPrice, status }),
    }),

  importLeadsFromExcel: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return request('/api/sales/import-excel', { method: 'POST', body: formData });
  },
};

// ─── Production / Sales Orders ────────────────────────────────────────────────
export const productionApi = {
  getAll: () => request('/api/production/sales-orders'),

  createSalesOrder: (quotationId) =>
    request('/api/production/sales-orders', {
      method: 'POST',
      body: JSON.stringify({ quotationId }),
    }),

  addBOM: (finishedProductId, materialId, quantityRequired) =>
    request('/api/production/bom', {
      method: 'POST',
      body: JSON.stringify({ finishedProductId, materialId, quantityRequired }),
    }),

  getBOMByProduct: (productId) =>
    request(`/api/production/bom/${productId}`),
};

// ─── Inventory ────────────────────────────────────────────────────────────────
export const inventoryApi = {
  getAll: () => request('/api/inventory/getall-inventory'),

  getById: (id) => request(`/api/inventory/get-inventory/${id}`),

  create: (name, sku, quantity, unit, type) =>
    request('/api/inventory/create-inventory', {
      method: 'POST',
      body: JSON.stringify({ name, sku, quantity, unit, type }),
    }),
};

// ─── Job Orders ───────────────────────────────────────────────────────────────
export const jobOrderApi = {
  getAll: () => request('/api/job-orders/getall'),

  create: (salesOrderId, productId, quantity) =>
    request('/api/job-orders/create-job-order', {
      method: 'POST',
      body: JSON.stringify({ salesOrderId, productId, quantity }),
    }),

  getBySalesOrder: (salesOrderId) =>
    request(`/api/job-orders/get-job-orders/${salesOrderId}`),

  getById: (id) => request(`/api/job-orders/get-job-order/${id}`),

  updateStatus: (id, status) =>
    request(`/api/job-orders/update-status/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),
};

// ─── Quality Checks ───────────────────────────────────────────────────────────
export const qualityCheckApi = {
  add: (jobOrderId, status, remarks) =>
    request('/api/quality-checks/add', {
      method: 'POST',
      body: JSON.stringify({ jobOrderId, status, remarks }),
    }),

  getByJobOrder: (jobOrderId) =>
    request(`/api/quality-checks/get/${jobOrderId}`),
};

// ─── Packing ──────────────────────────────────────────────────────────────────
export const packingApi = {
  create: (jobOrderId) =>
    request('/api/packing/create', {
      method: 'POST',
      body: JSON.stringify({ jobOrderId }),
    }),

  getByJobOrder: (jobOrderId) =>
    request(`/api/packing/get/${jobOrderId}`),
};

// ─── Shipping ─────────────────────────────────────────────────────────────────
export const shippingApi = {
  create: (salesOrderId, carrier, trackingNo) =>
    request('/api/shipping/create', {
      method: 'POST',
      body: JSON.stringify({ salesOrderId, carrier, trackingNo }),
    }),

  getBySalesOrder: (salesOrderId) =>
    request(`/api/shipping/get/${salesOrderId}`),

  updateStatus: (id, status) =>
    request(`/api/shipping/update-status/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),

  markDelivery: (shippingId) =>
    request('/api/shipping/delivery', {
      method: 'POST',
      body: JSON.stringify({ shippingId }),
    }),
};
