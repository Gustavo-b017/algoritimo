import React, { useState, useEffect, useCallback } from 'react';
import QuickSortSteps from './QuickSortSteps';

function HeapResults({ produto, marca }) {
  const [modo, setModo] = useState('maior');
  const [criterio, setCriterio] = useState('hp');
  const [k, setK] = useState(5);
  const [heapResults, setHeapResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    if (!produto || !marca) {
      console.log("HeapResults: produto ou marca não definidos", { produto, marca });
      return;
    }
    try {
      setLoading(true);
      const url = `/heap?produto=${encodeURIComponent(produto)}&marca=${encodeURIComponent(marca)}&k=${k}&criterio=${criterio}&modo=${modo}`;
      console.log("Requisição para:", url);
      const res = await fetch(url);
      const data = await res.json();
      console.log('Resposta da API (/heap):', data);

      let resultados = [];
      if (Array.isArray(data)) {
        resultados = data;
      } else if (data && Array.isArray(data.resultados)) {
        resultados = data.resultados;
      }

      // Ordenação defensiva no front caso o backend retorne fora de ordem
      resultados.sort((a, b) => {
        const aVal = safeGet(a, criterio);
        const bVal = safeGet(b, criterio);
        const numA = parseFloat(aVal) || 0;
        const numB = parseFloat(bVal) || 0;
        return modo === 'maior' ? numB - numA : numA - numB;
      });

      setHeapResults(resultados);
    } catch (err) {
      console.error('Erro ao buscar dados de heap:', err);
      setHeapResults([]);
    } finally {
      setLoading(false);
    }
  }, [produto, marca, k, criterio, modo]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const safeGet = (item, key) => {
    let val = item?.data?.[key] ?? item?.[key];

    if (val === undefined && Array.isArray(item?.data?.aplicacoes) && item.data.aplicacoes.length > 0) {
      val = item.data.aplicacoes[0]?.[key];
    }

    return val ?? '-';
  };

  const renderCriterioName = (key) => {
    switch (key) {
      case 'hp':
        return 'Potência (HP)';
      case 'fabricacaoInicial':
        return 'Ano de Fabricação';
      default:
        return key;
    }
  };

  const getThClass = (columnKey) => {
    return columnKey === criterio ? 'bg-primary text-white' : '';
  };

  const getRowHighlight = (index) => {
    return modo === 'maior' ? index === 0 : index === heapResults.length - 1;
  };

  return (
    <div className="mt-4">
      <h5>Top {k} produtos - {modo === 'maior' ? 'maior' : 'menor'} valor de {renderCriterioName(criterio)}</h5>

      <div className="d-flex gap-2 mb-3">
        <select
          className="form-select w-auto"
          value={modo}
          onChange={(e) => setModo(e.target.value)}
        >
          <option value="maior">K-maior</option>
          <option value="menor">K-menor</option>
        </select>

        <select
          className="form-select w-auto"
          value={criterio}
          onChange={(e) => setCriterio(e.target.value)}
        >
          <option value="hp">Potência (HP)</option>
          <option value="fabricacaoInicial">Ano de fabricação</option>
        </select>

        <input
          type="number"
          className="form-control w-auto"
          value={k}
          onChange={(e) => setK(parseInt(e.target.value) || 1)}
          min="1"
        />
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Produto</th>
            <th>Marca</th>
            <th className={getThClass('hp')}>Potência (HP)</th>
            <th className={getThClass('fabricacaoInicial')}>Ano de Fabricação</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan="4">Carregando...</td></tr>
          ) : heapResults.length > 0 ? (
            heapResults.map((item, index) => (
              <tr
                key={index}
                style={getRowHighlight(index) ? { backgroundColor: '#e6f7ff', fontWeight: 'bold' } : {}}
              >
                <td>{safeGet(item, 'nomeProduto')}</td>
                <td>{safeGet(item, 'marca')}</td>
                <td>{safeGet(item, 'hp')}</td>
                <td>{safeGet(item, 'fabricacaoInicial')}</td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="4">Nenhum resultado encontrado.</td></tr>
          )}
        </tbody>
      </table>

      <QuickSortSteps elementos={heapResults} criterio={criterio} ordem={modo} />
    </div>
  );
}

export default HeapResults;