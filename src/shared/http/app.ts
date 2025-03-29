import { setupSwagger } from "src/swagger.config";
import express from "express";
import cors from 'cors';
import routes from "./routes";
import { errors } from "celebrate";
import errorHandler from "@shared/middlewares/error-handler";

const app = express(); 

// Configuração do Swagger
setupSwagger(app);

app.use(cors());

app.use(express.json());

app.use(routes);

app.use(errorHandler);

export default app;
