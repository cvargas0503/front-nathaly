import axiosConfig from '../lib/axios';
export const login = async (user) => {
    try {
        const response = await axiosConfig.post('/auth/login', user);
        return response.data;
    } catch (error) {
        throw error;
    }    
}
export const logout = async () => {
    try {
        const response = await axiosConfig.post('/auth/logout');
        return response.data;
    } catch (error) {
        throw error;
    }
}
export const getUser = async () => {
    try {
        const response = await axiosConfig.get('/auth/profile');
        return response.data;
    } catch (error) {
        throw error;
    }
}

