// src/layout/Layout.tsx
import React, { useState } from "react";
import Sidebar from "./sidebar"; // ajusta ruta si es necesario
import { useSidebar } from "../../context/sidebarContext";

const Layout = ({ children, usuario }) => {
  const { expanded } = useSidebar();
  return (
    <div className="flex min-h-screen">
      <Sidebar usuario={usuario} />
      <main
        className={`transition-all duration-300 w-full ${
          expanded ? "ml-64" : "ml-20"
        }`}
        >
        {children}
      </main>
    </div>
  );
};

export default Layout;