import express, {Request, Response} from "express";
import User from "../../models/Users";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authenticate } from "../../middlewares/auth";

const userRouter = express.Router();

userRouter.get('/index', authenticate, async (req:Request, res:Response) => {
    try{
        const userInstance = new User();
        const usersIndex = await userInstance.index();
        if(usersIndex) {
            res.status(200).json({
                "message":"users index retrieved successfully.",
                "data":usersIndex
        });}else{
            res.json({
                "message":"Could not find users. Possibly empty.",
                "data":null
            });
        }
    }catch(e){
        if(e instanceof Error){
            res.json({"message":e.message?? "could not fetch users index"});
        }
    }
});


userRouter.get('/show/:id', authenticate, async (req:Request, res:Response) => {
    try{
        const userInstance = new User();
        const user_id = Number(req.params.id);
        if(isNaN(user_id)) throw new TypeError("User_id must be a number and cannot null.");
        const user = await userInstance.show(user_id);
        if(user){
            res.status(200).json({
                "message": "user retrieved successfully",
                "data":user
            });
        }else{
            res.status(404).json({
                "message":`user with id ${user_id} does not exist`,
                "data":null
            });
        }
    }catch(e){
        if(e instanceof TypeError){
            res.status(400).json({"message":e.message?? "could not fetch user"});
        }else if(e instanceof Error){
            res.json({"message":e.message?? "could not fetch user"});
        }
    }
});


userRouter.post('/create', async (req:Request, res:Response) => {
    try{
        const {firstname,lastname,password} = req.body;
        if(!(firstname && lastname && password)) throw new TypeError("firstname, lastname and password must be provided");
        const saltRounds = Number(process.env.SALT_ROUND);
        const hashedPassword = bcrypt.hashSync(password + process.env.PEPPER, saltRounds);
        const user = {"firstname":firstname,"lastname":lastname,"password":hashedPassword};
        const userInstance = new User();
        const result = await userInstance.create(user);
        if(result){
            const token = jwt.sign({user_id:result.id}, process.env.JWT_SECRET as string)
            res.status(200).json({
                "message":"User created successfully",
                "id":result.id,
                "token":token
            });
        }else{
            res.json({
                "message":"Could not create user",
                "data":null
            });
        }
    }catch(e){
        if(e instanceof TypeError){
            res.status(400).json({"message":e.message?? "could not create user"});
        }else if(e instanceof Error){
            res.json({"message":e.message?? "could not create user"});
        }
    }
})

userRouter.post('/authenticate', async (req:Request,res:Response) => {
    try{
        const user_id:number = req.body.user_id as number;
        if(isNaN(user_id)) throw new TypeError("user_id must be a number");
        const password:string = req.body.password;
        if(user_id && password){
            const userInstance = new User();
            const user = await userInstance.authenticate(user_id);
            if(user){
                const hashedPassword:string = user.password as string;
                const token = jwt.sign({user_id:user_id}, process.env.JWT_SECRET as string);
                bcrypt.compareSync(password + process.env.PEPPER, hashedPassword)?
                    res.status(200).json({status: 200, message: "User authenticated successfully", token:token}) :
                    res.status(400).json({status: 400, message: "Password is incorrect"});
            }else{
                res.status(404).json({
                    "status":404,
                    "message":"user not found"
                });
            }
        }else{
            res.status(400).json({
                "status":400,
                "message":"userId and password cannot be empty"
            });
        }
    }catch(e){
        if(e instanceof Error){
            e.message? res.json({error: e.message}):res.json({"error":"An error occurred while getting token"});
        }else{
            res.json({"error":"An error occurred while getting token"});
        }
    }
});

export default userRouter;