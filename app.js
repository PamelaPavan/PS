const express = require('express');
const { engine } = require('express-handlebars');
const mysql = require('mysql2');
const app = express();
const dotenv = require('dotenv');

// Adiciona bootstrap
app.use('/bootstrap', express.static('./node_modules/bootstrap/dist'));
app.use('/scripts', express.static('./scripts'));

// Adiciona css
app.use('/css', express.static('./css'));

// Configuração do express-handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

// Manipulação de dados via rotas
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

// Cria a conexão com o banco de dados
const connection = mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    port: process.env.port,
    database: process.env.database
});

// Conecta ao banco de dados
connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conectado ao banco de dados!');
});

module.exports = connection;

const Handlebars = require('handlebars');

// Adicionar helper personalizado
Handlebars.registerHelper('gte', function(a, b) {
    return a >= b;
});

// Rota principal
app.get('/', function(req, res) {
    let sql = 'SELECT * FROM tarefas ORDER BY ordem_apresentacao ASC';
    connection.query(sql, function(erro, retorno) {
        if (erro) throw erro;
        res.render('formulario', { tarefas: retorno });
    });
});

// Rota principal contendo a situação
app.get('/:situacao', function(req, res) {
    let sql = 'SELECT * FROM tarefas ORDER BY ordem_apresentacao ASC';
    connection.query(sql, function(erro, retorno) {
        if (erro) throw erro;
        res.render('formulario', { tarefas: retorno, situacao: req.params.situacao });
    });
});

// Rota para incluir tarefas
app.post('/incluir', function(req, res) {
    try {
        let { nome, custo, data_limite } = req.body;
        data_limite = data_limite || null;

        if (nome === '' || custo === '' || isNaN(custo)) {
            return res.redirect('/falhaIncluir');
        } else {
            let sqlVerificar = 'SELECT * FROM tarefas WHERE nome = ?';
            connection.query(sqlVerificar, [nome], function(erro, resultado) {
                if (erro) throw erro;

                if (resultado.length > 0) {
                    connection.query('SELECT * FROM tarefas ORDER BY ordem_apresentacao ASC', function(erro, tarefas) {
                        if (erro) throw erro;
                        return res.render('formulario', { erro: 'O nome da tarefa já existe.', tarefas: tarefas });
                    });
                } else {
                    let sqlInserir = 'INSERT INTO tarefas (nome, custo, data_limite) VALUES (?, ?, ?)';
                    connection.query(sqlInserir, [nome, custo, data_limite], function(erro, retorno) {
                        if (erro) throw erro;
                        res.redirect('/okIncluir');
                    });
                }
            });
        }
    } catch (erro) {
        res.redirect('/falhaIncluir');
    }
});

// Rota para redirecionar para o formulário de edição
app.get('/formularioEditar/:id', function(req, res) {
    let sql = 'SELECT * FROM tarefas WHERE id = ?';
    connection.query(sql, [req.params.id], function(erro, retorno) {
        if (erro) throw erro;
        res.render('formularioEditar', { tarefa: retorno[0] });
    });
});

// Rota para remover tarefas
app.get('/remover/:id', function(req, res) {
    try {
        let sql = 'DELETE FROM tarefas WHERE id = ?';
        connection.query(sql, [req.params.id], function(erro) {
            if (erro) throw erro;
            res.redirect('/');
        });
    } catch (erro) {
        res.redirect('/');
    }
});

// Rota para editar tarefas
app.post('/editar', function(req, res) {
    let { id, nome, custo, data_limite } = req.body;
    data_limite = data_limite || null;

    if (nome === '' || custo === '' || isNaN(custo)) {
        return res.redirect('/');
    }

    let sqlVerificaNome = 'SELECT COUNT(*) AS total FROM tarefas WHERE nome = ? AND id <> ?';
    connection.query(sqlVerificaNome, [nome, id], function(erro, resultado) {
        if (erro) throw erro;

        if (resultado[0].total > 0) {
            return res.render('formularioEditar', { erro: 'O nome da tarefa já existe.' });
        } else {
            let sqlAtualiza = 'UPDATE tarefas SET nome = ?, custo = ?, data_limite = ? WHERE id = ?';
            connection.query(sqlAtualiza, [nome, custo, data_limite, id], function(erro) {
                if (erro) throw erro;
                res.redirect('/');
            });
        }
    });
});

// Rota para reordenar tarefas
app.post('/reordenar', function(req, res) {
    const novaOrdem = req.body.ordem;

    novaOrdem.forEach((id, index) => {
        let sql = 'UPDATE tarefas SET ordem_apresentacao = ? WHERE id = ?';
        connection.query(sql, [index + 1, id], function(erro) {
            if (erro) {
                console.error('Erro ao atualizar a ordem da tarefa:', erro);
                return res.status(500).json({ error: 'Erro ao atualizar a ordem das tarefas' });
            }
        });
    });

    res.status(200).json({ message: 'Ordem das tarefas atualizada com sucesso' });
});

// Servidor
app.listen(8080);
