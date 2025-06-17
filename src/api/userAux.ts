import axios from "axios";
import Tostadas from "../utils/Tostadas";
import { User } from "../types/User";


  //verifica si los datos de Google coinciden con los del back
  //si coinciden, se guarda en localStorage y retorna true
  //si no coinciden, se intenta agregar, si se logra agregar, retorna true
  const BACKEND_IP = import.meta.env.VITE_BACKEND_IP;
  export async function verificarUsuario(email: string, userInfoFromGoogle: any, tipo: "Estudiante" | "Docente") : Promise<boolean> {
    try {
      const response = await axios.get<User>(`http://${BACKEND_IP}:3001/users/user/${email}`);
      const userExists = response.data;
      if (userExists) {
        //usuario existe, se guarda en localStorage y se permite el acceso
        const userData: User = {
          name: userExists.name,
          email: userExists.email,
          type: tipo,
        };
        localStorage.setItem('user', JSON.stringify(userData));
        return true;
      } else {
        //usuario no existe, se agrega a la base de datos del back y luego ingresa
        Tostadas.ToastInfo('Cuenta no registrada en el sistema. Agregando usuario...');
        return await AgregarNuevoUsuario(userInfoFromGoogle, tipo);//retorna true si logra agregar, false si no, false si algo falla
      }
    } catch (error) {
      console.error('Error consultando API:', error);
      Tostadas.ToastError('Error consultando API al verificar el usuario.');
      return false;
    }
  }

  
  //agrega un nuevo usuario a la base de datos del back
  //retorna true si logra agregar, false si no, false si algo falla
  export async function AgregarNuevoUsuario(userInfoFromGoogle: any, tipo: "Estudiante" | "Docente") : Promise<boolean> {
    try {
      const response = await axios.post('http://'+BACKEND_IP +':3001/users/user/create', {
        name: userInfoFromGoogle.name,
        email: userInfoFromGoogle.email,
        type: tipo,
      });
      if (response.status === 201 && response.data) {
          //objeto creado y retorna algo con datos no nulos
          const userData: User = {
            name: response.data.name,
            email: response.data.email,
            type: tipo,
          };
          localStorage.setItem('user', JSON.stringify(userData));//guarda datos generales desde la respuesta del back
          Tostadas.ToastSuccess('Cuenta de usuario creada exitosamente!');
          return true;
      }
      else {
        console.error('No se pudo crear (not 201):', response.statusText);
        Tostadas.ToastError('Error: no se pudo crear cuenta:');
        return false;

      }
    } catch (error) {
      console.error('Error durante creación de usuario:', error);
      Tostadas.ToastError('Error durante creación de usuario:');
      return false;
    }
  }