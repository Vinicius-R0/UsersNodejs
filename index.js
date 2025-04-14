import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()
const app = express();
app.use(express.json());// Avisar a aplicação que vou usar JSON
const users =[]

app.post('/usuarios', async (req, res) => {

  await prisma.user.create({
    data: {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    }
  });

  res.status(201).json(req.body);
});

app.get('/usuarios', (req, res) => {

  res.status(200).json(users);
});

app.listen(3000, () => {
  console.log(`Server is running at http://localhost:3000`);
});

/*
    Notes:{
        Query params (GET)
           - Consultas
           - Varias informações
           - Informações irrelevantes

        Route params (GET/PUT/DELETE)
           - Identificação de um recurso (id)
           - Informações relevantes e especificas

        Body params (POST/PUT)   
            - Envio de informações para o servidor 
            (pelo corpo da requisição - body)
            - Muitas informações

        HTTP codes: 
        (2xx-Sucesso, 4xx-Erro do cliente, 5xx-Erro do servidor)
            - 200: OK
            - 201: Created
            - 204: No content
            - 400: Bad request
            - 401: Unauthorized
            - 403: Forbidden
            - 404: Not found
            - 500: Internal server error
            - 503: Service unavailable

        await (promisse)
        async (função assíncrona)
            - O await só pode ser usado dentro de uma função assíncrona
            - O await espera a promisse ser resolvida ou rejeitada
            - para acessar informações fora do javascript
            - pedir pro javascript esperar a resposta do banco de dados
    }

    Criar listagem (API) de usuários

        - Criar um usuario
        - Listar todos os usuarios
        - Listar um usuario específico
        - Atualizar um usuario
        - Deletar um usuario
*/