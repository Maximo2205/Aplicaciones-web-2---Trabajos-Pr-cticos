import express from 'express'

const PUERTO = 3000
const app = express()

app.use(express.static('front'))

app.get('/',(req, res)=>{
    res.status(200)
})

app.listen(PUERTO,()=>{
    console.log(`http://localhost:${3000}`)
}
)
