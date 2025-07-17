import AppError from "@shared/errors/AppError"; 
import UsersRepository from "../../repositories/UsersRepository";
import UserTokensRepository from "../../repositories/UserTokensRepository";
import { EtherealMail } from "@config/mail/EtherealMail.config";
import UserTokens from "@modules/users/entities/UserTokens";
import path from "path";

interface IRequest {
    email : string;
}

export default class SendForgotPasswordEmailService {
    public async execute({ email  }: IRequest): Promise<void> {
        const user = await UsersRepository.findByEmail(email);

        if (!user) {
            throw new AppError('User does not exists.', 400);
        }

        const { token } = await UserTokensRepository.generate(user.id) as UserTokens;

        const forgotPasswordTemplate = path.resolve(
            __dirname,
            '..',
            '..',
            'views',
            'send_forgot_email_template.hbs',
        );

        await EtherealMail.sendEmail({
            to: {
                name: user.name,
                email: user.email,
            },
            subject: '[FOR SALE API] Recuperação de Senha',
            templateData: {
                file: forgotPasswordTemplate,
                variables: {
                    name: user.name,
                    link: `http://localhost:3000/reset_password?token=${token}`,
                },
            },
        });
    }
}