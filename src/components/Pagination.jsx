import React from 'react';

const Pagination = ({ currentPage, prevPage, nextPage, totalResults }) => {
  // Aqui você pode definir lógica para esconder o botão "Próxima" se não houver mais resultados.
  // Para este exemplo, vamos exibir os botões se houver algum resultado.
  if (!totalResults || totalResults === 0) return null;
  
  return (
    <div className="mt-3">
      <button className="btn btn-secondary" onClick={prevPage}>Anterior</button>
      <span className="mx-2">{currentPage}</span>
      <button className="btn btn-secondary" onClick={nextPage}>Próxima</button>
    </div>
  );
};

export default Pagination;
