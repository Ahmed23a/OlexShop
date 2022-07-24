const nodeoutlook = require('nodejs-nodemailer-outlook')
const sendEmail = (destination, msg , attachment = null)=>
{
    nodeoutlook.sendEmail({
        auth: {
            user: process.env.senderEmail,
            pass: process.env.senderPassword
        },

        from: process.env.senderEmail,
        to: destination,
        subject: 'Hey you, awesome!',
        html: msg,
        text: 'This is text version!',
        attachments:attachment,       
    })

}




module.exports =
{
    sendEmail
}