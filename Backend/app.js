require('dotenv').config({path: "./config/.env"})
const express = require("express")
const connectDB = require('./DB/connection')
const app = express()
const path = require('path')
const allRouters = require("./Routing/allRouter")
const port = process.env.port
const cors = require('cors')
const socketInit = require('./services/socket.init')
const cornJob = require('./services/corn')



app.use(cors())
app.use(express.json())

app.use('/uploads', express.static(path.join(__dirname, './uploads')))
app.use("/api/v1/auth",allRouters.authRouter)
app.use("/api/v1/user",allRouters.userRouter)
app.use("/api/v1/product",allRouters.productRouter)
app.use("/api/v1/comment",allRouters.commentRouter)


app.get('/', (req, res) => res.send('Hello World!'))

connectDB()
const server = app.listen(port, () => {
    console.log(`server is runnin on port .... ${port}`);
})

socketInit(server)
cornJob()



