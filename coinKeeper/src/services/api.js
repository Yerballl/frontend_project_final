import axios from 'axios';

export const apiClient = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: { 'Content-Type': 'application/json' }
});

const token = localStorage.getItem('authToken');
if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export const setAuthToken = (token) => {
    if (token) {
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        localStorage.setItem('authToken', token);
    } else {
        delete apiClient.defaults.headers.common['Authorization'];
        localStorage.removeItem('authToken');
    }
};

// --- USER AUTH ---
export const loginUser = async (credentials) => {
    try {
        const response = await apiClient.post(`/users/login`, credentials);
        if (response.data.token) setAuthToken(response.data.token);
        return response.data;
    } catch (error) { console.error("Login API error:", error.response || error.message); throw error; }
};
export const registerUser = async (userData) => {
    try {
        const response = await apiClient.post(`/users/register`, userData);
        if (response.data.token) setAuthToken(response.data.token);
        return response.data;
    } catch (error) { console.error("Register API error:", error.response || error.message); throw error; }
};
export const fetchUserProfile = async () => {
    try {
        const response = await apiClient.get('/users/me');
        return response.data;
    } catch (error) { console.error("Fetch profile error:", error.response || error.message); throw error; }
};
export const logoutUser = async () => {
    try { setAuthToken(null); return { success: true }; }
    catch (error) { console.error("Logout error:", error.response || error.message); setAuthToken(null); throw error; }
};

// --- CATEGORIES ---
export const fetchRawCategories = async () => { /* ... existing code ... */ };
export const fetchCategoriesWithSummary = async () => {
    try {
        const response = await apiClient.get('/categories/summary');
        return response.data;
    } catch (error) { console.error("Fetch categories with summary API error:", error.response || error.message); throw error; }
};
export const addCategory = async (categoryData) => { /* ... existing code ... */ };
export const updateCategory = async (categoryId, categoryData) => { /* ... existing code ... */ };
export const deleteCategory = async (categoryId) => { /* ... existing code ... */ };


// --- ACCOUNTS ---
export const fetchAccounts = async () => {
    try {
        const response = await apiClient.get('/accounts');
        return response.data; // Expects accounts with calculated balances
    } catch (error) {
        console.error("Fetch accounts API error:", error.response || error.message);
        throw error;
    }
};

export const addAccount = async (accountData) => {
    try {
        const response = await apiClient.post('/accounts', accountData);
        return response.data;
    } catch (error) {
        console.error("Add account API error:", error.response || error.message);
        throw error;
    }
};

export const updateAccount = async (accountId, accountData) => {
    try {
        const response = await apiClient.put(`/accounts/${accountId}`, accountData);
        return response.data;
    } catch (error) {
        console.error("Update account API error:", error.response || error.message);
        throw error;
    }
};

export const deleteAccount = async (accountId) => {
    try {
        // Backend should return { message: '...', id: accountId }
        const response = await apiClient.delete(`/accounts/${accountId}`);
        return { ...response.data, id: accountId }; // Ensure ID is part of the resolved value for slice
    } catch (error) {
        console.error("Delete account API error:", error.response || error.message);
        throw error;
    }
};


// --- TRANSACTIONS ---
export const fetchTransactions = async (filters = {}) => {
    try {
        const queryParams = new URLSearchParams();
        if (filters.limit) queryParams.append('limit', filters.limit);
        if (filters.offset) queryParams.append('offset', filters.offset);
        if (filters.startDate) queryParams.append('startDate', filters.startDate);
        if (filters.endDate) queryParams.append('endDate', filters.endDate);
        if (filters.type) queryParams.append('type', filters.type);
        if (filters.categoryId) queryParams.append('categoryId', filters.categoryId);
        if (filters.account_id) queryParams.append('account_id', filters.account_id); // Add account_id filter

        const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
        const response = await apiClient.get(`/transactions${query}`);
        return response.data;
    } catch (error) { console.error("Fetch transactions API error:", error.response || error.message); throw error; }
};

export const addTransaction = async (transactionData) => {
    try {
        // Ensure account_id is part of transactionData from the modal
        const formattedData = {
            account_id: transactionData.accountId, // Ensure this matches field from modal
            category_id: transactionData.categoryId,
            type: transactionData.type,
            amount: Math.abs(parseFloat(transactionData.amount)),
            transaction_date: transactionData.date,
            comment: transactionData.comment
        };
        const response = await apiClient.post('/transactions', formattedData);
        return response.data;
    } catch (error) { console.error("Add transaction API error:", error.response || error.message); throw error; }
};

export const updateTransaction = async (transactionId, transactionData) => {
    try {
        const formattedData = {};
        if (transactionData.accountId !== undefined) formattedData.account_id = transactionData.accountId;
        if (transactionData.categoryId !== undefined) formattedData.category_id = transactionData.categoryId;
        if (transactionData.type !== undefined) formattedData.type = transactionData.type;
        if (transactionData.amount !== undefined) formattedData.amount = Math.abs(parseFloat(transactionData.amount));
        if (transactionData.date !== undefined) formattedData.transaction_date = transactionData.date;
        if (transactionData.comment !== undefined) formattedData.comment = transactionData.comment;

        const response = await apiClient.put(`/transactions/${transactionId}`, formattedData);
        return response.data;
    } catch (error) { console.error("Update transaction API error:", error.response || error.message); throw error; }
};

export const deleteTransaction = async (transactionId) => {
    try {
        const response = await apiClient.delete(`/transactions/${transactionId}`);
        return response.data;
    } catch (error) { console.error("Delete transaction API error:", error.response || error.message); throw error; }
};