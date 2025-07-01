import React from 'react';
import Layout from '../components/general/layout';
import { useAuth } from '../context/authContext';
const Home = () => {
    const {usuario} = useAuth()
    return (
        <Layout>
        <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-slate-50 to-indigo-100 font-sans">
            <div className="bg-white px-10 py-12 rounded-3xl shadow-xl text-center">
                <h1 className="text-4xl mb-4 text-indigo-700 font-bold">
                    Bienvenido, {usuario.login}!
                </h1>
                <p className="text-lg text-slate-500">
                    Nos alegra tenerte aquí. ¡Explora y disfruta de la experiencia!
                </p>
            </div>
        </div>
        </Layout>
    );
};

export default Home;
