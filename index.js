const { readFileSync } = require('fs');

function gerarFaturaStr(fatura, pecas) {

    //variaveis globais
    let creditos = 0;
    let totalFatura = 0;

    // função query
    function getPeca(apresentacao) {
      return pecas[apresentacao.id];
    }

    // função extraída
    function calcularCredito(apre) {
      let creditos = 0;
      creditos += Math.max(apre.audiencia - 30, 0);
      if (getPeca(apre).tipo === "comedia")
        creditos += Math.floor(apre.audiencia / 5);
      return creditos;
    }

    // função extraída
    function formatarMoeda(valor) {
      return new Intl.NumberFormat("pt-BR", 
      { style: "currency", currency: "BRL", 
      minimumFractionDigits: 2 }).format(valor/100);
    }

    function calcularTotalFatura() {
      let total = 0;
      for (let apre of fatura.apresentacoes) {
        total += calcularTotalApresentacao(apre);
      }
      return total;
    }

    // Função extraída
    function calcularTotalCreditos() {
      let creditosTotais = 0;
      for (let apre of fatura.apresentacoes) {
        creditosTotais += calcularCredito(apre);
      }
      return creditosTotais;
    }

    // Função extraída
    function calcularTotalApresentacao(apre) {
        let total = 0;
        switch (getPeca(apre).tipo) {
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

    let faturaStr = `Fatura ${fatura.cliente}\n`;
    for (let apre of fatura.apresentacoes) {
        // Mais uma linha da fatura
        faturaStr += `${getPeca(apre).nome}: ${formatarMoeda(calcularTotalApresentacao(apre))} (${apre.audiencia} assentos)\n`;
    }
    faturaStr += `Valor total: ${formatarMoeda(calcularTotalFatura())}\n`;
    faturaStr += `Créditos acumulados: ${calcularTotalCreditos()} \n`;
    return faturaStr;
}

const faturas = JSON.parse(readFileSync('./faturas.json'));
const pecas = JSON.parse(readFileSync('./pecas.json'));
const faturaStr = gerarFaturaStr(faturas, pecas);
console.log(faturaStr);
