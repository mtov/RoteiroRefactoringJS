const { readFileSync } = require('fs');


function formatarMoeda(valor) {
  return new Intl.NumberFormat("pt-BR",
 {
   style: "currency", currency: "BRL",
   minimumFractionDigits: 2
 }).format(valor / 100);
}

function getPeca(pecas, apre){
return pecas[apre.id];
}

function calcularCredito(pecas,apre) {
let creditos = 0;
creditos += Math.max(apre.audiencia - 30, 0);
if (getPeca(pecas, apre).tipo === "comedia")
  creditos += Math.floor(apre.audiencia / 5);
return creditos;
}

function calcularTotalApresentacao(pecas, apre){
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
    throw new Error(`Peça desconhecia: ${getPeca(pecas, apre).tipo}`);
}
return total;
}

function calcularTotalFatura(pecas, apresentacoes) {

}

function gerarFaturaStr (fatura, pecas) {

  let totalFatura = 0;
  let creditos = 0;

  let faturaStr = `Fatura ${fatura.cliente}\n`;
  for (let apre of fatura.apresentacoes) {
    faturaStr += `  ${getPeca(pecas, apre).nome}: ${formatarMoeda(
      calcularTotalApresentacao(pecas, apre)
    )} (${apre.audiencia} assentos)\n`;
  }
    
  faturaStr += `Valor total: ${formatarMoeda(totalFatura)}\n`;
  faturaStr += `Créditos acumulados: ${creditos} \n`;
  return faturaStr;

}

function gerarFaturaHTML(fatura, pecas) {
  let faturaStr = `<html>\n<p>Fatura ${fatura.cliente}</p>\n<ul>\n`;
  for (let apre of fatura.apresentacoes) {
      faturaStr += `<li>  ${calc.repo.getPeca(apre).nome}: ${formatarMoeda(calc.calcularTotalApresentacao(apre))} (${apre.audiencia} assentos)</li>\n`;
  }
  faturaStr += '</ul>\n'
  faturaStr += `<p> Valor total: ${formatarMoeda(calc.calcularTotalFatura(fatura.apresentacoes))}</p>\n`;
  faturaStr += `<p> Créditos acumulados: ${calc.calcularTotalCreditos(fatura.apresentacoes)}</p>\n`;
  faturaStr += '</html>\n'
  return faturaStr;
}

const faturas = JSON.parse(readFileSync('./faturas.json'));
const pecas = JSON.parse(readFileSync('./pecas.json'));
const faturaStr = gerarFaturaStr(faturas, pecas);
console.log(faturaStr);
