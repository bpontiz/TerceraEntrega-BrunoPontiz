import nodemailer from 'nodemailer';

function createSendMail(mailConfig) {

    const transporter = nodemailer.createTransport(mailConfig);

    return function sendMail({to, subject, text, html, attachments }) {

        const mailOptions = { from: mailConfig.auth.user, to, subject, text, html, attachments};

        return transporter.sendMail(mailOptions);

    }
};

function createSendMailEthereal() {

    return createSendMail({
        
        host: process.env.ETHEREAL_HOST,
        port: process.env.ETHEREAL_PORT,
        auth: {
            user: process.env.ETHEREAL_USERNAME,
            pass: process.env.ETHEREAL_PASSWORD
        }

    })

};

const mailing = createSendMailEthereal();

const detailEmail = async (email) => {

    const emailAccount = email ?
        email :
        'elon.musk@tesla.com';

    const emailSubject = 'New register';

    const emailText = 'Welcome to coder-backend app';

    const emailAttachments = [];

    const attachmentsPath = '';

    if (attachmentsPath) {

        attachments.push({path: attachmentsPath});

    };

    const info = await mailing({

        to: emailAccount,
        subject:emailSubject,
        text: emailText,
        attachments: emailAttachments

    });

    console.log(info);
}



export {detailEmail};