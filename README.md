# Roteiro de Refactoring (versão JavaScript)

**Prof. Marco Tulio Valente**

Objetivo: colocar em prática os conceitos de refactoring aprendidos na sala de aula. 
Para isso, você vai realizar alguns refactorings em um sistema hipotético, 
também usado no primeiro capítulo da segunda edição do 
[livro](https://martinfowler.com/books/refactoring.html)
do Martin Fowler, que é o livro clássico sobre o tema.

Para tirar proveito do roteiro é **importante não apenas seguir os passos mecanicamente, 
mas também analisar os benefícios alcançados com cada refactoring**. Ou seja, pense 
sempre nos motivos que tornam o código refatorado melhor do que o código anterior.

Em caso de dúvida, você pode consultar o [Capítulo 9](https://engsoftmoderna.info/cap9.html) 
do nosso livro.

O exemplo está em JavaScript, mas a sintaxe é familiar mesmo para aqueles que nunca programaram 
nessa linguagem. 

Para executar o código, você vai precisar instalar o `node.js`. Para mais informações clique 
[aqui](https://nodejs.org/en/download).

Instruções:

* Primeiro, crie um repositório no GitHub.

* Siga o roteiro, refactoring a refactoring.

* Após cada etapa, dê um **COMMIT & PUSH**, adicionado uma descrição (mensagem) no commit 
conforme as instruções do roteiro. Esses commits serão usados na correção, para garantir 
que você realizou todos os refactorings solicitados. 

* **Códigos que não compilam -- em qualquer um dos refactorings e passos -- serão avaliados 
  om nota zero pelo nosso sistema de correção automática**.

## 1. Função inicial

A funçaõ que iremos refatorar faz parte de um sistema usado por uma companhia de teatro
para gerar faturas. Explicando um pouco mais, essa companhia faz apresentações 
de algumas peças para certos clientes. E ela quer no final do mês gerar uma 
fatura para tais clientes, com o valor do serviço prestado.

Primeiro, estude com calma a versão inicial da função `gerarFaturaStr`, 
disponível neste [link](https://github.com/mtov/RoteiroRefactoringJS/blob/main/index.js).

**Importante:**

* No código, usamos o termo `peca` (sem cedilha) para denotar uma peça apresentada
  pela companhia. Por isso, existem funções chamadas, por exemplo, `getPeca`. 

* Os dados das apresentações feitas pela companhia de teatro estão
em um 
[arquivo](https://github.com/mtov/RoteiroRefactoringJS/blob/main/faturas.json) 
no formato JSON. Em um segundo 
[arquivo](https://github.com/mtov/RoteiroRefactoringJS/blob/main/pecas.json), 
estão informações sobre as peças do repertório da companhia de teatro.

Execute também a função do exemplo usando o comando: 

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

Agora, você deve extrair uma função com código do `switch` interno a `gerarFaturaStr`. 
A nova função deve se chamar `calcularTotalApresentacao` e, portanto, vai calcular 
o valor que deve ser pago para uma determinada extração. Após a extração, o código 
ficará assim:

```js
function gerarFaturaStr(fatura, pecas) {

    function calcularTotalApresentacao(apre, peca) {
      let total = 0;
      switch (peca.tipo) {
        ...
      ...
      return total;
    }
    ...
    let total = calcularTotalApresentacao(apre, peca);
    ....
}          
```

Veja que em JavaScript podemos ter uma função implementada dentro de uma função 
mais externa, tal como no código acima.

Execute seu código, para garantir que está tudo funcionando do mesmo jeito.

Em seguida, dê um **Commit & Push**, com a descrição: "Commit 2 - Extração de Função".

## 3. Replace Temp with Query

Esse refactoring substitui uma variável local (`temp`) por uma função que 
apenas retorna seu valor, isto é, uma *query*.

Vamos então substituitir a variável local `peca` usada no corpo principal 
de `gerarFaturaStr` por uma função que retorna o seu valor.

Primeiro, vamos criar a função *query*  (`getPeca`) e chamá-la no corpo 
principal de `gerarFaturaStr`.

```js
function gerarFaturaStr(fatura, pecas) {

    function getPeca(apresentacao) {
      return pecas[apresentacao.id];
    }
    ...
    
    for (let apre of fatura.apresentacoes) {
      const peca = getPeca(apre);
```

No próximo passo, você deve:
- deletar a declaração da variável local `peca`. Isto é, deletar (ou comentar) a linha

  `const peca = getPeca(apre);` 
  
- substituir todo uso de `peca` por uma chamada a `getPeca(apre)`. Ao todo, 
`peca` é usada em três pontos no corpo principal da função.

Feito isso, rode o código para garantir que está tudo funcionando.

**Qual o benefício desse refactoring?**

Após esse refactoring, nós podemos prosseguir e remover também o parâmetro `peca` de 
`calcularTotalApresentcao` e substituir os seus usos por chamadas a `getPeca`. 
Isso torna a função mais simples, pois ela terá apenas um parâmetro, em vez de 
dois como antes.

Especificamente, você deve:
- remover o parâmetro `peca` de `calcularTotalApresentacao`. Logo, ela terá agora 
  um único parâmetro (`apre`).
- No corpo de `calcularTotalApresentacao`, substituir todos os usos do parâmetro 
  removido por chamadas a `getPeca`.
- Atualizar a chamada de `calcularTotalApresentacao`, no corpo da função principal, 
  para agora usar apenas um parâmetro de chamada.

Em seguida, dê um **Commit & Push**, com a descrição: "Commit 3 - Replace Temp with Query
".

## 4. Mais Extract Functions

#### Extraindo a função `CalcularCredito`

Vamos agora extrair mais uma função, para calcular quantos créditos o cliente 
ganhará com uma apresentação. No nosso sistema, créditos é uma espécie de bônus
ou descontos para compras de apresentações de teatro no futuro.

Veja como ficará o código:

```js
function gerarFaturaStr(fatura, pecas) {

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

Para simplificar, vamos também extrair a inicialização da variável local 
`format`para uma função e remover essa variável:

```js
function gerarFaturaStr(fatura, pecas) {

    function formatarMoeda(valor) {
      return new Intl.NumberFormat("pt-BR",
        { style: "currency", currency: "BRL",
          minimumFractionDigits: 2 }).format(valor/100);
    }
```

Feito isso, remova o código extraído do corpo da função principal e, no seu lugar, 
chame a nova função (`formatarMoeda`). 

Para garantir que está tudo funcionando, rode o código.

Em seguida, dê um **Commit & Push**, com a descrição: "Commit 4 - Mais Extract Functions".

## 5. Separando Apresentação dos Cálculos

Estamos agora em um ponto importante do roteiro, no qual vamos fazer uma simplificação grande 
no corpo da função principal, que deverá ficar assim:

```js
function gerarFaturaStr(fatura, pecas) {

  // funções aninhadas

  // corpo principal (após funções aninhadas)
  let faturaStr = `Fatura ${fatura.cliente}\n`;
  for (let apre of fatura.apresentacoes) {
      faturaStr += `  ${getPeca(apre).nome}: ${formatarMoeda(calcularTotalApresentacao(apre))} (${apre.audiencia} assentos)\n`;
  }
  faturaStr += `Valor total: ${formatarMoeda(calcularTotalFatura())}\n`;
  faturaStr += `Créditos acumulados: ${calcularTotalCreditos()} \n`;
  return faturaStr;
}  
```
Esse código apenas retorna uma string com a fatura formatada. Para que ele funcione corretamente, 
você deverá extrair mais uma função, chamada `calcularTotalFatura()`, que já está sendo chamada 
no código acima.

Explicando melhor: agora, temos um método focado em apresentação (ou interface com o usuário), 
cujo corpo principla possui poucas linhas de código e que é muito menor do que a versão 
inicial com a qual começamos esse roteiro. Evidentemente, esse método chama métodos 
para cálculo dos totais da fatura, especificamente:

* `calcularTotalApresentacao`
* `calcularTotalFatura`
* `calcularTotalCreditos`

Para garantir que está tudo funcionando, rode o código.

Em seguida, dê um **Commit & Push**, com a descrição: "Commit 5 - Separando Apresentação dos Cálculos".

## 6. Move Function

Agora você deve mover todas as funções aninhadas em `gerarFaturaStr` para "fora" dessa função.
Normalmente, um Move Function move funções de um arquivo para outro; mas estamos considerando
que ele aplica-se também a movimentações de funções aninhadas para um escopo mais externo.

Após essa refatoração, o código vai ficar como mostrado a seguir. Observe que algumas funções 
ganharam um parâmetro extra (`pecas`). Logo, a chamada delas deve ser ajustada para incluir 
esse novo parâmetro.

```js
function formatarMoeda(valor) {
  ...
}

function getPeca(pecas, apre) {
  ...
}

function calcularCredito(pecas, apre) {  
  ...
}

function calcularTotalCreditos(pecas, apresentacoes) {
  ...
}

function calcularTotalApresentacao(pecas, apre) {
  ...
}

function calcularTotalFatura(pecas, apresentacoes) {
   ...
}

function gerarFaturaStr(fatura, pecas) {
  ...
}    
```

Para garantir que está tudo funcionando, rode o código.

Em seguida, dê um **Commit & Push**, com a descrição: "Commit 6 - Move Function".

## 7. Fatura em HTML

O refactoring anterior vai facilitar bastante a criação de um segundo tipo
de fatura, agora em HTML, tal como mostrado a seguir:

```html
<html>
<p> Fatura UFMG </p>
<ul>
<li>  Hamlet: R$ 650,00 (55 assentos) </li>
<li>  As You Like It: R$ 580,00 (35 assentos) </li>
<li>  Othello: R$ 500,00 (40 assentos) </li>
</ul>
<p> Valor total: R$ 1.730,00 </p>
<p> Créditos acumulados: 47 </p>
</html>
```

Especificamente, você deverá:

* Criar uma nova função `gerarFaturaHTML` que gera uma fatura como essa acima.
* Acrescentar uma chamada para essa função no programa principal.

Ou seja, teremos agora duas funções para geração de faturas:

```js
function gerarFaturaStr(fatura, pecas) {
  ...
}

function gerarFaturaHTML(fatura, pecas) {
  ...
}
```

É importante refletir sobre como foi fácil criar essa segunda forma de 
apresentação de uma fatura. Todas as funções de cálculo foram integralmente 
reusadas. Sendo mais claro, a mudança ficou restrita à lógica de apresentação e 
não precisamos modificar nenhuma lógica de negócio.

Para garantir que está tudo funcionando, rode o código. Veja que agora o 
programa deverá exibir duas faturas: uma em string e outra em HTML.

Em seguida, dê um **Commit & Push**, com a descrição: "Commit 7 - Fatura em HTML".

## 7. Criando uma classe `ServicoCalculoFatura`

Agora, vamos fazer uma mudança muito importante no programa: vamos criar uma
classe, chamada `ServicoCalculoFatura` para modularizar a implementação das
funções de cálculo. Ou seja, essa classe vai ter o seguinte formato:

```js
class ServicoCalculoFatura {
   calcularCredito(pecas, apre) {
     ...
   }
   calcularTotalCreditos(pecas, apresentacoes) {
      ...
   }
   calcularTotalApresentacao(pecas, apre) {
      ...
   }
   calcularTotalFatura(pecas, apresentacoes) {
      ... 
   }
}
```

Ou seja, criamos a classe e movemos para ela todos os métodos de cálculo.

Importante:

1. Os métodos de uma classe não são precedidos da palavra reservada `function`, tal como 
pode ser visto no código acima.

2. Quando um método da classe chama um outro método, essa chamada deve ser feita 
tendo como alvo o objeto `this`. Exemplo:

```js
calcularTotalFatura(pecas, apresentacoes) {
   let total = 0;
   for (let apre of apresentacoes) {
     total += this.calcularTotalApresentacao(pecas, apre); 
   }  
   return total;         
}
```

3. No programa principal, você deve agora criar um objeto da nova classe
e passá-lo como parâmetro de `gerarFaturaStr`

```js
calc = new ServicoCalculoFatura();
const faturaStr = gerarFaturaStr(faturas, pecas, calc);
```

4. Por fim, no corpo `gerarFaturaStr` as chamadas dos métodos de cálculo deverão
ser feitas usando o novo parâmetro `calc`, tal como nesse exemplo:

```js
calc.calcularTotalApresentacao(pecas, apre)
```

Para garantir que está tudo funcionando, rode o código. 

Em seguida, dê um **Commit & Push**, com a descrição: "Commit 8 - Classe ServicoCalculoFatura".

## 9. Criando um `Repositório`

Agora vamos criar nossa segunda classe, chamada `Repositorio` que vai encapsular o
arquivo JSON com os dados das peças do repertório da companhia de teatro. Segue o
seu código:

```js
class Repositorio {
  constructor() {
    this.pecas = JSON.parse(readFileSync('./pecas.json'));
  }

  getPeca(apre) {
    return this.pecas[apre.id];
  }
}
```

E também crie o seguinte construtor na classe `ServicoCalculoFatura`:

```js
class ServicoCalculoFatura {

  constructor(repo) {
     this.repo = new Repositorio();
  }
  ...
```  

Em seguida, faça os ajustes necessários:

1. Todos os métodos `calcular` de  `ServicoCalculoFatura` não vai mais precisar do parâmetro `pecas`, que poderá ser removido.

2. Agora, para chamar `getPecas` esses métodos vão ter que fazer a chamada como nesse exemplo:

```js
if (this.repo.getPeca(apre).tipo === "comedia") 
```  

3. A função `gerarFaturaStr` também não vai mais precisar do parâmetro `pecas`, que poderá ser removido.

4. Em `gerarFaturaStr`, a chamada a `getPeças` deverá ser feita assim:

```js
calc.repo.getPeca(apre).nome

5. No programa principal, não vamos mais precisar de ler o arquivo de peças.

Para garantir que está tudo funcionando, rode o código. 

Em seguida, dê um **Commit & Push**, com a descrição: "Commit 9 - Classe Repositorio".
