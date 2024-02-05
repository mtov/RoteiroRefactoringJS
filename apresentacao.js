function gerarFaturaStr(fatura, calc) {

    let faturaStr = `Fatura ${fatura.cliente}\n`;
    for (let apre of fatura.apresentacoes) {
        faturaStr += `${calc.repo.getPeca(apre).nome}: ${formatarMoeda(calc.calcularTotalApresentacao(apre))} (${apre.audiencia} assentos)\n`;
    }
    faturaStr += `Valor total: ${formatarMoeda(calc.calcularTotalFatura(fatura.apresentacoes))}\n`;
    faturaStr += `Créditos acumulados: ${calc.calcularTotalCreditos(fatura.apresentacoes)} \n`;
    return faturaStr;
}

var formatarMoeda = require("./util.js")
module.exports = gerarFaturaStr;

/*function gerarFaturaHTML(fatura, calc) {
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