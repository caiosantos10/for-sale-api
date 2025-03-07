import { Request, Response } from 'express';
import SendForgotPasswordEmailService from '../services/forgot-password/SendForgotPasswordEmailService';

export class ForgotPasswordController {
    public async create(req: Request, res: Response): Promise<Response> {
        const { email } = req.body;

        const sendForgotEmailService = new SendForgotPasswordEmailService();

        await sendForgotEmailService.execute({ email });

        return res.status(204).json();
    }
}