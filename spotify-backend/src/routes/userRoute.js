// routes/userRouter.js

import express from 'express';
import { loginUser, registerUser, listUsers, removeUser, updateUserDetails } from '../controllers/userController.js';
import { protect } from './../middleware/authMiddleware.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/list', listUsers);
userRouter.post('/remove', removeUser);
userRouter.put('/update', protect, updateUserDetails);


export default userRouter;
