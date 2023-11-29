import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {API} from '../../api/api';
import {HomePostType, sendScoreType} from '../../types/types';

export interface homeType {
    posts: Array<HomePostType>// | Array<null>,
    status: 'idle' | 'loading' | 'succeeded' | 'failed',
    error: any
}

//Начальное значение
const initialState = {
    posts: [],
    status: 'idle', // 'idle', 'loading', 'succeeded', 'failed'
    error: null,
} as homeType

//Получаем посты
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
    try {
        return await API.Home.getPosts(1, 5);
    } catch (error) {
        throw error;
    }
});

//Получаем посты юзеров на кого подписан
export const fetchSubPosts = createAsyncThunk('posts/fetchSubPosts', async () => {
    try {
        // const response: ApiResponse = await API.Home.getPosts(1,5);
        // return response;
        console.log('sub');
        return await API.Home.getSubPosts(1, 5);
    } catch (error) {
        throw error;
    }
});

//Обновление рейтинга поста
export const changeRatingPost = createAsyncThunk('posts/changeRatingPost', async ({postId, score}: sendScoreType) => {
    try {
        return await API.Post.sendScore({postId, score});
    } catch (error) {
        throw error;
    }
});

const homeSlice = createSlice({
    name: 'home',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Обработка fetchPosts
            .addCase(fetchPosts.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.posts = action.payload;
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            //Обработка fetchSubPosts
            .addCase(fetchSubPosts.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchSubPosts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.posts = action.payload.posts;
            })
            .addCase(fetchSubPosts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            // Рейтинг поста
            .addCase(changeRatingPost.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // state.posts = action.payload.posts;
                // находим индекс поста по его айди
                const postIndex = state.posts?.findIndex((p) => {
                    return p?.id === action.payload.new_rating.post_id
                })
                // console.log(postIndex)
                // обновляем найденный пост
                const updatedPost = {
                    ...state.posts[postIndex],
                    rating: action.payload.new_rating.result
                };
                // обновляем массив постов по частям
                const updatedPosts = [
                    ...state.posts.slice(0, postIndex),
                    updatedPost,
                    ...state.posts.slice(postIndex + 1)
                ];
                state.posts = updatedPosts
            })
    },
});

// Слайс генерирует действия, которые экспортируются отдельно
// Действия генерируются автоматически из имен ключей редьюсеров
// export const { getPosts } = homeSlice.actions;

// По умолчанию экспортируется редьюсер, сгенерированный слайсом
export default homeSlice.reducer;