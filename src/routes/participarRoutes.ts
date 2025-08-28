import { Router } from "express";
import { participanteController } from "../controllers/participarController";
import { authenticateToken } from "../middlewares/auth-middleware";
const router: Router = Router();
const participantes = new participanteController();


router.post("/participantes", participantes.entryCamp);
router.delete("/participantes/:eventoId/:userId", participantes.sairEvento);
router.get("/participantes", authenticateToken, participantes.verParticipacao);
router.get("/participantes/count/:eventoId", participantes.contarParticipantes);
export default router;