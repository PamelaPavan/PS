// src/config/database.js
const mysql = require('mysql2');
const dotenv = require('dotenv');

// Carrega variáveis de ambiente
dotenv.config();

// Cria a conexão com o banco de dados usando a URL do arquivo .env
const connection = mysql.createConnection(process.env.DATABASE_URL);

// Estabelece a conexão e trata erros
connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conexão bem-sucedida ao banco de dados!');
});

module.exports = connection;
