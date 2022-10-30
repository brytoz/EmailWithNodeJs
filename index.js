const express = require('express')
const nodemailer = require('nodemailer')
const cors = require('cors')
const path = require('path')
const app = express()
const PORT = 5000
const {emailValidation} = require('./validate/validate')


// parse application/json
app.use(express.json())
app.use(express.urlencoded({extended:true}))

// allow data to send securely over web networks
const corsOption = {
    origin: '*',
    methods: ["GET", "POST"],
    credentials: true,
    optionSuccessStatus:200,
}
app.use(cors(corsOption))


app.use('/static', express.static('/static'))


// redirect to form page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'static/index.html'))
})

app.get('/data', (req, res, next) => {
    return res.json({info:'testing info'})
})


app.post('/action', async (req, res, next) => {

    // error message from input check
    const { error } = emailValidation(req.body)

    if (error) {
        return res.status(202).send(error.details[0].message)
    }

    const {from, to, subject, msg} = req.body


    // create test account using https://ethereal.email/create
    let testAccount = await nodemailer.createTestAccount();

    // test account access
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure:false,
        auth: {
            user: testAccount.user, 
            pass: testAccount.pass   
        }
    });

    const mails = { from, to, subject, msg }

    // persist request
    await transporter.sendMail({...mails}).then((result) => {
        return res.status(201).json({res: result, status: 'Successfully Sent'})
    }).catch((err) => {
        
        return res.status(400).json({ error: err})
    })

})



app.listen(PORT, () => console.log(`Server started at port ${PORT}`))