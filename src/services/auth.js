import axiosConfig from '../lib/axios';
export const login = async (user) => {

        const response = await axiosConfig.post('/auth/login', user);
        return response.data;

}
export const logout = async () => {

        const response = await axiosConfig.post('/auth/logout');
        return response.data;

}
export const getUser = async () => {

        const response = await axiosConfig.get('/auth/profile');
        return response.data;

}

