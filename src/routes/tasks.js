// src/routes/tasks.js
const express = require('express');
const router = express.Router();
const connection = require('../config/database');
const Handlebars = require('handlebars');

// Helper de formatação de data
Handlebars.registerHelper('formatDate', function(date) {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
});

// Helper para comparar valores
Handlebars.registerHelper('gte', function(a, b) {
    return a >= b;
});

// Rota principal
router.get('/', (req, res) => {
    const situacao = req.query.situacao;
    const sql = 'SELECT * FROM tarefas ORDER BY ordem_apresentacao ASC';

    connection.query(sql, (erro, retorno) => {
        if (erro) throw erro;
        res.render('formulario', { tarefas: retorno, situacao });
    });
});

// Rota para incluir tarefa
router.post('/incluir', (req, res) => {
    let { nome, custo, data_limite } = req.body;
    data_limite = data_limite || null;

    if (!nome || !custo || isNaN(custo)) {
        return res.redirect('/falhaIncluir');
    }
    // Verifica duplicação de nome
    const sqlVerificar = 'SELECT * FROM tarefas WHERE nome = ?';
    connection.query(sqlVerificar, [nome], (erro, resultado) => {
        if (erro) throw erro;

        if (resultado.length > 0) {
            return res.render('formulario', { erro: 'O nome da tarefa já existe.' });
        }

        // Insere nova tarefa
        const sqlInserir = 'INSERT INTO tarefas (nome, custo, data_limite) VALUES (?, ?, ?)';
        connection.query(sqlInserir, [nome, custo, data_limite], (erro) => {
            if (erro) throw erro;
            res.redirect('/Tarefa incluida!');
        });
    });
});

module.exports = router;
