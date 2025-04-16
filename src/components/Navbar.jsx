import React from 'react';

const Navbar = ({ atualizarBusca }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">Produtos</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMenu" 
                aria-controls="navbarMenu" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarMenu">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a 
                className="nav-link" 
                href="#" 
                onClick={(e) => { 
                  e.preventDefault(); 
                  atualizarBusca("Disco de Freio"); 
                }}
              >
                Disco de Freio
              </a>
            </li>
            <li className="nav-item">
              <a 
                className="nav-link" 
                href="#" 
                onClick={(e) => { 
                  e.preventDefault(); 
                  atualizarBusca("Filtro"); 
                }}
              >
                Filtro
              </a>
            </li>
            <li className="nav-item">
              <a 
                className="nav-link" 
                href="#" 
                onClick={(e) => { 
                  e.preventDefault(); 
                  atualizarBusca("Vela"); 
                }}
              >
                Vela
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
