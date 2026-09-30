import express from 'express'
import 'dotenv/config'

const app = express();

app.use(express.json());

app.post('/teste', (req, res) => {
    let corpo = req.body



    return res.status(200).send(
        {
            message: "opa",
            corpo: corpo
        }
    )

})

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