import React from 'react';

const ResultsTable = ({ results, loading }) => {
  return (
    <>
      <h3 className="mt-4">Resultados:</h3>
      <table className="table table-striped" id="tabela-produtos">
        <thead>
          <tr>
            <th>Nome do Produto</th>
            <th>Marca</th>
            <th>Código de Referência</th>
            <th>Família</th>
            <th>Aplicações</th>
            <th>Dimensões</th>
            <th>Informações Complementares</th>
          </tr>
        </thead>
        <tbody>
          {(!loading && results.length === 0) ? (
            <tr><td colSpan="7">Nenhum produto encontrado</td></tr>
          ) : (
            results.map((item, index) => {
              const info = item.data ? item.data : item;
              const nomeProduto = info.nomeProduto || "N/A";
              const marca = info.marca || "N/A";
              const codigoRef = info.codigoReferencia || "N/A";
              let familia = "N/A";
              if (info.familia) {
                familia = info.familia.descricao || "";
                if (info.familia.subFamilia) {
                  familia += " | " + (info.familia.subFamilia.descricao || "");
                  if (info.familia.subFamilia.produtoTipo) {
                    familia += " | " + (info.familia.subFamilia.produtoTipo.descricao || "");
                  }
                }
              }
              let aplicacoes = "N/A";
              if (info.aplicacoes && info.aplicacoes.length > 0) {
                const apps = [...new Set(info.aplicacoes.map(app => `${app.modelo} (${app.montadora})`))];
                aplicacoes = apps.join(", ");
              }
              const dimensoes = info.dimensoes || "N/A";
              const informacoes = (info.informacoesComplementares && info.informacoesComplementares.trim() !== "")
                ? info.informacoesComplementares
                : ((info.informacoesAdicionais && info.informacoesAdicionais.trim() !== "") ? info.informacoesAdicionais : "N/A");
              return (
                <tr key={index}>
                  <td>{nomeProduto}</td>
                  <td>{marca}</td>
                  <td>{codigoRef}</td>
                  <td>{familia}</td>
                  <td>{aplicacoes}</td>
                  <td>{dimensoes}</td>
                  <td>{informacoes}</td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </>
  );
};

export default ResultsTable;
