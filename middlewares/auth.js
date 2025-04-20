import JWT from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

//Esse auth vai ser o middleware que vai validar o token
const auth = (req, res, next) => {
    const token = req.headers.authorization

    if (!token) {
        return res.status(401).json({ message: 'Token não encontrado' })
    }
    
    try {
        //Decodificar o token
        const decoded = JWT.verify(token.split(" ")[1], JWT_SECRET)

        req.clientID = decoded.id

        console.log(decoded)
        

    } catch (error) {
        console.log(error)
        return res.status(401).json({ message: 'Token inválido' })
    }
    
    next()
}
export default auth;