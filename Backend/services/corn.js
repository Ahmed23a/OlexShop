const schedule = require('node-schedule');
const moment = require('moment')
const path = require('path')
const productModel = require('../DB/model/product')
const userModel = require('../DB/model/user')
const { createProductPDF } = require('./pdf')
const {sendEmail} = require('./sendEmail')


function cornJob ()
{
  

    const sendProductsPDF = async ()=>
    {
        const today = moment().format('YYYY-MM-DD')
        
        const products = await productModel.find({createdAt: {$gte : today},isDeleted: false})
        .select("_id title price description")

        

        const admins = await userModel.find({isDeleted: false,confirmEmail: true,isBlocked: false,role: 'Admin'})
        .select('-_id email')

        

        const pdfPath = path.join(__dirname, `../uploads/PDFs/Products`)
        const pdfName = `${today}_products.pdf`

        if(products.length > 0  && admins.length > 0)
        {
            createProductPDF({ items: products }, pdfPath, pdfName) // create the pdf by its prodcuts
           
            const adminsEmails = admins.map(admin => admin.email) // array of admin's emails
          
            const adminsEmailsWithComma = adminsEmails.join(',') // All emails as string seperated by a comma
           
            
           sendEmail(adminsEmailsWithComma,'<p>Daily report of created products</p>',
            {
                 path: `${pdfPath}/${pdfName}`
            })
        }
        else
        {
            console.log("No products created today");
        }
        
    }
    //sending the pdf everyday at 11:59:59 to the admin
    schedule.scheduleJob('59 59 23 * * *', sendProductsPDF )

}





module.exports = cornJob