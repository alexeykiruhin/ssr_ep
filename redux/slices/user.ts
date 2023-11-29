import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {API} from '../../api/api';
import {editStatusType, HomePostType, sendScoreType} from '../../types/types';

export interface userType {
    isMe: boolean,
    userId: string | null,
    username: string,
    img: string,
    statusText: string,
    postsCount: number,
    rating: number,
    plus: number,
    minus: number,
    subscribers: number,
    isSubs: boolean,
    posts: Array<HomePostType>,
    status: 'idle' | 'loading' | 'succeeded' | 'failed',
    error: any
}

//Начальное значение
const initialState = {
    isMe: false,
    userId: null,
    username: '',
    img: '',
    statusText: '',
    postsCount: 0,
    rating: 0,
    plus: 0,
    minus: 0,
    subscribers: 0,
    isSubs: false,
    posts: [],
    status: 'idle', // 'idle', 'loading', 'succeeded', 'failed'
    error: null,
} as userType

//Проверка аутентификации
export const fetchUser = createAsyncThunk('user/fetchUser', async (userId: string | undefined) => {
    try {
        return await API.User.getUser(userId);
    } catch (error) {
        throw error;
    }
});

//Подписка
export const subscribed = createAsyncThunk('user/subscribe', async (userId: string | null) => {
    try {
        return await API.User.subscribe(userId);
    } catch (error) {
        throw error;
    }
});

//Отписка
export const unsubscribed = createAsyncThunk('user/unsubscribe', async (userId: string | null) => {
    try {
        return await API.User.unsubscribe(userId);
    } catch (error) {
        throw error;
    }
});

//Обновление рейтинга поста
export const changeUserRatingPost = createAsyncThunk('posts/changeRatingPost', async ({
                                                                                          postId,
                                                                                          score
                                                                                      }: sendScoreType) => {
    try {
        return await API.Post.sendScore({postId, score});
    } catch (error) {
        throw error;
    }
});
//Изменение статуса
export const editStatusText = createAsyncThunk('user/editStatus', async ({uid, text}: editStatusType) => {
    try {
        return await API.User.editStatus(uid, text);
    } catch (error) {
        throw error;
    }
});

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        // Добавляем редьюсер для изменения постов после удаления
        editPostList: (state, action) => {
            // state.posts = action.payload;
            console.log(`action.payload - ${action.payload}`)
            console.log(`filter - ${state.posts.filter((post)=> post.id !== action.payload)}`)
            state.posts = state.posts.filter((post)=> post.id !== action.payload)
        },
    },
    extraReducers: (builder) => {
        // Обработка fetchPosts
        builder
            .addCase(fetchUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.userId = action.payload.user_info.id;
                state.username = action.payload.user_info.username;
                state.statusText = action.payload.user_info.statusText;
                state.img = action.payload.user_info.img;
                state.postsCount = action.payload.user_info.postsCount;
                state.rating = action.payload.user_info.rating;
                state.minus = action.payload.user_info.minus;
                state.plus = action.payload.user_info.plus;
                state.subscribers = action.payload.user_info.subscribers;
                state.isMe = action.payload.isMe;
                state.isSubs = action.payload.user_info.isSubs;
                state.posts = action.payload.user_posts;
            })
            .addCase(fetchUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
        // Обработка subscribe
        builder
            .addCase(subscribed.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.isSubs = action.payload.subs
                state.subscribers = action.payload.subscribers
            })
        // Обработка unsubscribe
        builder
            .addCase(unsubscribed.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.isSubs = action.payload.isSubs
                state.subscribers = action.payload.subscribers
            })
        builder
            // Рейтинг поста
            .addCase(changeUserRatingPost.fulfilled, (state, action) => {
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
        // Обработка изменения статуса
        builder
            .addCase(editStatusText.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.statusText = action.payload.statusText
            })
    },
});

// Слайс генерирует действия, которые экспортируются отдельно
// Действия генерируются автоматически из имен ключей редьюсеров
export const {editPostList} = userSlice.actions;

// По умолчанию экспортируется редьюсер, сгенерированный слайсом
export default userSlice.reducer;