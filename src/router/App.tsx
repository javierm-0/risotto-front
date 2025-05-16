import { Route, Routes } from 'react-router-dom'
import Login from '../components/Login'
import InicioStudent from '../components/InicioStudent'
import InicioDocente from '../components/InicioDocente'
import ProtectedRoute from '../auth/ProtectedRoute'
import Logout from '../components/Logout'
import VerCasos from '../components/VerCasos'
import CrearCasos from '../components/CasosDoc/CrearCasosFuncionalidad/CrearCasos'
import Diagnosticos from '../components/Diagnosticos'
import ListaCasosAPS from '../components/CasosST/ListaCasosAPS'
import ListaCasosUrgencia from '../components/CasosST/ListaCasosUrgencia'
import ListadoCasosHospitalarios from '../components/CasosST/ListaCasosHospitalarios'
import TestearInterprete from '../components/Test/TestearInterprete'
import Simulacion from '../components/Simulacion'


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
        <Route path='/inicioEstudiante/ListadoCasosUrgencia' element={
          <ProtectedRoute allowedRoles={['Estudiante']}>
            <ListaCasosUrgencia></ListaCasosUrgencia>
          </ProtectedRoute>
          }> </Route>
        <Route path='/inicioEstudiante/ListadoCasosAPS' element={
          <ProtectedRoute allowedRoles={['Estudiante']}>
            <ListaCasosAPS></ListaCasosAPS>
          </ProtectedRoute>
          }> </Route>
        <Route path='/inicioEstudiante/ListadoCasosHospitalarios' element={
          <ProtectedRoute allowedRoles={['Estudiante']}>
            <ListadoCasosHospitalarios></ListadoCasosHospitalarios>
          </ProtectedRoute>
          }> </Route>
        <Route path='/inicioEstudiante/testing' element={
          <ProtectedRoute allowedRoles={['Estudiante']}>
            <TestearInterprete></TestearInterprete>
          </ProtectedRoute>
          }> </Route>


        <Route path="/simulacion/:id" element={<Simulacion />} />


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
