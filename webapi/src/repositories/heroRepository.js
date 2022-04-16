const { readFile, writeFile } = require("fs/promises");

class HeroRepository {
    constructor({ file }) {
        this.file = file;
    }

    //método utilitário privado
    async _currentFileContent() {
        return JSON.parse(await readFile(this.file));
    }

    async find(intemId) {
        const all = await this._currentFileContent();
        if (!intemId) return all;

        return all.find(({ id }) => id === intemId);
    }

    async create(data) {
        const currentFile = await this._currentFileContent();
        currentFile.push(data);

        await writeFile(this.file, JSON.stringify(currentFile));

        return data.id;
    }
}

module.exports = HeroRepository;

// const heroRepositoy = new HeroRepository({
//     file: "./../../database/data.json",
// });

// heroRepositoy
//     .find(1)
//     .then(console.log)
//     .catch((error) => console.log("error", error));

// heroRepositoy
//     .create({ id: 2, name: "Colossos", age: 1500, power: "Eternity" })
//     .then(console.log)
//     .catch((error) => console.log("error", error));
