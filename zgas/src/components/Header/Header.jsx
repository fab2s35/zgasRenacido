import react from 'react';
import './Header.css';
import Zlogo from '../../img/logoZ.png'


function Header() {
    return(
        <>

        <div className="Banner">
        <div className="banner-bg">
          <header className="banner-header">
            <nav className="banner-nav" aria-label="Global">
              <div className="logo-container">
                <a href="/" className="logo-link">
                  <span className="sr-only">ZGAS</span>
                  <img className="logo-img" src={Zlogo} alt="Company logo" />
                </a>
              </div>
              <div className="menu-mobile">
                <button type="button" className="menu-button">
                  <span className="sr-only">Open main menu</span>
                  <svg className="menu-icon" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  </svg>
                </button>
              </div>
              <div className="menu-desktop">
                <a href="/" className="nav-link">Inicio</a>
                <a href="/Products" className="nav-link">Productos</a>
                <a href="/Branches" className="nav-link">Sucursales</a>
                <a href="/Customers" className="nav-link">Clientes</a>
              </div>
            </nav>
          </header>
        </div>
      </div>

        </>
    );
}

export default Header;