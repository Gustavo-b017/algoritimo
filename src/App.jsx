import React, { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';
import ResultsTable from './components/ResultsTable';
import HeapResults from './components/HeapResults';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [allResults, setAllResults] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [order, setOrder] = useState('asc');
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [availableBrands, setAvailableBrands] = useState([]);
  const [marcaSelecionada, setMarcaSelecionada] = useState('');
  const resultadosPorPagina = 15;
  const wrapperRef = useRef(null);

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  };

  const debouncedFetchRef = useRef(
    debounce((term) => {
      setLoadingSuggestions(true);
      setSuggestions(['Pesquisando...']);
      const url = `/autocomplete?produto=${encodeURIComponent(term)}&prefix=${encodeURIComponent(term)}`;
      fetch(url)
        .then(resp => resp.ok ? resp.text() : Promise.reject(resp.statusText))
        .then(text => {
          const data = text ? JSON.parse(text) : [];
          setSuggestions(Array.isArray(data) ? data : []);
          setLoadingSuggestions(false);
        })
        .catch(() => {
          setSuggestions([]);
          setLoadingSuggestions(false);
        });
    }, 200)
  );

  const buscarMarcasAutomaticamente = useCallback(async (termo) => {
    try {
      const url = `/buscar?produto=${encodeURIComponent(termo)}&pagina=1&itensPorPagina=200`;
      const resp = await fetch(url);
      const text = await resp.text();
      const data = text ? JSON.parse(text) : [];

      const marcas = Array.from(
        new Set(data.map(item => (item.data?.marca || item.marca)).filter(Boolean))
      );

      setAvailableBrands(marcas);
      if (!marcas.includes(marcaSelecionada)) {
        setMarcaSelecionada(marcas[0] || '');
      }
    } catch (err) {
      console.error("Erro ao buscar marcas automaticamente", err);
      setAvailableBrands([]);
      setMarcaSelecionada('');
    }
  }, [marcaSelecionada]);

  useEffect(() => {
    if (searchTerm.trim() !== '') {
      debouncedFetchRef.current(searchTerm);
      buscarMarcasAutomaticamente(searchTerm);
    } else {
      setSuggestions([]);
      setAvailableBrands([]);
      setMarcaSelecionada('');
    }
  }, [searchTerm, buscarMarcasAutomaticamente]);

  const buscarProdutos = useCallback(() => {
    if (searchTerm.trim() === '' || marcaSelecionada.trim() === '') return;

    setLoading(true);
    setMostrarResultados(false);

    const url = `/buscar?produto=${encodeURIComponent(searchTerm)}&pagina=1&itensPorPagina=200`;

    fetch(url)
      .then(resp => resp.ok ? resp.text() : Promise.reject(resp.statusText))
      .then(text => {
        const data = text ? JSON.parse(text) : [];
        let filtrados = data.filter(item => {
          const marca = item.data?.marca || item.marca || '';
          return marca.toLowerCase() === marcaSelecionada.toLowerCase();
        });

        filtrados = filtrados.sort((a, b) => {
          const nomeA = (a.data?.nomeProduto || a.nomeProduto || '').toLowerCase();
          const nomeB = (b.data?.nomeProduto || b.nomeProduto || '').toLowerCase();
          return order === 'asc' ? nomeA.localeCompare(nomeB) : nomeB.localeCompare(nomeA);
        });

        setAllResults(filtrados);
        setCurrentPage(1);
        setMostrarResultados(true);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao buscar produtos", err);
        setAllResults([]);
        setLoading(false);
      });
  }, [searchTerm, marcaSelecionada, order]);

  useEffect(() => {
    if (searchTerm && marcaSelecionada) {
      buscarProdutos();
    }
  }, [searchTerm, marcaSelecionada, order, buscarProdutos]);

  useEffect(() => {
    const start = (currentPage - 1) * resultadosPorPagina;
    const end = start + resultadosPorPagina;
    setResults(allResults.slice(start, end));
  }, [allResults, currentPage]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }

    function handleEscKey(event) {
      if (event.key === 'Escape') {
        setShowSuggestions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, []);

  const highlightMatch = (text, prefix) => {
    const idx = text.toLowerCase().indexOf(prefix.toLowerCase());
    if (idx === -1) return text;
    return (
      text.substring(0, idx) + '<strong>' +
      text.substring(idx, idx + prefix.length) + '</strong>' +
      text.substring(idx + prefix.length)
    );
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Buscar Produtos</h2>

      <div className="row g-3 align-items-end">
        <div className="col-md-6 position-relative" ref={wrapperRef}>
          <label className="form-label">Produto:</label>
          <div className="position-relative">
            <input
              type="text"
              className="form-control pe-5"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Digite para pesquisar..."
              onFocus={() => setShowSuggestions(true)}
            />
            <button
              className="btn btn-sm btn-light position-absolute top-0 end-0 mt-1 me-1"
              onClick={() => setShowSuggestions(prev => !prev)}
              title={showSuggestions ? 'Fechar sugestões' : 'Abrir sugestões'}
            >
              {showSuggestions ? '✕' : '☰'}
            </button>
          </div>

          {(showSuggestions && (searchTerm.trim() !== '' || suggestions.length > 0)) && (
            <div
              className="border position-absolute w-100 bg-white shadow-sm mt-1"
              style={{ maxHeight: '250px', overflowY: 'auto', zIndex: 1050 }}
            >
              {loadingSuggestions ? (
                <div className="p-2">Pesquisando...</div>
              ) : (
                <ul className="list-unstyled mb-0">
                  {suggestions[0] === "Pesquisando..." ? (
                    <li className="p-2 text-muted">{suggestions[0]}</li>
                  ) : (
                    suggestions.map((sug, i) => {
                      const label = sug.data?.nomeProduto || sug.nome || sug;
                      return (
                        <li
                          key={i}
                          className="autocomplete-item px-3 py-2 border-bottom"
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                            setSearchTerm(label);
                            setShowSuggestions(false);
                          }}
                          dangerouslySetInnerHTML={{ __html: highlightMatch(label, searchTerm) }}
                        />
                      );
                    })
                  )}
                </ul>
              )}
            </div>
          )}
        </div>

        <div className="col-md-4">
          <label className="form-label">Marca:</label>
          <select
            className="form-select"
            value={marcaSelecionada}
            onChange={e => setMarcaSelecionada(e.target.value)}
          >
            {availableBrands.length > 0 ? (
              availableBrands.map((m, i) => <option key={i} value={m}>{m}</option>)
            ) : (
              <option disabled>Selecione um produto para ver as marcas</option>
            )}
          </select>
        </div>

        <div className="col-md-2">
          <label className="form-label">Ordem:</label>
          <select
            className="form-select"
            value={order}
            onChange={e => setOrder(e.target.value)}
          >
            <option value="asc">Crescente</option>
            <option value="desc">Decrescente</option>
          </select>
        </div>
      </div>

      {loading && <div className="mt-4">Carregando resultados...</div>}

      {mostrarResultados && (
        <>
          <h4 className="mt-4">Resultados por página</h4>
          <ResultsTable results={results} loading={loading} />
          <div className="mt-3 d-flex align-items-center gap-2">
            <button className="btn btn-secondary" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Anterior</button>
            <span>Página {currentPage}</span>
            <button className="btn btn-secondary" onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage * resultadosPorPagina >= allResults.length}>Próxima</button>
          </div>

          <div className="mt-5">
            <h4>Resultados com Heap (Potência ou Ano)</h4>
            <HeapResults produto={searchTerm} marca={marcaSelecionada} />
          </div>
        </>
      )}
    </div>
  );
}

export default App;
