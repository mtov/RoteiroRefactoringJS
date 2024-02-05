const { readFileSync } = require('fs');

class Repositorio {
  constructor() {
    this.pecas = JSON.parse(readFileSync('./pecas.json'));
  }

  getPeca(apre) {
    return this.pecas[apre.id];
  }
}

class ServicoCalculoFatura {

  constructor(repo) {
    this.repo = repo;
  }

  calcularCredito(apre) {
    let creditos = 0;

    if (apre && this.repo.getPeca(apre).tipo === "comedia") {
      creditos += Math.max(apre.audiencia - 30, 0);
      creditos += Math.floor(apre.audiencia / 5);
    }
    return creditos;
  }

  calcularTotalCreditos(apresentacoes) {
    let creditosTotais = 0;
    for (let apre of apresentacoes) {
      creditosTotais += this.calcularCredito(apre);
    }
    return creditosTotais;
  }

  calcularTotalApresentacao(apre) {
    let total = 0;
    switch (this.repo.getPeca(apre).tipo) {
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

  calcularTotalFatura(apresentacoes) {
    let total = 0;
    for (let apre of apresentacoes) {
      total += this.calcularTotalApresentacao(apre);
    }
    return total;
  }

  getPeca(apre) {
    return this.repo.getPeca(apre);
  }
}

// função extraída
function formatarMoeda(valor) {
  return new Intl.NumberFormat("pt-BR", 
  { style: "currency", currency: "BRL", 
  minimumFractionDigits: 2 }).format(valor/100);
}

function gerarFaturaStr(fatura, calc) {

    let faturaStr = `Fatura ${fatura.cliente}\n`;
    for (let apre of fatura.apresentacoes) {
        faturaStr += `${calc.repo.getPeca(apre).nome}: ${formatarMoeda(calc.calcularTotalApresentacao(apre))} (${apre.audiencia} assentos)\n`;
    }
    faturaStr += `Valor total: ${formatarMoeda(calc.calcularTotalFatura(fatura.apresentacoes))}\n`;
    faturaStr += `Créditos acumulados: ${calc.calcularTotalCreditos(fatura.apresentacoes)} \n`;
    return faturaStr;
}
/*
function gerarFaturaHTML(fatura, calc) {
  let faturaHTML = '<html>\n';
  faturaHTML += `<p> Fatura ${fatura.cliente} </p>\n<ul>\n`;

  for (let apre of fatura.apresentacoes) {
    const nomePeca = getPeca(calc, apre).nome;
    const totalApresentacao = calcularTotalApresentacao(calc, apre);
    faturaHTML += `<li>  ${nomePeca}: ${formatarMoeda(totalApresentacao)} (${apre.audiencia} assentos) </li>\n`;
  }

  const valorTotal = calcularTotalFatura(calc, fatura.apresentacoes);
  const creditosAcumulados = calcularTotalCreditos(calc, fatura.apresentacoes);

  faturaHTML += `</ul>\n<p> Valor total: ${formatarMoeda(valorTotal)} </p>\n`;
  faturaHTML += `<p> Créditos acumulados: ${creditosAcumulados} </p>\n</html>`;

  return faturaHTML;
}*/

const faturas = JSON.parse(readFileSync('./faturas.json'));
const calc = new ServicoCalculoFatura(new Repositorio());
const faturaStr = gerarFaturaStr(faturas, calc);
console.log(faturaStr);
// Chamada para gerar a fatura em HTML
/*const faturaHTML = gerarFaturaHTML(faturas, calc);
console.log(faturaHTML);*/
