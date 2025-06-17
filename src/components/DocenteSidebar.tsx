import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ucnLogo from '../assets/IsologoUCN.png';
import iconClose from '../assets/arrow-reduce-tag.svg';
import iconHome from '../assets/home.svg';
import iconVista from '../assets/VistaDoc-1-white.png';
import iconCrear from '../assets/CrearDoc-1-white.png';
import iconDiagnostico from '../assets/VerDiagnostico-1-white.png';
import { BsArrowLeftSquareFill, BsList } from 'react-icons/bs';

const DocenteSidebar = ({ onSidebarToggle }: { onSidebarToggle?: (open: boolean) => void }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();

  const Menus = [
    { title: 'Inicio', icon: iconHome, link: '/inicioDocente' },
    { title: 'Editar Casos Clínicos', icon: iconVista, link: '/inicioDocente/verCasos' },
    { title: 'Crear Casos Clínicos', icon: iconCrear, link: '/inicioDocente/crearCasos/nuevoCaso' },
    { title: 'Ver Diagnosticos finales', icon: iconDiagnostico, link: '/inicioDocente/Diagnosticos' },
    { title: 'Cerrar Sesión', spacing: true, icon: iconClose, link: '/', isExitButton: true },
  ];

  const toggleSidebar = () => {
    setIsOpen(prev => {
      const newState = !prev;
      onSidebarToggle?.(newState);
      return newState;
    });
  };

  const renderMenuItems = () =>
    Menus.map((menu, index) => {
      if (!isOpen) return null; // No renderizar nada si está contraído

      return (
        <li
          key={index}
          className={`text-white text-sm flex items-center gap-4 cursor-pointer p-2 rounded-md hover:bg-[#0d5c71] mt-2 ${
            menu.spacing ? 'mt-60' : ''
          }`}
          onClick={() => navigate(menu.isExitButton ? '/logout' : menu.link)}
        >
          <img src={menu.icon} className="w-6 h-6" />
          <p className="text-base font-medium flex-1 hover:text-blue-400">{menu.title}</p>
        </li>
      );
    });

  const SidebarContentDesktop = () => (
    <div
      className={`bg-[#164a5f] h-full p-5 pt-8 ${
        isOpen ? 'w-72' : 'w-16'
      } duration-300 relative rounded-tr-2xl`}
    >
      <BsArrowLeftSquareFill
        className={`bg-[#164a5f] text-gray-200 text-3xl rounded-full absolute -right-3.5 top-10 border border-[#3ab1b177] cursor-pointer hidden md:block ${
          !isOpen && 'rotate-180'
        }`}
        onClick={toggleSidebar}
      />
      {isOpen && <img src={ucnLogo} className="w-30 mb-8 rounded cursor-pointer block" alt="UCN Logo" />}
      {isOpen && <p className="text-white font-semibold mb-4">Menú Docente</p>}
      <ul className="pt-2">{renderMenuItems()}</ul>
    </div>
  );

  const SidebarContentMobile = () => (
    <div className="w-[85vw] max-w-[280px] h-full bg-[#164a5f] p-5 pt-8">
      <button
        className="absolute top-4 right-4 text-white text-2xl"
        onClick={() => setShowMobileMenu(false)}
      >
        ✕
      </button>
      <img src={ucnLogo} className="w-30 mb-8 rounded cursor-pointer block" alt="UCN Logo" />
      <p className="text-white font-semibold mb-4">Menú Docente</p>
      <ul className="pt-2">{renderMenuItems()}</ul>
    </div>
  );

  return (
    <>
      {/* Sidebar PC */}
      <div className="hidden md:block fixed top-0 left-0 z-40 h-screen">
        <SidebarContentDesktop />
      </div>

      {/* Botón hamburguesa (solo móvil) */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-[#164a5f] text-white rounded-lg shadow-lg"
        onClick={() => setShowMobileMenu(true)}
      >
        <BsList className="text-2xl" />
      </button>

      {/* Sidebar móvil */}
      <div
        className={`fixed inset-0 z-50 transition-transform duration-300 ${
          showMobileMenu ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="absolute top-0 left-0 h-full transition duration-300">
          <SidebarContentMobile />
        </div>
      </div>
    </>
  );
};

export default DocenteSidebar;
