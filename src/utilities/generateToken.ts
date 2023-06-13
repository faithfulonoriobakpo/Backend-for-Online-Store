import express, {Request, Response} from "express";
import jwt from "jsonwebtoken";

const tokenRouter = express.Router();

tokenRouter.post('/generatetoken', async (req:Request,res:Response) => {
    try{
        const username:string = req.body.username;
        const password:string = req.body.password;
        if(username && password){
            if(username == process.env.AUTH_USERNAME && password == process.env.AUTH_PASSWORD){
                const token = jwt.sign({username:username}, process.env.JWT_SECRET as string, { expiresIn: '1h' });
                res.status(200).json({message:"token generated successfully",token:token});
            }else{
                throw new Error('incorrect username or password');
            }
        }else{
            throw new Error('username and password required to generate token');
        }
    }catch(e){
        if(e instanceof Error && e.message){
            res.status(401).json({error: e.message});
        }else{
            res.json({"error":"An error occurred while getting token"});
        }
    }
});

export default tokenRouter;