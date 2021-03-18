const express = require("express");
const app = express();
const bodyParser = require('body-parser');

const connection = require('./database/database');

const Pergunta = require('./database/Pergunta');
const Resposta = require('./database/Resposta');

connection.authenticate().then(()=>{
    console.log('Banco de dados: OK');
}).catch((msgerro)=>{
    console.log(msgerro);
});

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    Pergunta.findAll({ raw : true, order:[
        ['id' , 'DESC'] //'DESC' é para deixar crescente a partir do ID; caso fosse decressente seria 'ASC'
    ] }).then((perguntas)=>{
        res.render('index', {
            perguntas : perguntas
        })
    });
});

app.get('/perguntar', (req, res) => {
    res.render('perguntar');
});

app.post('/salvarpergunta', (req, res) => {
    var title = req.body.titulo;
    var desc = req.body.desc;
    Pergunta.create({
        titulo : title,
        descricao : desc
    }).then(() => {
        res.redirect('/');
    });
});

app.post('/salvarresposta', (req, res) => {
    var corpo = req.body.corpo;
    var perguntaId = req.body.perguntaId;

    Resposta.create({
        corpo : corpo,
        perguntaId : perguntaId
    }).then(() => {
        res.redirect('/pergunta/'+perguntaId);
    });
});

app.get('/pergunta/:id', (req, res) => {
    var id = req.params.id;
    Pergunta.findOne({
        where: {id : id}
    }).then((pergunta)=>{
        if(pergunta !=undefined){ //pergunta encontrada
            Resposta.findAll({
                where: {perguntaId : pergunta.id}
            }).then((respostas) => {
                res.render('pergunta', {
                    pergunta : pergunta,
                    respostas : respostas
                });
            });
        }else{ //pergunta n encontrada
            res.redirect('/')
        }
    });
});

app.listen(8080, ()=>{
    console.log("app rodando");
})