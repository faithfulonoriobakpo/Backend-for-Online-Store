import express, {Request, Response} from "express";
import User from "../../models/Users";

const userRouter = express.Router();

userRouter.get('/index', async (req:Request, res:Response) => {
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


userRouter.get('/show', async (req:Request, res:Response) => {
    try{
        const userInstance = new User();
        const userId = Number(req.params.id);
        if(isNaN(userId)) throw new TypeError("User Id cannot be a number and not null.");
        const user = await userInstance.show(userId);
        if(user){
            res.status(200).json({
                "message": "user retrieved successfully",
                "data":user
            });
        }else{
            res.status(404).json({
                "message":`user with id ${userId} does not exist`,
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
        const user = {"firstname":firstname,"lastname":lastname,"password":password};
        const userInstance = new User();
        const result = await userInstance.create(user);
        if(result){
            res.status(200).json({
                "message":"User created successfully",
                "data":result
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

export default userRouter;