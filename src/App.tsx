import { Route, Routes } from 'react-router-dom'
import Login from './components/Login'
import InicioStudent from './components/InicioStudent'
import ProtectedRoute from './auth/ProtectedRoute'


function App() {
  return (
    <div className="min-h-screen bg-[#0d5c71] flex justify-center items-center text-white">
      <Routes>
        <Route path='/' element={<Login></Login>}></Route>
        <Route path='/inicioEstudiante' element={
          <ProtectedRoute>
            <InicioStudent></InicioStudent>
          </ProtectedRoute>
          
          }> </Route>
      </Routes>
    </div>
  )

}

export default App
