import 'express-async-errors';
import './config/typeorm';
import app from './shared/http/app';
import { env } from '@config/env';

app.listen(env.PORT, () => {
    console.log(`Server started on port ${env.PORT}.`);
});