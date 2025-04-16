import React from 'react';

const SearchBar = ({ searchTerm, setSearchTerm, suggestions, selecionarSugestao }) => {
  return (
    <div className="mb-3" style={{ position: 'relative', width: '300px' }}>
      <label htmlFor="produto" className="form-label">Produto:</label>
      <input
        type="text"
        id="produto"
        className="form-control"
        placeholder="Digite para pesquisar..."
        autoComplete="off"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {suggestions.length > 0 && (
        <ul 
          id="sugestoes" 
          className="list-group" 
          style={{ position: 'absolute', width: '300px', zIndex: 999 }}
        >
          {suggestions.map((sug, index) => (
            <li
              key={index}
              className="list-group-item"
              style={{ cursor: 'pointer' }}
              onClick={() => selecionarSugestao(sug)}
              // Usa dangerouslySetInnerHTML para destacar o match (assumindo que a função de destaque já foi aplicada)
              dangerouslySetInnerHTML={{ __html: sug }}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
