import 'express-async-errors';
import './config/typeorm';
import app from './shared/http/app';

const PORT = 3333;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}.`);
});