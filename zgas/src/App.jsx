import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header.jsx';
import MainPage from './pages/MainPage/MainPage.jsx';




function App() {
  return (
    <Router>
      <Header />

      <Routes>
        {/* Ruta predeterminada para cargar la página de inicio */}
        <Route path="/" element={<MainPage />} />
        <Route path="/mainPage" element={<MainPage />} />

       

      </Routes>
    </Router>
  );
}

export default App;