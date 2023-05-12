# Roteiro de Refactoring (versão JavaScript)

**Prof. Marco Tulio Valente**

Objetivo: colocar em prática os conceitos de refactoring aprendidos na sala de aula. 
Para isso, você vai realizar alguns refactorings em um sistema hipotético, 
também usado no primeiro capítulo da segunda edição do 
[livro](https://martinfowler.com/books/refactoring.html)
do Fowler, que é o livro clássico sobre o tema.

Para tirar proveito do roteiro é **importante não apenas seguir os passos mecanicamente, 
mas também analisar os benefícios alcançados com cada refactoring**. Ou seja, pense 
sempre nos motivos que tornam o código refatorado melhor do que o código anterior.

Em caso de dúvida, você pode consultar o [Capítulo 9](https://engsoftmoderna.info/cap9.html) do nosso livro.

O exemplo está em JavaScript, mas a sintaxe é familiar mesmo para aqueles que nunca programaram 
nessa linguagem. Infelizmente, não é possível fazer em uma outra linguagem, pois a correção será 
automática. 

Você vai precisar de ter instalado também o `node.js` (para mais informações clique 
[aqui](https://nodejs.org/en/download)).

Instruções:

* Primeiro, crie um repositório no GitHub.

* Vá seguindo o roteiro, refactoring a refactoring.

* Após cada etapa, dê um **COMMIT & PUSH**, adicionado uma descrição (mensagem) no commit 
conforme as instruções do roteiro. Esses commits serão usados na correção, para garantir 
que você realizou todos os refactorings solicitados. 

* **Códigos que não compilam -- em qualquer um dos refactorings e passos -- serão avaliados 
  om nota zero pelo nosso sistema de correção automática**.


## 1. Função inicial

O sistema do nosso exemplo é usado por uma companhia de teatro de teatro
para gerar faturas. Explicando um poudo mais, essa companhia faz apresentações 
de algumas peças para certos clientes. E ela quer no final do mês gerar uma 
fatura para tais clientes, explicitando o valor que ela deve receber.

Primeiro, estude então a versão inicial da função `gerarFaturaStr`, 
disponível neste [link](https://replit.com/@engsoftmoderna/RoteiroRefactoringJS#).

**Importante:**

* No código, usamos o termo `peca` (sem cedilha) para denotar uma peça apresentada
  pela companhia. Por isso, existem funções chamadas, por exemplo, `getPeca`. 

* Os dados das apresentações feitas pela companhia de teatro estão
em um [arquivo json](). Em um segundo [arquivo](), estão informações sobre 
as peças do repertório da companhia de teatro.

Você deve também executar a função do nosso exemplo usando o 
comando `npm`: 

`node index.js`

O resultado deve ser o seguinte:

```
Fatura UFMG
  Hamlet: R$ 650,00 (55 assentos)
  As You Like It: R$ 580,00 (35 assentos)
  Othello: R$ 500,00 (40 assentos)
Valor total: R$ 1.730,00
Créditos acumulados: 47 
 ```

Em seguida, dê um **Commit & Push**, com a descrição: "Commit 1 - Versão inicial".

## 2. Extração de Função

Extrair uma função com código do `switch` interno a `gerarFaturaStr`. A nova função deve 
se chamar `calcularTotalApresentacao` e, portanto, vai calcular o valor que deve ser pago 
para uma determinada extração. Após a extração, o código ficará assim:

```js
function gerarFaturaStr (fatura, pecas) {

    function calcularTotalApresentacao(apre, peca) {
      let total = 0;
      switch (peca.tipo) {
        ...
      ...  
    }
    ...
    let total = calcularTotalApresentcao(apre, peca);
    ....
}          
```

Veja que em JavaScript podemos ter uma função implementada dentro de uma função 
mais externa, tal como ocorre no código acima.

Execute seu código, para garantir que está tudo funcionando do mesmo jeito.

Em seguida, dê um **Commit & Push**, com a descrição: "Commit 2 - Extração de Função".

## 3. Replace Temp with Query

Esse refactoring substitui uma variável local (`temp`) por uma função que 
apenas retorna seu valor, isto é, uma *query*.

Vamos então substituitir a variável local `peca` usada no corpo principal 
de `gerarFaturaStr` por uma função que retorna o seu valor.

Primeiro, vamos criar a função *query*  (`getPeca`) e chamá-la no corpo 
principal de `gerarFaturaStr`

```js
function gerarFaturaStr (fatura, pecas) {

    function getPeca(apresentacao) {
      return pecas[apresentacao.id];
    }
    ...
    
    for (let apre of fatura.apresentacoes) {
      const peca = getPeca(apre);
```

No próximo passo, você pode:
- deletar a declaração da variável local `peca`. Isto é, deletar (ou comentar) a linha

  `const peca = getPeca(apre);` 
  
- substituir todo uso de `peca` por uma chamada a `getPeca(apre)`. Ao todo, 
`peca` é usada em três pontos no corpo principal da função.

Feito isso, rode o código para garantir que está tudo funcionando.

**Qual o benefício desse refactoring?**

Após esse refactoring, nós podemos prosseguir e remover também o parâmetro `peca` de `calcularTotalApresentcao` e substituir os seus usos por chamadas a `getPeca`. Isso torna a função mais simples, pois ela terá apenas um parâmetro, em vez de dois como antes.

Especificamente, você deve agora:
- remover o parâmetro `peca` de `calcularTotalApresentacao`. Logo, essa função terá agora 
  um único parâmetro (`apre`).
- No corpo de `calcularTotalApresentacao`, substituir todos os usos do parâmetro 
  removido por chamadas a `getPeca`.
- Atualizar a chamada de `calcularTotalApresentacao`, no corpo da função principal, 
  para agora usar apenas um parâmetro de chamada.

Em seguida, dê um **Commit & Push**, com a descrição: "Commit 3 - Replace Temp with Query
".

## 4. Mais Extract Functions

#### Extraindo a função `CalcularCredito`

Extraia agora mais uma função, que ficará responsável por calcular quantos créditos o cliente 
ganhará com uma apresentação. Veja como ficará o código:

```js
function gerarFaturaStr (fatura, pecas) {

    function calcularCredito(apre) {
      let creditos = 0;
      creditos += Math.max(apre.audiencia - 30, 0);
      if (getPeca(apre).tipo === "comedia") 
         creditos += Math.floor(apre.audiencia / 5);
      return creditos;   
    }
    ....
```

Claro, não se esqueça de remover o código extraído do corpo da função principal.
E de também chamar a nova função (`calcularCredito`).

Feito isso, rode o código para garantir que está tudo funcionando.

#### Extraindo a função `formatarMoeda`

Para simplificar, vamos também extrair a inicialização da variável local `format`para uma
função e remover essa variável:

```js
function gerarFaturaStr (fatura, pecas) {

    function formatarMoeda(valor) {
      return new Intl.NumberFormat("pt-BR",
        { style: "currency", currency: "BRL",
          minimumFractionDigits: 2 }).format(valor/100);
    }
```

Feito isso, remova o código extraído do corpo da função principal e chame a nova função (`formatarMoeda`). 

Para garantir que está tudo funcionando, rode o código.

Em seguida, dê um **Commit & Push**, com a descrição: "Commit 4 - Mais Extract Functions".

#### 5. Separando Apresentação dos Cálculos

Agora, vamos fazer uma simplificação grande no corpo da função principal, que deverá ficar assim:

```js
function gerarFaturaStr (fatura, pecas) {

  // funções aninhadas
  
  let faturaStr = `Fatura ${fatura.cliente}\n`;
  for (let apre of fatura.apresentacoes) {
      faturaStr += `  ${getPeca(apre).nome}: ${formatarMoeda(calcularTotalApresentacao(apre))} (${apre.audiencia} assentos)\n`;
  }
  faturaStr += `Valor total: ${formatarMoeda(calcularTotalFatura())}\n`;
  faturaStr += `Créditos acumulados: ${calcularTotalCreditos()} \n`;
  return faturaStr;
}  
```

Veja agora que esse código fica responsável apenas por retornar uma string com a fatura 
formatada. Para isso, você deverá extrair mais uma função, chamada `calcularTotalFatura()`,
que já está sendo chamada no código acima.

Explicando melhor agora temos um método focado em apresentação, com poucas linhas de 
código e muito menor do que a versão inicial com a qual começamos esse roteiro,
no passo #1. Evidentemente, esse método chama métodos com a lógica para cálculo dos 
totais da fatura, especificamente:

* `calcularTotalApresentacao`
* `calcularTotalFatura`
* `calcularTotalCreditos`

Para garantir que está tudo funcionando, rode o código.

Em seguida, dê um **Commit & Push**, com a descrição: "Commit 5 - Separando Apresentação dos Cálculos".
