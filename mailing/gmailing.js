import nodemailer from 'nodemailer';

function createSendMail(mailConfig) {

    const transporter = nodemailer.createTransport(mailConfig);

    return function sendMail({to, subject, text, html, attachments }) {

        const mailOptions = { from: mailConfig.auth.user, to, subject, text, html, attachments};

        return transporter.sendMail(mailOptions);

    }
};

function createSendMailGmail() {

    return createSendMail({

        host: process.env.GMAIL_HOST,
        port: process.env.GMAIL_PORT,
        auth: {
            user: process.env.GMAIL_USERNAME,
            pass: process.env.GMAIL_PASSWORD
        }

    })
}

const mailing = createSendMailGmail();

const detailGmail = async (email) => {

    const emailAccount = email ?
        email :
        'elon.musk@tesla.com';

    const emailSubject = 'New register';

    const emailText = 'Message from coder-backend app';

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



export {detailGmail};