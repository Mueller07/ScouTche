import { Router } from "express";
import { participanteController } from "../controllers/participarController";
import { authenticateToken } from "../middlewares/auth-middleware";
const router: Router = Router();
const participantes = new participanteController();

router.post("/participantes", participantes.entryCamp);
router.delete("/parcipantes/:id",authenticateToken, participantes.sairCamp);

export default router;