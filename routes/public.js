import express from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import JWT from 'jsonwebtoken';

//Criar um JWT_SECRET no .env e trazer o token na variavel
const JWT_SECRET = process.env.JWT_SECRET;
const prisma = new PrismaClient();
const router = express.Router();
 


//Homepage
router.get('/', (req, res) => {
  res.status(200).json({ message: 'API funcionando' });
});

//Cadastro de usuario
router.post('/cadastro', async (req, res) => {

  try {
    const client = req.body;
    //força da encriptografia da senha
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(client.password, salt)



    const clientDB = await prisma.client.create({
      data: {
        name: client.name,
        email: client.email,
        //NAO RETORNAR SENHA NO JSON
        password: hashPassword,
      }
    })

    res.status(201).json(clientDB);
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Internal server error' });
  }
});


//Login de usuario
router.post('/login', async (req, res) => {

  try {
    const clientInfo = req.body

    //Busca o usuario dentro do BD
    const client = await prisma.client.findUnique({
      //Verifica se o usuario existe
      where: { email: clientInfo.email },
    })
    //Se o usuario não existir exibe retorna Error 404 Not Found
    if (!client) {
       return res.status(404).json({ message: 'Usuario não encontrado' })
    }

    //Compara a senha digitada com a senha do BD
    const isMatch = await bcrypt.compare(clientInfo.password, client.password)
    if(!isMatch){
      return res.status(400).json({ message: 'Senha Invalida' })
    }

    //Gerar token JWT - Json Web Token
    const token = JWT.sign({id: client.id}, JWT_SECRET, {expiresIn: '7d'})

    //Se usuario existir exibir o token dele
    res.status(200).json(token)
  

  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro no Servidor' })
  }
})


export default router;    
