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

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

// Substitua a URL de conexão direta pela variável de ambiente
const connectionUrl = process.env.DATABASE_URL;

// Cria a conexão com o banco de dados usando a URL do .env
const connection = mysql.createConnection(connectionUrl);


// Conecta ao banco de dados
connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conexão bem-sucedida ao banco de dados!');
});

module.exports = connection;

const Handlebars = require('handlebars');


// Helper para formatação de data
Handlebars.registerHelper('formatDate', function(date) {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
});


// Adicionar helper personalizado
Handlebars.registerHelper('gte', function(a, b) {
    return a >= b;
});

// Rota principal
app.get('/', function(req, res) {
    let situacao = req.query.situacao; // Captura o valor do parâmetro 'situacao' se existir
    let sql = 'SELECT * FROM tarefas ORDER BY ordem_apresentacao ASC';
    
    connection.query(sql, function(erro, retorno) {
        if (erro) throw erro;
        res.render('formulario', { tarefas: retorno, situacao }); // Passa a mensagem 'situacao' para o template
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
                        res.redirect('/Tarefa incluida!');
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
            res.redirect('/?situacao=Tarefa removida com sucesso!');
        });
    } catch (erro) {
        res.redirect('/?situacao=Erro ao remover a tarefa.');
    }
});

// Rota para editar tarefas
app.post('/editar', function(req, res) {
    let { id, nome, custo, data_limite } = req.body;
    data_limite = data_limite || null;

    if (nome === '' || custo === '' || isNaN(custo)) {
        return res.redirect('/?situacao=Erro: campos inválidos.');
    }

    let sqlVerificaNome = 'SELECT COUNT(*) AS total FROM tarefas WHERE nome = ? AND id <> ?';
    connection.query(sqlVerificaNome, [nome, id], function(erro, resultado) {
        if (erro) throw erro;

        if (resultado[0].total > 0) {
            return res.redirect('/?situacao=Erro: o nome da tarefa já existe.');
        } else {
            let sqlAtualiza = 'UPDATE tarefas SET nome = ?, custo = ?, data_limite = ? WHERE id = ?';
            connection.query(sqlAtualiza, [nome, custo, data_limite, id], function(erro) {
                if (erro) throw erro;
                res.redirect('/?situacao=Tarefa editada com sucesso!');
            });
        }
    });
});


app.post('/reordenar', function(req, res) {
    console.log("Dados recebidos:", req.body);
    const novaOrdem = req.body.ordem_apresentacao;

    if (!Array.isArray(novaOrdem)) {
        return res.status(400).json({ error: 'Ordem inválida' });
    }

    connection.beginTransaction((err) => {
        if (err) {
            console.error('Erro ao iniciar a transação:', err);
            return res.status(500).json({ error: 'Erro ao iniciar a transação' });
        }

        // Passo 1: Atualiza para valores altos temporariamente para evitar duplicidade
        const tempPromises = novaOrdem.map((id, index) => {
            return new Promise((resolve, reject) => {
                const sql = 'UPDATE tarefas SET ordem_apresentacao = ? WHERE id = ?';
                connection.query(sql, [index + 1000, id], (erro) => {
                    if (erro) return reject(erro);
                    resolve();
                });
            });
        });

        // Passo 2: Atualiza para a nova ordem correta
        Promise.all(tempPromises)
            .then(() => {
                const updatePromises = novaOrdem.map((id, index) => {
                    return new Promise((resolve, reject) => {
                        const sql = 'UPDATE tarefas SET ordem_apresentacao = ? WHERE id = ?';
                        connection.query(sql, [index + 1, id], (erro) => {
                            if (erro) return reject(erro);
                            resolve();
                        });
                    });
                });

                return Promise.all(updatePromises);
            })
            .then(() => {
                connection.commit((commitErr) => {
                    if (commitErr) {
                        connection.rollback(() => {
                            console.error('Erro ao confirmar a transação:', commitErr);
                            res.status(500).json({ error: 'Erro ao confirmar a transação' });
                        });
                    } else {
                        res.status(200).json({ message: 'Ordem das tarefas atualizada com sucesso' });
                    }
                });
            })
            .catch((erro) => {
                connection.rollback(() => {
                    console.error('Erro ao atualizar a ordem:', erro);
                    res.status(500).json({ error: 'Erro ao atualizar a ordem das tarefas' });
                });
            });
    });
});


// Servidor
app.listen(8080);
