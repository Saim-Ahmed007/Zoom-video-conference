import {Route, BrowserRouter as Router, Routes} from 'react-router-dom'
import Landing from './pages/Landing';
import Authentication from './pages/Authentication';
import { AuthProvider } from './context/AuthContext';
import VideoMeet from './pages/VideoMeet';
import Home from './pages/Home';
import History from './pages/History';
function App() {
  
  return (
    <>
    <Router>
      <AuthProvider>
      <Routes>
        <Route path='/' element={<Landing/>}/>
        <Route path='/auth' element={<Authentication/>}/>
        <Route path='/home' element={<Home/>}/>
        <Route path='/history' element={<History/>}/>
        <Route path='/:url' element={<VideoMeet/>}/>
      </Routes>
      </AuthProvider>
    </Router>
    </>
  )
}

export default App
