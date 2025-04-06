import { Route, Routes } from 'react-router-dom'
import Login from './components/Login'
import InicioStudent from './components/InicioStudent'
import ProtectedRoute from './auth/ProtectedRoute'
import Logout from './components/Logout'
import Simulacion from './components/Simulacion'


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
        <Route path='/inicioEstudiante/simulacion' element={
          <ProtectedRoute>
            <Simulacion></Simulacion>
          </ProtectedRoute>
          }> </Route>


        <Route path='/inicioDocente' element={
          <ProtectedRoute>
            <InicioStudent></InicioStudent>
          </ProtectedRoute>
          }> </Route>


      </Routes>
    </div>
  )

}

export default App
