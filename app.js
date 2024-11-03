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

app.post('/incluir', function(req, res){
    try {
        let nome = req.body.nome;
        let custo = req.body.custo;
        let data_limite = req.body.data_limite ? `'${req.body.data_limite}'` : 'NULL';

        // Validar o nome da tarefa e o valor
        if (nome == '' || custo == '' || isNaN(custo)) {
            res.redirect('/falhaIncluir');
        } else {
            // Verificar se o nome da tarefa já existe
            let sqlVerificar = `SELECT * FROM tarefas WHERE nome = '${nome}'`;
            connection.query(sqlVerificar, function(erro, resultado) {
                if (erro) throw erro;

                if (resultado.length > 0) {
                    // Nome da tarefa já existe; buscar lista de tarefas para manter a exibição
                    connection.query('SELECT * FROM tarefas', function(erro, tarefas) {
                        if (erro) throw erro;
                        // Renderiza a página com a lista de tarefas e a mensagem de erro
                        return res.render('formulario', { erro: 'O nome da tarefa já existe.', tarefas: tarefas });
                    });
                } else {
                    // Inserir nova tarefa
                    let sqlInserir = `INSERT INTO tarefas (nome, custo, data_limite) VALUES ('${nome}', ${custo}, ${data_limite})`;
                    connection.query(sqlInserir, function(erro, retorno) {
                        if (erro) throw erro;
                        console.log(retorno);
                        res.redirect('/okIncluir');
                    });
                }
            });
        }
    } catch (erro) {
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

        else if (resultado[0].total > 0) {
            
            return res.render('formularioEditar', {erro: 'O nome da tarefa já existe.'});
                
        } else{
            // Atualizar a tarefa no banco de dados
            let sqlAtualiza = `UPDATE tarefas SET nome = ?, custo = ?, data_limite = ? WHERE id = ?`;
            connection.query(sqlAtualiza, [nome, custo, data_limite, id], function(erro) {
                if (erro) throw erro;
                res.redirect('/');
            });
        }
    });
});



//servidor
app.listen(8080);