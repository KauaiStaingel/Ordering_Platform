import express from 'express';
import cors from 'cors';
import router from '../routes/routes.js';


const app = express();

app.use(express.json());
app.use(cors());
app.use('/', router);

const PORT = 5000;
const HOST = '192.168.15.114';
app.listen(PORT,HOST)
  .on('listening', () => {
    console.log(`Servidor rodando em http://${HOST}:${PORT}`);
  })
  .on('error', (err) => {
    console.error('Erro ao iniciar servidor:', err.message);
    process.exit(1);
  });
