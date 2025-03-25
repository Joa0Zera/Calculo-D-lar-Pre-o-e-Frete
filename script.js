// Definição da taxa de câmbio (dólar para real)
const TAXA_CAMBIO = 5.74;

// mapeiam as regiões do Brasil para suas taxas de frete
const taxasFrete = {
  N: 20, // Norte
  NE: 30, // Nordeste
  S: 25, // Sul
  SE: 15, // Sudeste
  CO: 18, // Centro-Oeste
};

// Mapa de estados para cada região
const mapaRegioes = {
  AC: "N",
  AM: "N",
  AP: "N",
  PA: "N",
  RO: "N",
  RR: "N",
  TO: "N",
  AL: "NE",
  BA: "NE",
  CE: "NE",
  MA: "NE",
  PB: "NE",
  PE: "NE",
  PI: "NE",
  RN: "NE",
  SE: "NE",
  PR: "S",
  RS: "S",
  SC: "S",
  ES: "SE",
  MG: "SE",
  RJ: "SE",
  SP: "SE",
  DF: "CO",
  GO: "CO",
  MT: "CO",
  MS: "CO",
};

// Lista de produtos e serviços disponíveis para venda
const produtos = [
  {
    id: 1,
    nome: "Sofá de Veludo",
    preco: 1200.0,
    imagem: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500",
    descricao:
      "Sofá de veludo genuíno, elegante e confortável para sua sala de estar.",
  },
  {
    id: 2,
    nome: "Sala Planejada",
    preco: 800.0,
    imagem:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=500",
    descricao:
      " Ambiente otimizado com design funcional e elegante, feito sob medida para seu espaço.",
  },
  {
    id: 3,
    nome: "Hall de entrada",
    preco: 450.0,
    imagem:
      "https://images.unsplash.com/photo-1618220179428-22790b461013?w=500",
    descricao:
      "A primeira impressão do seu lar, combinando sofisticação e acolhimento.",
  },
  {
    id: 4,
    nome: "Poltrona",
    preco: 700.0,
    imagem:
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=500",
    descricao: "Conforto e estilo em uma peça versátil para qualquer ambiente.",
  },
  {
    id: 5,
    nome: "Sala Moderna",
    preco: 1500.0,
    imagem:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=500",
    descricao:
      "Design contemporâneo com elementos sofisticados e minimalistas.",
  },
  {
    id: 6,
    nome: "Cadeira",
    preco: 250.0,
    imagem:
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=500",
    descricao: "Equilíbrio perfeito entre ergonomia, estética e conforto.",
  },
];

// Função para converter preço do Dólar americano para Real Brasileiro (utilizando a taxa de câmbio)
function converterParaBRL(precoUSD) {
  return (precoUSD * TAXA_CAMBIO).toFixed(2);
}

// Função assíncrona para buscar o estado pelo CEP utilizando a API ViaCEP
async function buscarEstadoPorCEP(cep) {
  try {
    const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const dados = await resposta.json();

    if (dados.erro) {
      throw new Error("CEP não encontrado.");
    }

    return dados.uf;
  } catch (erro) {
    console.error("Erro ao buscar CEP:", erro);
    return null;
  }
}

// Função para calcular o custo do frete baseado no estado
function calcularFrete(estado) {
  const regiao = mapaRegioes[estado];
  const custoFrete = regiao ? taxasFrete[regiao] : null;
  const elementoFrete = document.getElementById("custo-frete");
  if (custoFrete !== null) {
    elementoFrete.textContent = `Frete: R$ ${custoFrete.toFixed(2)}`;
  } else {
    elementoFrete.textContent = "Frete não disponível para este estado.";
  }
  return custoFrete;
}

// Função para renderizar a lista de produtos no HTML
function renderizarProdutos(custoFrete) {
  const listaProdutos = document.getElementById("lista-produtos");
  listaProdutos.innerHTML = "";

  produtos.forEach((produto) => {
    const colunaProduto = document.createElement("div");
    colunaProduto.className = "col-12 col-md-6 col-lg-4 mb-4";

    colunaProduto.innerHTML = `
      <div class="cartao-produto h-100">
        <img src="${produto.imagem}" alt="${produto.nome}" class="img-fluid" />
        <div class="detalhes p-3">
          <h2>${produto.nome}</h2>
          <p>${produto.descricao}</p>
          <div class="preco mb-2">
            <span>USD ${produto.preco.toFixed(2)}</span>
            <span class="preco-brl">(R$ ${converterParaBRL(
              produto.preco
            )})</span>
          </div>
          ${
            custoFrete !== null
              ? `<div class="info-frete mb-2">Frete: R$ ${custoFrete.toFixed(
                  2
                )}</div>`
              : ""
          }
          <button class="btn-comprar w-100" onclick="comprarAgora(${
            produto.id
          })">
            Comprar Agora
          </button>
        </div>
      </div>
    `;

    listaProdutos.appendChild(colunaProduto);
  });
}

// Adiciona um listener ao campo de CEP para atualizar a interface com o frete
document.getElementById("cep").addEventListener("input", async function (e) {
  const cep = e.target.value.replace(/\D/g, "");
  if (cep.length === 8) {
    const estado = await buscarEstadoPorCEP(cep);
    if (estado) {
      const custoFrete = calcularFrete(estado);
      renderizarProdutos(custoFrete);
    } else {
      document.getElementById("custo-frete").textContent =
        "CEP inválido ou não encontrado.";
      renderizarProdutos(null);
    }
  } else {
    document.getElementById("custo-frete").textContent = "";
    renderizarProdutos(null);
  }
});

// Renderiza os produtos inicialmente sem o cálculo de frete
renderizarProdutos(null);
