import express from 'express'
import path from 'path'
import { v4 } from 'uuid'

const __dirname = path.resolve()
const app = express()
const PORT = process.env.PORT ?? 3000
let NOTES = [
    {
    id: v4(),
    title: 'записать курс',
    completed: false
    },
    {
    id: v4(),
    title: 'напиши кому нибудь',
    completed: true,
    }
]

app.use(express.json())

// GET
app.get('/api/notes', (req, res) => {
    res.status(200).json(NOTES)
})

//POST
app.post('/api/notes', (req, res) => {
    const note = {id: v4(), ...req.body, completed:false}
    NOTES.push(note)
    res.status(201).json(note)
})
//DELETE
app.delete('/api/notes/:id', (req, res) => {
    console.log(NOTES)
    NOTES = NOTES.filter(c => c.id !== req.params.id)
    res.status(200).json({message: 'Contact was determinate'})
})

//PUT
app.put('/api/notes/:id', (req, res) => {
    const idx = NOTES.findIndex(c => c.id === req.params.id)
    NOTES[idx] = req.body
    res.json(NOTES[idx])
})

app.use(express.static(path.resolve(__dirname, 'static')))

app.get('/', (req, res) => {
    res.render('index', {title: 'Notice page'})
})

app.listen(PORT, () => {
    console.log(`Server has been started on port ${PORT}...`)
})