import express from 'express';
const searchRouter = express.Router();

import { searchAll } from '../controllers/searchController.js'

searchRouter.get('/', searchAll);


export default searchRouter;
