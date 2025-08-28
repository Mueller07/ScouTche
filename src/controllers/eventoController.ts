import { Request, Response } from "express";
import { AppDataSource } from "../database/data-source";
import { Evento } from "../models/evento";

const eventoRepository = AppDataSource.getRepository(Evento);

export class EventoController {
    async list(req: Request, res: Response) {
        const Evento = await eventoRepository.find();
        res.json(Evento);
        return
    }

    async create(req: Request, res: Response) {
        const { tipo, nome, desc, cep, modalidade, user } = req.body;


        // Validação de campos obrigatórios
        if (!nome || !cep || !modalidade) {
            res.status(400).json({ message: "Todos os campos são necessários!" });
            return;
        }

        // Criação do evento
        const novoEvento = eventoRepository.create(new Evento(tipo, nome, desc, cep, modalidade, user));
        await eventoRepository.save(novoEvento);

        res.status(201).json({
            message: "Evento criado com sucesso!",
            evento: novoEvento
        });
        return;
    }
    
    async getUserId(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const userId = Number(id);
    
        if (isNaN(userId)) {
            res.status(400).json({ message: "ID inválido" });
            return;
        }
    
        const eventos = await eventoRepository.find({
            where: { user: { id: userId } } 
        });
    
        if (eventos.length === 0) {
            res.status(404).json({ message: "Nenhum evento encontrado para este usuário" });
            return;
        }
    
        res.json(eventos);
    }
    
    

    async show(req: Request, res: Response) {
        const { id } = req.params;

        const evento = await eventoRepository.findOneBy({ id: Number(id) });

        if (!evento) {
            res.status(404).json({ message: 'Evento não encontrado' });
            return
        }

        res.json(evento);
        return
    }

    async update(req: Request, res: Response) {
        const { id } = req.params;
        const { nome,desc, cep,modalidade } = req.body;

        const evento = await eventoRepository.findOneBy({ id: Number(id) });

        if (!evento) {
            res.status(404).json({ message: 'Evento não encontrado' });
            return
        }

        evento.nome = nome;
        evento.cep = cep;
        evento.desc = desc
        evento.modalidade = modalidade;

        await eventoRepository.save(evento);

        res.json(evento);
        return
    }

    async delete(req: Request, res: Response) {
        const { id } = req.params;

        const evento = await eventoRepository.findOneBy({ id: Number(id) });

        if (!evento) {
            res.status(404).json({ message: 'Evento não encontrado' });
            return
        }

        await eventoRepository.remove(evento);

        res.status(204).send();
        return
    }
}