import React, { useState, useEffect } from 'react';

function QuickSortSteps({ elementos, criterio, ordem }) {
  const [steps, setSteps] = useState([]);
  const [original, setOriginal] = useState([]);
  const [final, setFinal] = useState([]);

  useEffect(() => {
    if (!elementos || elementos.length === 0) return;

    const shuffleArray = (array) => {
      const arr = [...array];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    };

    const clone = shuffleArray(elementos);
    const snapshots = [];

    const getValue = (item) => {
      const raw = item?.data?.[criterio] || item?.[criterio];
      if (raw !== undefined) return parseFloat(raw) || 0;
      const fallback = item?.data?.aplicacoes?.[0]?.[criterio];
      return parseFloat(fallback) || 0;
    };

    const quickSort = (arr, left = 0, right = arr.length - 1) => {
      if (left >= right) return;
      const pivotIndex = Math.floor((left + right) / 2);
      const pivotValue = getValue(arr[pivotIndex]);
      let i = left;
      let j = right;

      snapshots.push({
        label: `Pivot: ${pivotValue}, Left Index: ${left}, Right Index: ${right}`,
        array: arr.map(item => getValue(item))
      });

      while (i <= j) {
        while ((ordem === 'maior' ? getValue(arr[i]) > pivotValue : getValue(arr[i]) < pivotValue)) i++;
        while ((ordem === 'maior' ? getValue(arr[j]) < pivotValue : getValue(arr[j]) > pivotValue)) j--;
        if (i <= j) {
          [arr[i], arr[j]] = [arr[j], arr[i]];
          snapshots.push({
            label: `mudança de i=${i} & j=${j}`,
            array: arr.map(item => getValue(item))
          });
          i++;
          j--;
        }
      }

      quickSort(arr, left, j);
      quickSort(arr, i, right);
    };

    setOriginal(clone.map(item => getValue(item)));
    quickSort(clone);
    setSteps(snapshots);
    setFinal(clone.map(item => getValue(item)));
  }, [elementos, criterio, ordem]);

  return (
    <div className="mt-4">
      <h6>QuickSort passo a passo ({renderLabel(criterio)})</h6>

      <div className="mb-2">
        <strong>Antes da ordenação:</strong>
        <pre className="bg-light p-2 border">{JSON.stringify(original)}</pre>
      </div>

      <div className="mb-2">
        <strong>Passos do QuickSort:</strong>
        {steps.length > 0 ? (
          steps.map((s, idx) => (
            <div key={idx} className="d-flex flex-column mb-2">
              <span className="fw-bold text-primary">{s.label}</span>
              <pre className="bg-white p-2 border">{JSON.stringify(s.array)}</pre>
            </div>
          ))
        ) : (
          <div>Nenhum passo registrado.</div>
        )}
      </div>

      <div className="mb-2">
        <strong>Após ordenação:</strong>
        <pre className="bg-light p-2 border">{JSON.stringify(final)}</pre>
      </div>
    </div>
  );

  function renderLabel(key) {
    switch (key) {
      case 'hp': return 'Potência (HP)';
      case 'fabricacaoInicial': return 'Ano de Fabricação';
      default: return key;
    }
  }
}

export default QuickSortSteps;