import { Router } from "express";
import {createproperty, updateProperty, deleteProperty} from "../controller.js/property.controller.js"
import authMiddleware from "../middlewares/auth.js"
import upload from "../middlewares/multer.middleware.js"

const router = Router()

router.post('/register', upload.array('image', 10), createproperty);

router.put('/id', authMiddleware, updateProperty);
router.delete('/id', authMiddleware, deleteProperty);

export default  router;