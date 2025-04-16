import React from 'react';

const BrandFilter = ({ brands, selectedBrands, onChange }) => {
  return (
    <div className="mb-3">
      <label className="form-label">Filtrar por Marca:</label>
      <div>
        {brands.map((brand, index) => (
          <div key={index} className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="checkbox"
              id={`brand-${index}`}
              value={brand}
              checked={selectedBrands.includes(brand)}
              onChange={(e) => onChange(brand, e.target.checked)}
            />
            <label className="form-check-label" htmlFor={`brand-${index}`}>
              {brand}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrandFilter;
