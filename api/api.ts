import axios, {AxiosInstance} from 'axios';
import {PostDataType, returnFinishReg, sendScoreType} from '../types/types';

// export const BASE_URL: 'http://127.0.0.1:5000/api/' = 'http://127.0.0.1:5000/api/';
// export const BASE_URL: 'https://45.142.36.60:5000/api/' = 'https://45.142.36.60:5000/api/';
export const BASE_URL: 'https://trendtide.ru/api/' = 'https://trendtide.ru/api/';

// Добавляем заголовки в запросы на сервер
const instance: AxiosInstance = axios.create({
    withCredentials: true,
    baseURL: BASE_URL
});

//Перехват запроса для добавления токена авторизации
instance.interceptors.request.use((config) => {
    const access_token = localStorage.getItem('access_token');
    config.headers.Authorization = `Bearer ${access_token}`;
    return config
})

instance.interceptors.response.use(
    (config) => {
        // console.log('interceptor');
        return config
    },
    async (error) => {
        const originalRequest = error.config;
        console.log(`error status - ${error.response.status}`);
        if (error.response.status === 401) {
            try {
                await axios.get(`${BASE_URL}refresh`, {
                    withCredentials: true,
                    // headers: {'Authorization': `Bearer ${localStorage.getItem('refresh_token')}`}
                }).then((response) => {
                    localStorage.setItem('access_token', response.data.access_token);
                    console.log('set access');
                    return response.data
                }).catch((error) => {
                    console.log(`ошибка - ${error.response.status}`);
                    console.log(`ошибка - logoutThunk`);
                });
                console.log('set local');
                console.log(originalRequest.url);
                if (originalRequest.url !== 'login') {
                    return instance.request(originalRequest);
                }

            } catch (error) {
                console.log('Ошибка авторизации', error);
                // store.dispatch(setInfo(false, { id: null, img: null, username: '' })); // тут нужно затереть данные в auth
                // попробовать затереть локалсторедж ацесс токен
                // window.location.href = '/login';
                return Promise.reject(error);
            }
        } else {
            // window.location.href = '/login';
            console.log('ошибка если удален рефреш токен, после логаута если пойти на страницу защищенную');
            return null
        }
    }
)

export const API = {
    Home: {
        async getPosts(currentPage: number, pageSize: number) {
            const response = await instance.get(`posts?page=${currentPage}&page_size=${pageSize}`);
            return response.data;
        },
        async getSubPosts(currentPage: number, pageSize: number) {
            const response = await instance.get(`subs_posts?page=${currentPage}&page_size=${pageSize}`);
            return response.data;
        },
    },
    Auth: {
        async checkAuth() {
            // console.log('checkAuth');
            const response = await axios.get(`${BASE_URL}refresh`, {
                withCredentials: true,
            });
            return response.data;
        },
        async login(username: string, password: string) {
            const response = await instance.post(`login`, {
                username: username,
                password: password
            });
            return response.data;
        },
        async logout() {
            const response = await instance.get(`logout`);
            return response.data;
        },
        async register({email, username, password, agreement}: returnFinishReg) {
            const response = await instance.post(`register`, {
                email,
                username,
                password,
                agreement
            });
            return response.data;
        },
    },
    Rating: {
        async getUsers() {
            const response = await instance.get(`users`);
            return response.data;
        }
    },
    User: {
        // получить данные о юзере
        async getUser(userId: string | undefined) {
            const response = await instance.get(`user/${userId}`);
            return response.data;
        },
        // подписка на юзера
        async subscribe(userId: string | null) {
            const response = await instance.put(`subscribe`, {
                to_user_id: userId
            });
            return response.data;
        },
        // отписка от юзера
        async unsubscribe(userId: string | null) {
            const response = await instance.put(`unsubscribe`, {
                to_user_id: userId
            });
            return response.data;
        },
        async editStatus(userId: string | undefined, statusText: string | null) {
            const response = await instance.post(`user/${userId}`, {
                statusText: statusText,
            });
            return response.data;
        },
    },
    Post: {
        async sendScore({postId, score}: sendScoreType) {
            const response = await instance.put(`post_rating`, {
                post_id: postId,
                score: score
            });
            return response.data;
        },
        async createPost(postData: PostDataType) {
            const response = await instance.post(`posts`, {
                post_data: postData
            });
            return response.data;
        },
        async delPost(postId: string) {
            const response = await instance.post(`del_post`, {
                post_id: postId
            })
            return response.data;
        },
        async editPost(postData: PostDataType) {
            const response = await instance.post(`edit_post`, {
                post_data: postData
            })
            return response.data;
        },
        // получить теги
        async getTags() {
            const response = await instance.get(`get_tags`);
            return response.data;
        },
        // получить пост по айди
        async getPostById(postId: string | undefined) {
            const response = await instance.get(`post/${postId}`);
            return response.data;
        },
    }
}