const express = require('express');

const { engine } = require('express-handlebars');

const mysql = require('mysql2');

const app = express();

const dotenv = require('dotenv');

//Adiciona bootstrap
app.use('/bootstrap', express.static('./node_modules/bootstrap/dist'));

app.use('/scripts', express.static('./scripts'));

//Adiciona css
app.use('/css', express.static('./css'));

//Configuração do express-handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

//Manipulação de dados via rotas
app.use(express.json());
app.use(express.urlencoded({extended:false}));

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


//Rota principal
app.get('/', function(req, res){ //requisição(req) resposta(res)
    
    let sql = 'SELECT * FROM tarefas';

    connection.query(sql, function(erro, retorno){
        res.render('formulario', {tarefas:retorno}); //renderiza arquivo handlebars com a estrutura html
    });
    
});

//Rota principal contendo a situação
app.get('/:situacao', function(req, res){ 
    
    let sql = 'SELECT * FROM tarefas';

    connection.query(sql, function(erro, retorno){
        res.render('formulario', {tarefas:retorno, situacao:req.params.situacao}); 
    });
    
});

// Rota para Incluir tarefas
app.post('/incluir', function(req, res){
    try{
        let nome = req.body.nome;
    let custo = req.body.custo;
    let data_limite = req.body.data_limite ? `'${req.body.data_limite}'` : 'NULL';
    
    // Validar o nome da tarefa e o valor
    if(nome == '' || custo == '' || isNaN(custo)){
        res.redirect('/falhaIncluir');
    }else{
        let sql = `INSERT INTO tarefas (nome, custo, data_limite) VALUES ('${nome}', ${custo}, ${data_limite})`;

        connection.query(sql, function(erro, retorno){
            if (erro) throw erro;
            console.log(retorno);
    });
        res.redirect('/okIncluir');
    }    
    }catch(erro){
        res.redirect('/falhaIncluir');
    }
});

//Rota para redirecionar para o formulário de edição
app.get('/formularioEditar/:id', function(req, res){

    let sql = `SELECT * FROM tarefas WHERE id = ${req.params.id}`;

    connection.query(sql, function(erro, retorno){
        if (erro) throw erro;

        res.render('formularioEditar', {tarefa:retorno[0]});

    });

});


//Rota para remover tarefas
app.get('/remover/:id', function(req, res){
    
    // Tratamento de exceção
    try{
        let sql = `DELETE FROM tarefas WHERE id = ${req.params.id}`;

        connection.query(sql, function(erro, retorno){
        //Caso falhe
        if(erro) throw erro;

    });
    res.redirect('/');
    }catch(erro){
        res.redirect('/');
    }
});


app.post('/editar', function(req, res) {
    // Obter os dados do formulário
    let id = req.body.id;
    let nome = req.body.nome;
    let custo = req.body.custo;
    let data_limite = req.body.data_limite ? `'${req.body.data_limite}'` : 'NULL';

    // Validar nome e valor da tarefa
    if (nome === '' || custo === '' || isNaN(custo)) {
        return res.redirect('/');
    }

    // Verificar se o nome já existe
    const sqlVerificaNome = `SELECT COUNT(*) AS total FROM tarefas WHERE nome = ? AND id <> ?`;
    connection.query(sqlVerificaNome, [nome, id], function(erro, resultado) {
        if (erro) throw erro;

        if (resultado[0].total > 0) {
           
            return res.render('formularioEditar', {erro: 'O nome da tarefa já existe.'});
            
        } {
            // Atualizar a tarefa no banco de dados
            let sqlAtualiza = `UPDATE tarefas SET nome = ?, custo = ?, data_limite = ? WHERE id = ?`;
            connection.query(sqlAtualiza, [nome, custo, data_limite, id], function(erro) {
                if (erro) throw erro;
                res.redirect('/');
            });
        }
    });
});
app.get('/nomeExistente', function(req, res) {
    let mensagemErro = 'O nome da tarefa já existe. Por favor, escolha outro nome.';
    
    let sql = 'SELECT * FROM tarefas';
    
    connection.query(sql, function(erro, tarefas) {
        if (erro) throw erro;

        // Para a tarefa específica que estava sendo editada, você pode precisar armazenar o ID
        let tarefaId = req.query.id; // Obter o ID da tarefa do query string, se necessário

        // Se a tarefa ID não estiver disponível, escolha uma tarefa padrão
        let tarefaAtual = tarefas.find(t => t.id === parseInt(tarefaId)) || {}; // Obtenha a tarefa ou um objeto vazio

        // Renderiza o formulário de edição passando a mensagem de erro e a tarefa atual
        res.render('formularioEditar', {
            tarefas: tarefas,
            erro: mensagemErro,
            tarefa: tarefaAtual // Passa a tarefa que está sendo editada
        });
    });
});


//servidor
app.listen(8080);