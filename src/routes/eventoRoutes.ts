import { Router } from 'express';
import { EventoController } from '../controllers/eventoController';
import { authenticateToken } from "../middlewares/auth-middleware";
const routes = Router();
const eventoController = new EventoController();


routes.get('/peneira', authenticateToken, eventoController.list);
routes.post('/peneira', authenticateToken, eventoController.create);
routes.get('/peneira/:id', authenticateToken, eventoController.show);
routes.put('/peneira/:id', authenticateToken, eventoController.update);
routes.delete('/peneira/:id', authenticateToken, eventoController.delete);
routes.get('/peneira/user/:id', authenticateToken, eventoController.getUserId);
export default routes;