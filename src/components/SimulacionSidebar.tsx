import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ucnLogo from '../assets/IsologoUCN.png';
import { BsArrowLeftSquareFill, BsList } from 'react-icons/bs';
import { IoArrowBack } from 'react-icons/io5';

type SimulacionSidebarProps = {
  onSidebarToggle?: (open: boolean) => void;
  modoDiagnosticoFinal?: boolean;
  navigateBack?: () => void;
};

const SimulacionSidebar = ({
  onSidebarToggle,
  modoDiagnosticoFinal,
  navigateBack
}: SimulacionSidebarProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();

  const salirItem = {
    title: modoDiagnosticoFinal ? 'Atrás' : 'Salir',
    icon: <IoArrowBack className="w-6 h-6" />,
    action: () => {
      if (modoDiagnosticoFinal && navigateBack) {
        navigateBack();
      } else {
        navigate('/inicioEstudiante');
      }
    },
  };

  const toggleSidebar = () => {
    setIsOpen((prev) => {
      const newState = !prev;
      if (onSidebarToggle) onSidebarToggle(newState);
      return newState;
    });
  };

  const SidebarContentDesktop = () => (
    <div
      className={`bg-[#164a5f] h-full p-5 pt-8 ${
        isOpen ? 'w-72' : 'w-16'
      } duration-300 relative rounded-tr-2xl overflow-visible`}
    >
      <BsArrowLeftSquareFill
        className={`text-white text-4xl rounded-full absolute -right-4 top-6 border-2 border-white bg-[#164a5f] cursor-pointer hidden md:block ${
          !isOpen ? 'rotate-180' : ''
        }`}
        onClick={toggleSidebar}
      />

      {isOpen && (
        <>
          <img
            src={ucnLogo}
            className="w-30 mb-8 rounded cursor-pointer block"
            alt="UCN Logo"
          />
          <p className="text-white font-semibold mb-4">Simulación</p>
          <ul className="pt-2">
            <li
              className="text-white text-sm flex items-center gap-4 cursor-pointer p-2 rounded-md hover:bg-[#0d5c71] mt-2"
              onClick={salirItem.action}
            >
              {salirItem.icon}
              <p className="text-base font-medium flex-1 hover:text-blue-400">
                {salirItem.title}
              </p>
            </li>
          </ul>
        </>
      )}
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
      <img
        src={ucnLogo}
        className="w-30 mb-8 rounded cursor-pointer block"
        alt="UCN Logo"
      />
      <p className="text-white font-semibold mb-4">Simulación</p>
      <ul className="pt-2">
        <li
          className="text-white text-sm flex items-center gap-4 cursor-pointer p-2 rounded-md hover:bg-[#0d5c71] mt-2"
          onClick={salirItem.action}
        >
          {salirItem.icon}
          <p className="text-base font-medium flex-1 hover:text-blue-400">
            {salirItem.title}
          </p>
        </li>
      </ul>
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

export default SimulacionSidebar;
