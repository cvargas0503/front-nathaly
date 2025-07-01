import React from "react";
import { useAuth } from "../../context/authContext";
import Layout from "../../components/general/layout";

const Dashboard = () => {
    const {usuario} = useAuth();
    console.log(usuario)
    return (
        <Layout usuario={usuario?.login}>
        <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
            <h1>Dashboard</h1>
            <div style={{ display: "flex", gap: "2rem", marginTop: "2rem" }}>
                <div style={{ background: "#f5f5f5", padding: "1.5rem", borderRadius: "8px", flex: 1 }}>
                    <h2>Usuarios</h2>
                    <p>120</p>
                </div>
                <div style={{ background: "#f5f5f5", padding: "1.5rem", borderRadius: "8px", flex: 1 }}>
                    <h2>Ventas</h2>
                    <p>$3,500</p>
                </div>
                <div style={{ background: "#f5f5f5", padding: "1.5rem", borderRadius: "8px", flex: 1 }}>
                    <h2>Productos</h2>
                    <p>45</p>
                </div>
            </div>
            <div style={{ marginTop: "3rem" }}>
                <h2>Actividad reciente</h2>
                <ul>
                    <li>Nuevo usuario registrado</li>
                    <li>Venta completada</li>
                    <li>Producto actualizado</li>
                </ul>
            </div>
        </div>
        </Layout>
    );
};

export default Dashboard;