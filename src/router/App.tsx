import { Route, Routes } from 'react-router-dom'
import Login from '../components/Login'
import InicioStudent from '../components/InicioStudent'
import InicioDocente from '../components/InicioDocente'
import ProtectedRoute from '../auth/ProtectedRoute'
import Logout from '../components/Logout'
import VerCasos from '../components/VerCasos'
import CrearCasos from '../components/CrearCasos'
import Diagnosticos from '../components/Diagnosticos'
import CasoUrgencia from '../components/CasosST.tsx/CasoUrgencia'
import CasoAPS from '../components/CasosST.tsx/CasoAPS'
import CasoHospitalario from '../components/CasosST.tsx/CasoHospitalario'


function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Login></Login>}></Route>
        <Route path="/logout" element={<Logout />} />
        <Route path='/inicioEstudiante' element={
          <ProtectedRoute allowedRoles={['Estudiante']}>
            <InicioStudent></InicioStudent>
          </ProtectedRoute>
          }> </Route>
        <Route path='/inicioEstudiante/CasosUrgencia' element={
          <ProtectedRoute allowedRoles={['Estudiante']}>
            <CasoUrgencia></CasoUrgencia>
          </ProtectedRoute>
          }> </Route>
        <Route path='/inicioEstudiante/CasosAPS' element={
          <ProtectedRoute allowedRoles={['Estudiante']}>
            <CasoAPS></CasoAPS>
          </ProtectedRoute>
          }> </Route>
        <Route path='/inicioEstudiante/CasosHospitalarios' element={
          <ProtectedRoute allowedRoles={['Estudiante']}>
            <CasoHospitalario></CasoHospitalario>
          </ProtectedRoute>
          }> </Route>





        <Route path='/inicioDocente' element={
          <ProtectedRoute >
            <InicioDocente></InicioDocente>
          </ProtectedRoute>
          }> </Route>
        <Route path='/inicioDocente/verCasos' element={
          <ProtectedRoute >
            <VerCasos></VerCasos>
          </ProtectedRoute>
          }> </Route>
        <Route path='/inicioDocente/crearCasos' element={
          <ProtectedRoute >
            <CrearCasos></CrearCasos>
          </ProtectedRoute>
          }> </Route>
        <Route path='/inicioDocente/diagnosticos' element={
          <ProtectedRoute >
            <Diagnosticos></Diagnosticos>
          </ProtectedRoute>
          }> </Route>
      </Routes>
    </div>
  )

}

export default App
