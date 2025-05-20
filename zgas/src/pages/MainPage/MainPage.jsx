import React from 'react';
import './MainPage.css'; 

function MainPage() {
    return (
      <>  

<div className="banner-main">
          <div className="banner-gradient" aria-hidden="true"></div>
          <div className="banner-content">
            <div className="announcement">
              <span className="announcement-text">
              Zeta Gas  <a href="#" className="announcement-link">El Salvador </a>
              </span>
            </div>
            <div className="text-center">
              <h1 className="banner-title">Página de gestión de Zeta Gas en El Salvador.</h1>
              <p className="banner-description">
              "Gestión de manera eficiente y segura todas las operaciones con Zeta Gas en El Salvador. Acceso a herramientas para administrar productos, pedidos y clientes, optimizando tu experiencia en el mercado energético. 
              </p>
              <div className="banner-buttons">
                <a href="/Products" className="btn-primary">Seguir</a>
              </div>
            </div>
          </div>
          <div className="banner-gradient-bottom" aria-hidden="true"></div>
        </div>

      </> 
  );
}

export default MainPage;