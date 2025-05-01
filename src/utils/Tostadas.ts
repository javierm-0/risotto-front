import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Tostadas = {
  ToastSuccess: (message: string) => {
    toast.success(message, {
        pauseOnHover: false,
        autoClose: 1250,
    });
  },

  ToastError: (message: string) => {
    toast.error(message, {
        pauseOnHover: false,
    });
  },

  ToastInfo: (message: string) => {
    toast.info(message, {
        pauseOnHover: false,
        
    });
  },

  ToastWarning: (message: string) => {
    toast.warning(message, {
        pauseOnHover: false,
    });
  }
};

export default Tostadas;