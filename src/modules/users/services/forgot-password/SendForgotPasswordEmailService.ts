import AppError from "src/shared/errors/AppError"; 
import UsersRepository from "../../repositories/UsersRepository";
import UserTokensRepository from "../../repositories/UserTokensRepository";
import { hash } from "bcryptjs";
import { EtherealMail } from "@config/mail/EtherealMail.config";
import UserTokens from "@modules/users/entities/UserTokens";

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

        await EtherealMail.sendEmail({
            to: {
                name: user.name,
                email: user.email,
            },
            subject: '[FOR SALE API] Recuperação de Senha',
            templateData: {
                template: `Olá {{name}}: {{token}}`,
                variables: {
                    name: user.name,
                    token,
                },
            },
        });
    }
}