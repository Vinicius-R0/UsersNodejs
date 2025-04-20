import express from 'express'
import { PrismaClient } from '@prisma/client'
import auth from '../middlewares/auth.js';  // Importando o middleware auth

const prisma = new PrismaClient()   
const router = express.Router()

router.get('/listar-usuarios', async (req, res) => {

    try { 
        const clients = await prisma.client.findMany({
            omit: {
                password: true, // Não retornar a senha no JSON
            }, 
        })
        res.status(200).json({message: 'Usuario listado com sucesso', clients})
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal server error' })
    }
})


//Encontrar um usuario pelo ID 
//Esse ID é o mesmo que vem do banco de dados
router.get('/listar-usuarios/:id', async (req, res) => {
    const {id} = req.params
    try { 
        const client = await prisma.client.findUnique({
            where: {id: Number(id)},
            select: {
                id: true,
                name: true,
                email: true
            }
        })

        if (!client) {
            return res.status(404).json({ message: 'Usuario não encontrado' })
        }

        res.status(200).json({message: 'Usuario encontrado com sucesso', client})

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal server error' })
    }
})


router.put('/editar-usuarios/:id', auth, async (req, res) => {
    const {id} = req.params
    const {name, email} = req.body
    //Verifica se o usuario que está logado é o mesmo que está tentando editar
    const clientIDFromToken = req.clientID

    if (Number(clientIDFromToken) !== Number(id)) {
        return res.status(403).json({ message: 'Você não tem permissão para editar esse usuario' })
    }
    
    try {
        const clientUpdate = await prisma.client.update({
            where: {id: Number(id)},
            data: {
                name,
                email
            }
        });
        res.status(200).json({message: 'Usuario atualizado com sucesso', clientUpdate})
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal server error' })
        
    }
})
export default router