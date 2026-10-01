import express, { json } from 'express'
import 'dotenv/config'

const tarefas = [
    {
        nome: 'fazer os cruds',
        createdAt: '2026-09-30', 
        finalizada: false
    }
]

const app = express();

app.use(express.json());

app.get('/tarefas', (req, res) => {
    try {
        const id = req.query.id;

        if (id) {
            return res.status(200).send({
                message: 'dados recuperados',
                data: tarefas[id]
            })
        }

        return res.status(200).send({
            message: 'dados recuperados',
            data: tarefas
        })

    } catch (error) {
        return res.status(500).send({
            message: "Erro interno do servidor", 
            error: error.message
        })  
    }
});

app.post('/tarefas', (req, res) => {
    try {
        const corpo = req.body;

        if(!corpo.nome.trim()){
            return res.status(400).send({
                message: "sem nome"
            })
        }

        const jsonCriar = {
            nome: corpo.nome,
            createdAt: new Date(Date.now),
            finalizada: false
        }

        tarefas.push(jsonCriar);

        return res.status(201).send({
            message: "criado",
            data: jsonCriar
        })

    } catch (error) {
        return res.status(500).send({
            message: "Erro interno do servidor", 
            error: error.message
        })
    }
})

app.patch('/tarefas/:id', (req, res) => {
    try {
        const idEdicao = req.params.id;
        const {
            nome, 
            finalizada
        } = req.body;


        if(!(idEdicao == 0) || !idEdicao){
            return res.status(400).send({
                message: "sem id"
            })
        }

        const registro = tarefas[idEdicao];

        if(nome){
            registro.nome = nome;
        }

        if(finalizada){
            registro.finalizada = finalizada;
        }
        tarefas[idEdicao] = registro;

        return res.status(200).send({
            message: "registro atualizado",
            data: registro
        })



    } catch (error) {
        return res.status(500).send({
            message: "Erro interno do servidor", 
            error: error.message
        })
    }
})

app.delete('/tarefas/:id', (req, res) => {
    try {
        const idExclusao = req.params.id;

        if(!(idEdicao == 0) || !idEdicao){ 
            return res.status(400).send({
                message: "sem id"
            })
        }

        const excluido = tarefas.splice(idExclusao, 1);

        return res.status(200).send({
            message: "excluido",
            data: excluido
        })

    } catch (error) {
        return res.status(500).send({
            message: "Erro interno do servidor", 
            error: error.message
        })
    }
})

//rota Exemplo 3
app.post('/teste', (req, res) => {
    let corpo = req.body

    return res.status(200).send(
        {
            message: "opa",
            corpo: corpo
        }
    )

})
//rota Exemplo 1
app.get('/teste', (req, res) => {
    //return res.status(200).send('oi')
    
    let idade = req.query.idade;
    console.log(idade)
    return res.status(200).send(
        {
            nome : "Bolzan",
            idade : idade,
        }
    )
})
//rota Exemplo 2
app.get('/teste/:id', (req, res) => {
    
    let id = req.params.id;
    
    return res.status(200).send(
        {
            nome : "Bolzan",
            id: id
        }
    )
})

app.listen(process.env.API_PORT, () => {
    console.log('API iniciou na Porta ' + process.env.API_PORT);
})