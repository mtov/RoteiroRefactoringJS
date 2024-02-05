const { readFileSync } = require('fs');

// função extraída
function formatarMoeda(valor) {
  return new Intl.NumberFormat("pt-BR", 
  { style: "currency", currency: "BRL", 
  minimumFractionDigits: 2 }).format(valor/100);
}

// função query
function getPeca(pecas, apre) {
  return pecas[apre.id];
}

// função extraída
function calcularCredito(pecas, apre) {
  let creditos = 0;
  
  if (apre && getPeca(pecas, apre).tipo === "comedia") {
    creditos += Math.max(apre.audiencia - 30, 0);
    creditos += Math.floor(apre.audiencia / 5);
  }
  return creditos;
}

// Função extraída
function calcularTotalCreditos(pecas, apresentacoes) {
  let creditosTotais = 0;
  for (let apre of apresentacoes) {
    creditosTotais += calcularCredito(pecas, apre);
  }
  return creditosTotais;
}

// Função extraída
function calcularTotalApresentacao(pecas, apre) {
  let total = 0;
  switch (getPeca(pecas, apre).tipo) {
    case "tragedia":
      total = 40000;
      if (apre.audiencia > 30) {
        total += 1000 * (apre.audiencia - 30);
      }
      break;
    case "comedia":
      total = 30000;
      if (apre.audiencia > 20) {
        total += 10000 + 500 * (apre.audiencia - 20);
      }
      total += 300 * apre.audiencia;
      break;
    default:
      throw new Error(`Peça desconhecida: ${apre.tipo}`);
  }
  return total;
}

function calcularTotalFatura(pecas, apresentacoes) {
  let total = 0;
  for (let apre of apresentacoes) {
    total += calcularTotalApresentacao(pecas, apre);
  }
  return total;
}

function gerarFaturaStr(fatura, pecas) {
    //variaveis globais
    let creditos = 0;
    let totalFatura = 0;

    let faturaStr = `Fatura ${fatura.cliente}\n`;
    for (let apre of fatura.apresentacoes) {
        faturaStr += `${getPeca(pecas, apre).nome}: ${formatarMoeda(calcularTotalApresentacao(pecas, apre))} (${apre.audiencia} assentos)\n`;
    }
    faturaStr += `Valor total: ${formatarMoeda(calcularTotalFatura(pecas, fatura.apresentacoes))}\n`;
    faturaStr += `Créditos acumulados: ${calcularTotalCreditos(pecas, fatura.apresentacoes)} \n`;
    return faturaStr;
}

function gerarFaturaHTML(fatura, pecas) {
  let faturaHTML = '<html>\n';
  faturaHTML += `<p> Fatura ${fatura.cliente} </p>\n<ul>\n`;

  for (let apre of fatura.apresentacoes) {
    const nomePeca = getPeca(pecas, apre).nome;
    const totalApresentacao = calcularTotalApresentacao(pecas, apre);
    faturaHTML += `<li>  ${nomePeca}: ${formatarMoeda(totalApresentacao)} (${apre.audiencia} assentos) </li>\n`;
  }

  const valorTotal = calcularTotalFatura(pecas, fatura.apresentacoes);
  const creditosAcumulados = calcularTotalCreditos(pecas, fatura.apresentacoes);

  faturaHTML += `</ul>\n<p> Valor total: ${formatarMoeda(valorTotal)} </p>\n`;
  faturaHTML += `<p> Créditos acumulados: ${creditosAcumulados} </p>\n</html>`;

  return faturaHTML;
}

const faturas = JSON.parse(readFileSync('./faturas.json'));
const pecas = JSON.parse(readFileSync('./pecas.json'));
const faturaStr = gerarFaturaStr(faturas, pecas);
console.log(faturaStr);
// Chamada para gerar a fatura em HTML
const faturaHTML = gerarFaturaHTML(faturas, pecas);
console.log(faturaHTML);
