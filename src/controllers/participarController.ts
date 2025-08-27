import { Participar } from "../models/participar";
import { User } from "../models/User";
import { Evento } from "../models/evento";
import { Request, Response } from "express";
import { AppDataSource } from "../database/data-source";

const participantesRepository = AppDataSource.getRepository(Participar);
const userRepository = AppDataSource.getRepository(User);
const campeonatoRepository = AppDataSource.getRepository(Evento);

export class participanteController {
  async entryCamp(req: Request, res: Response) {
    const { userId, campId } = req.body; 

    const user = await userRepository.findOneBy({ id: Number(userId) });
    if (!user) {
      res.status(400).json({ message: "Usuário não encontrado" });
      return;
    }

    const campeonato = await campeonatoRepository.findOneBy({ id: Number(campId) });
    if (!campeonato) {
      res.status(400).json({ message: "Campeonato não encontrado" });
      return;
    }

    
    const participante = participantesRepository.create({
      userId: user,
      eventoId: campeonato, 
    });

    await participantesRepository.save(participante);
    res.status(201).json(participante);
  }

  async sairCamp(req: Request, res: Response) {
    const { id } = req.params;

    const participante = await participantesRepository.findOneBy({ id: Number(id) });

    if (!participante) {
      res.status(404).json({ message: "Participante não encontrado!" });
      return;
    }

    await participantesRepository.remove(participante);
    res.status(204).send();
  }
}
