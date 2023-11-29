import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {API} from '../../api/api';
import {RatingUserType} from '../../types/types';

export interface ratingType {
    count: number
    users: RatingUserType[]
    status: 'idle' | 'loading' | 'succeeded' | 'failed'
    error: any
}

//Начальное значение
const initialState = {
    count: 0,
    users: [],
    status: 'idle', // 'idle', 'loading', 'succeeded', 'failed'
    error: null,
} as ratingType

//Получаем юзеров
export const fetchUsers = createAsyncThunk('rating/getUsers', async () => {
    try {
        return await API.Rating.getUsers();
    } catch (error) {
        throw error;
    }
});

const ratingSlice = createSlice({
    name: 'rating',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Обработка fetchPosts
            .addCase(fetchUsers.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.count = action.payload.count;
                state.users = action.payload.users;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
    },
});

// Слайс генерирует действия, которые экспортируются отдельно
// Действия генерируются автоматически из имен ключей редьюсеров
// export const { getPosts } = homeSlice.actions;

// По умолчанию экспортируется редьюсер, сгенерированный слайсом
export default ratingSlice.reducer;