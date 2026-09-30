import express from 'express'

const app = express();

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

app.listen(3333, () => {
    console.log('api iniciou');
})