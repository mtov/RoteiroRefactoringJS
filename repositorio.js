const { readFileSync } = require('fs');

module.exports = class Repositorio {
    constructor() {
      this.pecas = JSON.parse(readFileSync('./pecas.json'));
    }

    getPeca(apre) {
      return this.pecas[apre.id];
    }
}