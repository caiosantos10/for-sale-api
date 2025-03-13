import nodemailer from 'nodemailer';

interface IParam {
    to: string;
    body: string;
}

export class EtherealMail {
    public static async sendEmail({ to, body }: IParam): Promise<void> {
        const account = await nodemailer.createTestAccount();

        // Create a SMTP transporter object
        const transporter = nodemailer.createTransport({
            host: account.smtp.host,
            port: account.smtp.port,
            secure: account.smtp.secure,
            auth: {
                user: account.user,
                pass: account.pass
            }
        });

        // Message object
        const message = {
            from: '<equipe.forsale@mail.com.br>',
            to,
            subject: 'Recuperação de Senha',
            html: body
        };

        await transporter.sendMail(message, (err, info) => {
            if (err) {
                console.log('Error occurred. ' + err.message);
                return process.exit(1);
            }

            console.log('Message sent: %s', info.messageId);
            // Preview only available when sending through an Ethereal account
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        });
    }
}