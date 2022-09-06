class Contenedor{
    constructor(config, name){
        this.knex = require('knex')(config);
        this.nameTable = name;
    }

    async createTable(fields) {
        try {
            if (!await this.knex.schema.hasTable(this.nameTable)) {
                await this.knex.schema.createTable(this.nameTable, fields)
                console.log(`Tabla ${this.nameTable} creada`);
            } else {
                console.log(`Tabla ${this.nameTable} ya existente`);
            }
        } catch (error) {
            console.log(error);
        }
    }

    async save(Object) {
        try {
            return await this.knex(this.nameTable)
                .insert(Object, 'id');
        } catch (error) {
            console.log(error);
        }
    }

    async getById(id) {
        try {
            return (
                    await this.knex(this.nameTable)
                        .select('*')
                        .where('id', id)
                    )
        } catch (error) {
            console.log(error);
        } finally {
            await this.knex.destroy();
        }
    }

    async getAll() {
        let contenedor = [];
        try {
            contenedor = await this.knex(this.nameTable).select("*");
        } catch (error) {
            console.log(error, 'getAll');
        }
        return contenedor;
    }

    async deleteById(id) {
        try {
            return (
                    await this.knex(this.nameTable)
                        .select('*')
                        .where('id', id)
                        .del('*')
                    )
        } catch (error) {
            console.log(error);
        } finally {
            await this.knex.destroy();
        }
    }

    async deleteAll() {
        try {
            return (
                    await this.knex(this.nameTable)
                        .select('*')
                        .del('*')
                    )
        } catch (error) {
            console.log(error);
        } finally {
            await this.knex.destroy();
        }
    }

    async updateProduct(Object) {
        try {
            return (
                    await this.knex(this.nameTable)
                        .select('*')
                        .where('id', id)
                        .update(Object)
                    )
        } catch (error) {
            console.log(error);
        } finally {
            await this.knex.destroy();
        }
    }
}

module.exports = Contenedor;