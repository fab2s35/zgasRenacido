import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './input.css';
import Header from './components/Header/Header.jsx';
import MainPage from './pages/MainPage/MainPage.jsx';
import Products from './pages/Products/Products.jsx';
import Branches from './pages/Branches/Branches.jsx';
import Customers from './pages/Customers/Customers.jsx';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/mainPage" element={<MainPage />} />
        <Route path="/products" element={<Products />} />
        <Route path="/Branches" element={<Branches />} />
        <Route path="/Customers" element={<Customers />} />
      </Routes>
    </Router>
  );
}

export default App;
