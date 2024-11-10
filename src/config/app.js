// src/app.js
const express = require('express');
const { engine } = require('express-handlebars');
const app = express();
const tarefasRouter = require('../routes/tasks');
const dotenv = require('dotenv');

// Carrega as variáveis de ambiente
dotenv.config();

// Configuração do express-handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');

// Middleware para servir arquivos estáticos
app.use('/bootstrap', express.static('./node_modules/bootstrap/dist'));
app.use('/scripts', express.static('./scripts'));
app.use('/css', express.static('./css'));

// Configurações para manipulação de dados
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Define as rotas para tarefas
app.use('/tarefas', tarefasRouter);

// Inicia o servidor
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
