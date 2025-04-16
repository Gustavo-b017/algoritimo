# Documentação Final - Projeto de DYNAMIC PROGRAMMING

---

## 1. Integrantes

- **Alunos:** 
  - Felipe Casquet Ferreira -- RM553680
  - Gilson Dias Ramos Junior​ -- RM552345
  - Gustavo Bezerra Assumção -- RM553076
  - Joseh Gabriel Trimboli Agra ​-- RM553094
  - Jefferson Gabriel de Mendonça -- RM553149
  
- **Professor:** Francisco Elanio Bezerra
- **Curso:** Engenharia de Software, 2ESPA
- **Disciplina:** DYNAMIC PROGRAMMING

---

## 2. Como usar e colocar para funcionar no terminal de comandos

### Requisitos:
- Python 3 instalado
- Node.js e npm instalados

### Backend (Flask)
2. Instale dependências:
```bash
pip install flask
```
3. Execute o servidor:
```bash
python app.py
```
O backend será iniciado em `http://127.0.0.1:5000`

### Frontend (React)
1. Instale o Node.js e o Npm:
```
Node.js: https://nodejs.org/pt/download
versão usada: v22.12.0

npm: vem junto do node
```
```
por codigo:
# Descarregar e instalar a fnm:
winget install Schniz.fnm

# Descarregar e instalar a Node.js:
fnm install 22

# Consultar a versão da Node.js:
node -v # Deveria imprimir "v22.14.0".

# Consultar a versão da npm:
npm -v # Deveria imprimir "10.9.2".
```
2. Instale dependências:
```bash
npm install
```
3. Execute o frontend:
```bash
npm run dev
```
A aplicação abrirá normalmente em `http://localhost:5173`

---

## 3. Principais Funções e Funcionalidades

- **Busca de Produtos** com ordenação ascendente ou descendente (Quick Sort).
- **Autocomplete** com sugestões dinâmicas via BST (Binary Search Tree).
- **Tabela de Resultados** com paginação.
- **Ordenação Parcial (Heap)** com opção de visualizar os K maiores ou menores elementos por critério.
- **Visualização do Quick Sort** passo a passo.
- **Autocomplete** ao digitar no campo de pesquisa.

---

## 4. Requisitos do professor e onde está implementado

| Requisito                                                          | Implementado? | Local                                                      |
|-------------------------------------------------------------------|----------------|------------------------------------------------------------|
| Ordenação com Quick Sort no backend                              | Sim            | Função `quick_sort` em `app.py`, usada nas rotas `/buscar` e `/heap` |
| Ordenação Parcial com Heap (K maiores/menores)                   | Sim            | Função `get_k_elements` com `heapq`, rota `/heap`             |
| Autocomplete com BST e busca por prefixo                          | Sim            | Implementado em `autocomplete` e BST estruturada no backend |

---

## 5. Explicação geral do código no Backend

### Estrutura principal - `app.py`
- `obter_token`: faz autenticação na API da Rede Ancora
- `buscar_produtos`: busca os dados da API e retorna produtos conforme a pesquisa
- `quick_sort`: ordena os produtos de forma recursiva, usada na busca principal, usado em muitas partes pelo código
- `get_k_elements`: aplica Heap (min/max) e ordena com Quick Sort para visualização
- `autocomplete`: usa a BST com busca por prefixo para sugestão eficiente

### Rotas
- `/buscar`: chamada principal de busca, onde busca na api (tras todos os resultados com o prefixo)
- `/autocomplete`: chamada de sugestões conforme prefixo, usando o BST
- `/heap`: busca com ordenação parcial (K maiores/menores)
- `/`: carrega o frontend HTML (para fallback, não utilizado diretamente)

---

## 6. Explicação geral do Frontend

### Componentes principais
- `App.jsx`: componente principal, coordena input, sugestões e chamadas
- `ResultsTable.jsx`: renderiza os dados da busca com paginação, e mostrado assim que o usuario acaba de digitar
- `HeapResults.jsx`: renderiza a ordenação parcial com destaque para potência e fabricação, pode se escolher a quantidade de itens, ordem, e por qual desses se vai ordenar
- `QuickSortSteps.jsx`: mostra ordenação passo a passo com o quick_sort (vem ordenado pelo back, então criei uma funçao para tornar aleatorio)

### Integração com backend
- Todas as chamadas são feitas via `fetch` para as rotas do Flask
- Os dados retornados (JSON) são processados, filtrados e mostrados em tempo real

### UX e UI
- Sugestões aparecem automaticamente ao digitar
- Feedback como "Procurando resultados..."
- Interface responsiva e amigável

---

*Obrigado!*

