import express from 'express'
import cors from 'cors'
const app = express();
const port = process.env.PORT || 4000

app.use(cors()) //Habilita o CORS-Cross-origin resource sharing
app.use(express.urlencoded({extended: true}));
app.use(express.json()) // Parse JSON payloads
app.disable('x-powered-by') //Removendo o x-powered-by por segurança

import rotasfilmes from './routes/filmes.mjs'
//Rotas dos filmes
app.use("/filmes", rotasfilmes)

//Definimos a nossa rota default
app.get('/', (req, res) => {
  res.status(200).json({
      mensagem: 'API 100% funcional!',
      versao: '1.0.1'
  })
})

app.listen(port, function () {
  console.log(`Servidor rodando na porta ${port}`)
})