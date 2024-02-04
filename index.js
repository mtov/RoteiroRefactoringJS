const { readFileSync } = require('fs');

function gerarFaturaStr(fatura, pecas) {

    // função query
    function getPeca(apresentacao){
      return pecas[apresentacao.id];
    }

    let totalFatura = 0;
    let creditos = 0;
    let faturaStr = `Fatura ${fatura.cliente}\n`;
    const formato = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2 }).format;

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
                throw new Error(`Peça desconhecida: ${peca.tipo}`);
        }
        return total;
    }

    for (let apre of fatura.apresentacoes) {
        //const peca = pecas[apre.id];
        const peca = getPeca(apre);
        let total = calcularTotalApresentacao(apre);

        // Créditos para próximas contratações
        creditos += Math.max(apre.audiencia - 30, 0);
        if (peca.tipo === "comedia")
            creditos += Math.floor(apre.audiencia / 5);

        // Mais uma linha da fatura
        faturaStr += `  ${peca.nome}: ${formato(total / 100)} (${apre.audiencia} assentos)\n`;
        totalFatura += total;
    }

    faturaStr += `Valor total: ${formato(totalFatura / 100)}\n`;
    faturaStr += `Créditos acumulados: ${creditos} \n`;
    return faturaStr;
}

const faturas = JSON.parse(readFileSync('./faturas.json'));
const pecas = JSON.parse(readFileSync('./pecas.json'));
const faturaStr = gerarFaturaStr(faturas, pecas);
console.log(faturaStr);
