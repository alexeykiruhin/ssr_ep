import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {API} from '../../api/api';
import {LoginPass, returnFinishReg} from '../../types/types';

export interface authType {
    id: string | null,
    username: string,
    statusText: string,
    img: string,
    isAuth: boolean,
    access_token: string,
    status: 'idle' | 'loading' | 'succeeded' | 'failed',
    error: any
    rating: number
    minus: number
    plus: number
    subscribers: Array<number>
    isReg: boolean
}

//Начальное значение
const initialState = {
    id: null,
    username: '',
    statusText: '',
    img: '',
    isAuth: false,
    access_token: '',
    status: 'idle', // 'idle', 'loading', 'succeeded', 'failed'
    error: null,
    rating: 0,
    minus: 0,
    plus: 0,
    subscribers: [],
    isReg: false
} as authType

//Проверка аутентификации
export const checkAuth = createAsyncThunk('auth/checkAuth', async () => {
    try {
        return await API.Auth.checkAuth();
    } catch (error) {
        throw error;
    }
});

//Логин
export const login = createAsyncThunk('auth/login', async ({username, password}: LoginPass) => {
    try {
        let response = await API.Auth.login(username, password);
        let refresh_token = response.refresh_token;
        let access_token = response.access_token;
        localStorage.setItem('refresh_token', refresh_token);
        localStorage.setItem('access_token', access_token);
        return response;
    } catch (error) {
        console.log('ОШИБКА')
        throw error;
    }
});

//Логаут
export const logout = createAsyncThunk('auth/logout', async () => {
    try {
        return await API.Auth.logout();
    } catch (error) {
        throw error;
    }
});

//Registration
export const register = createAsyncThunk('auth/register', async ({
                                                                     email,
                                                                     username,
                                                                     password,
                                                                     agreement
                                                                 }: returnFinishReg) => {
    try {
        return await API.Auth.register({email, username, password, agreement});
    } catch (error) {
        console.log('ОШИБКА')
        throw error;
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Обработка fetchPosts
        builder
            .addCase(checkAuth.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.isAuth = action.payload.isAuth;
                state.username = action.payload.user_obj.username;
                state.statusText = action.payload.user_obj.statusText;
                state.img = action.payload.user_obj.img;
                state.id = action.payload.user_obj.id;
                state.rating = action.payload.user_obj.rating;
                state.minus = action.payload.user_obj.minus;
                state.plus = action.payload.user_obj.plus;
                state.subscribers = action.payload.user_obj.subscribers;
                state.access_token = action.payload.access_token;
            })
        // .addCase(checkAuth.rejected, (state, action) => {
        //     state.status = 'failed';
        //     state.error = action.error.message;
        // })
        // Обработка login
        builder
            .addCase(login.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(login.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.isAuth = action.payload.isAuth;
                state.username = action.payload.user_obj.username;
                state.statusText = action.payload.user_obj.statusText;
                state.img = action.payload.user_obj.img;
                state.id = action.payload.user_obj.id;
                state.rating = action.payload.user_obj.rating;
                state.minus = action.payload.user_obj.minus;
                state.plus = action.payload.user_obj.plus;
                state.subscribers = action.payload.user_obj.subscribers;
                state.access_token = action.payload.access_token;
            })
            .addCase(login.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
                console.log(action)
            })
        // Обработка logout
        builder
            .addCase(logout.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(logout.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // зануляем данные об аутентификации
                state.isAuth = false;
                state.username = '';
                state.statusText = '';
                state.img = '';
                state.id = '';
                state.rating = 0
                state.minus = 0
                state.plus = 0
                state.subscribers = []
                state.access_token = '';
                localStorage.removeItem('access_token');
            })
            .addCase(logout.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
        // Обработка login
        builder
            .addCase(register.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(register.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.isReg = action.payload.isReg;
                console.log(`reg: ${JSON.stringify(action.payload)}`)
                console.log(`reg: ${action.payload.isReg}`)
            })
    },
});

// Слайс генерирует действия, которые экспортируются отдельно
// Действия генерируются автоматически из имен ключей редьюсеров
// export const { getPosts } = homeSlice.actions;

// По умолчанию экспортируется редьюсер, сгенерированный слайсом
export default authSlice.reducer;