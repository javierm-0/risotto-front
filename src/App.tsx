import { Route, Routes } from 'react-router-dom'
import Login from './components/Login'
import InicioStudent from './components/InicioStudent'
import InicioDocente from './components/InicioDocente'
import ProtectedRoute from './auth/ProtectedRoute'
import Logout from './components/Logout'
import Simulacion from './components/Simulacion'
import VerCasos from './components/VerCasos'
import CrearCasos from './components/CrearCasos'
import Diagnosticos from './components/Diagnosticos'


function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Login></Login>}></Route>
        <Route path="/logout" element={<Logout />} />
        <Route path='/inicioEstudiante' element={
          <ProtectedRoute>
            <InicioStudent></InicioStudent>
          </ProtectedRoute>
          }> </Route>
        <Route path='/inicioDocente' element={
          <ProtectedRoute>
            <InicioDocente></InicioDocente>
          </ProtectedRoute>
          }> </Route>
        <Route path='/inicioEstudiante/simulacion' element={
          <ProtectedRoute>
            <Simulacion></Simulacion>
          </ProtectedRoute>
          }> </Route>
        <Route path='/inicioDocente/verCasos' element={
          <ProtectedRoute>
            <VerCasos></VerCasos>
          </ProtectedRoute>
          }> </Route>
        <Route path='/inicioDocente/crearCasos' element={
          <ProtectedRoute>
            <CrearCasos></CrearCasos>
          </ProtectedRoute>
          }> </Route>
        <Route path='/inicioDocente/diagnosticos' element={
          <ProtectedRoute>
            <Diagnosticos></Diagnosticos>
          </ProtectedRoute>
          }> </Route>


      </Routes>
    </div>
  )

}

export default App
