import { Router } from 'express';
const bcrypt = require("bcrypt");
import multer from 'multer';
import path from 'path';
import { UserController } from '../controllers/UserController';
import { authenticateToken } from "../middlewares/auth-middleware";

const router = Router();



// Rotas
router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.put('/perfil/:id', authenticateToken,UserController.atualizarPerfil);
router.get('/get/perfil/:id',authenticateToken, UserController.listarPerfil);
router.put('/perfil/:id/avatar',authenticateToken, UserController.uploadFoto);
router.delete('/perfil/:id', authenticateToken, UserController.excluirConta);




export default router;