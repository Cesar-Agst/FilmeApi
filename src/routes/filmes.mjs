// API REST dos filmes
import express from 'express'
import { connectToDatabase } from '../utils/mongodb.mjs'
import { check, validationResult } from 'express-validator'

const router = express.Router()
const filmesCollection = 'filmes'
const { db, ObjectId } = await connectToDatabase()

/**********************************************
 * Validações
 * 
 **********************************************/
 const validaFilmes = [
  
  check('titulo', 'O titulo do filme é obrigatório').not().isEmpty(),
  check('lançamento', 'O ano de lançamente é obrigatório [emtre 1888 a 2030]').isInt({ min: 1888, max: 2040 }),
  check('gênero', 'O gênero do filme é obrigatório').not().isEmpty(),
  check('direção', 'O nome do(a) diretor(a) é obrigatório').not().isEmpty(),
  
]

/**********************************************
 * GET /Filmes/
 * Lista todos os Filmes
 **********************************************/
router.get("/", async (req, res) => {
  try {
    db.collection(filmesCollection).find({}).toArray((err, docs) => {
      if (err) {
        res.status(400).json(err) //bad request
      } else {
        res.status(200).json(docs) //retorna os documentos
      }
    })
  } catch (err) {
    res.status(500).json({ "error": err.message })
  }
})

/**********************************************
 * GET /Filmes/:id
 * Lista o filme através do id
 **********************************************/
router.get("/:id", async (req, res) => {
  try {
    db.collection(filmesCollection).find({ "_id": { $eq: ObjectId(req.params.id) } }).toArray((err, docs) => {
      if (err) {
        res.status(400).json(err) //bad request
      } else {
        res.status(200).json(docs) //retorna o documento
      }
    })
  } catch (err) {
    res.status(500).json({ "error": err.message })
  }
}) 

/**********************************************
 * GET /Filme/nome/:nome
 * Lista o Filme através de parte do seu nome
 **********************************************/
router.get("/titulo/:titulo", async (req, res) => {
  try {
    db.collection(filmesCollection).find({ titulo: {$regex: req.params.titulo, $options: "i"} }).toArray((err, docs) => {
      if (err) {
        res.status(400).json(err) //bad request
      } else {
        res.status(200).json(docs) //retorna o documento
      }
    })
  } catch (err) {
    res.status(500).json({ "error": err.message })
  }
})

/**********************************************
 * POST /Filmes/
 * Inclui um novo Filme
 **********************************************/
router.post('/', validaFilmes, async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json(({
      errors: errors.array()
    }))
  } else {
    await db.collection(filmesCollection)
      .insertOne(req.body)
      .then(result => res.status(201).send(result)) //retorna o ID do documento inserido)
      .catch(err => res.status(400).json(err))
  }
})


/**********************************************
 * PUT /filmes/
 * Alterar um filme pelo ID
 **********************************************/
router.put('/', validaFilmes, async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json(({
      errors: errors.array()
    }))
  } else {
    const FilmeInput = req.body
    await db.collection(filmesCollection)
      .updateOne({ "_id": { $eq: ObjectId(req.body._id) } }, {
        $set:
        {
          titulo: FilmeInput.titulo,
          lançamento: FilmeInput.lançamento,
          genêro: FilmeInput.genêro,
          direção: FilmeInput.direção,
          
          

        }
      },
        { returnNewDocument: true })
      .then(result => res.status(202).send(result))
      .catch(err => res.status(400).json(err))
  }
})

/**********************************************
 * DELETE /Filmes/
 * Apaga um filme pelo ID
 **********************************************/
router.delete('/:id', async (req, res) => {
  await db.collection(filmesCollection)
    .deleteOne({ "_id": { $eq: ObjectId(req.params.id) } })
    .then(result => res.status(202).send(result))
    .catch(err => res.status(400).json(err))
})

export default router
