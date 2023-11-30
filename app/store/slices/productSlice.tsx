import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
export interface Product {
    id: number;
    name: string;
    description?: string;
    price: number;
    quantity: number;
}

interface ProductsState {
    items: Product[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    loading?: boolean;
    error?: string;
}


interface FetchProductsPayload {
    page: number;
    limit: number;
    search: string;
    sortBy: string;
    sortOrder: string;
    loading?: boolean;
    error?: string;
}


const initialState: ProductsState = {
    items: [],
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: 10,
    loading: false,
    error: ''
};


export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async ({ page, limit, search, sortBy, sortOrder }: FetchProductsPayload) => {
        const response = await fetch(`http://localhost:3001/api/products?page=${page}&limit=${limit}&search=${search}&sortBy=${sortBy}&sortOrder=${sortOrder}`);
        const data = await response.json();
        return data;
    }
);


export const addProduct = createAsyncThunk('products/addProduct', async (product: Product) => {
    const response = await fetch(`http://localhost:3001/api/products`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
    });
    const data = await response.json();
    return data;
});


export const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<{ products: Product[], totalItems: number, totalPages: number, currentPage: number, pageSize: number }>) => {
                state.loading = false;
                state.items = action.payload.products;
                state.totalItems = action.payload.totalItems;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
                state.pageSize = action.payload.pageSize;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || '';
            })
            .addCase(addProduct.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(addProduct.fulfilled, (state, action: PayloadAction<Product>) => {
                state.loading = false;
                state.items.push(action.payload);
            })
            .addCase(addProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || '';
            })
    }
})

export default productSlice.reducer
