import nodemailer from 'nodemailer';
import HandlebarsMailTemplate from './HandlebarsMailTemplate';

interface IMailContact {
   name: string;
   email: string;
 }
 
 interface ITemplateVariable {
   [key: string]: string | number;
 }
 
 interface IParseMailTemplate {
   template: string;
   variables: ITemplateVariable;
 }

interface ISendMail {
    to: IMailContact;
    from?: IMailContact;
    subject: string;
    templateData: IParseMailTemplate;
}
export class EtherealMail {
    public static async sendEmail({
        to,
        from,
        subject,
        templateData,
    }: ISendMail): Promise<void> {
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

        const mailTemplate = new HandlebarsMailTemplate();

        // Message object
        const message = {
            from: {
                name: from?.name || 'Equipe API Vendas',
                address: from?.email || 'equipe@apivendas.com.br',
            },
            to: {
                name: to.name,
                address: to.email,
            },
            subject,
            html: await mailTemplate.parse(templateData),
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