import { Request, Response } from 'express';
import { AppDataSource } from '../database/data-source';
import { User } from '../models/User';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { UserRepository } from "../repositories/UserRepositorie"
import * as jwt from "jsonwebtoken";
import "dotenv/config";


const userRepository = AppDataSource.getRepository(User);

const JWT_SECRET = process.env.JWT_SECRET as jwt.Secret;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in the environment variables");
}

const userRepo = new UserRepository();


export const UserController = {
        async logout(req: Request, res: Response) {
      res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
      });

    res.status(200).json({ message: "Logout successful" });
  },

  register: async (req: Request, res: Response) => {
    const { nome, email,nascimento, senha, tipoConta } = req.body;
  
    // Campos obrigatórios
    if (!nome) {
      res.status(400).json({ error: "O campo nome é obrigatório" });
      return;
    }
    if (!email) {
      res.status(400).json({ error: "O campo e-mail é obrigatório" });
      return;
    }
    if (!senha) {
      res.status(400).json({ error: "O campo senha é obrigatório" });
      return;
    }
    if (!tipoConta) {
      res.status(400).json({ error: "O campo tipo de conta é obrigatório" });
      return;
    }
  
    // Validação de tipo de conta
    const tiposValidos = ["atleta", "profissional", "clube"];
    if (!tiposValidos.includes(tipoConta.toLowerCase())) {
      res.status(400).json({ error: "Tipo de conta inválido. Use: atleta, profissional ou clube." });
      return;
    }
  
    try {
      const userRepository = AppDataSource.getRepository(User);
  
      // Verificar se e-mail já existe
      const userExists = await userRepository.findOneBy({ email });
      if (userExists) {
        res.status(400).json({ error: "E-mail já cadastrado" });
        return;
      }
  
      // Criptografar senha
      const hashedPassword = await bcrypt.hash(senha, 10);
  
      // Criar usuário
      const newUser = userRepository.create({
        nome,
        email,
        nascimento,
        senha: hashedPassword,
        tipoConta: tipoConta.toLowerCase(),
        avatar: 0,
      });
      
  
      await userRepository.save(newUser);
  
      res.status(201).json({ message: "Usuário criado com sucesso" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro interno no servidor" });
    }
  },

  login: async (req: Request, res: Response) => {
    try {
      const { email, senha } = req.body;
  
      if (!email) {
        res.status(400).json({ error: "O campo e-mail é obrigatório" });
        return;
      }
      if (!senha) {
        res.status(400).json({ error: "O campo senha é obrigatório" });
        return;
      }
  
      const user = await userRepository.findOneBy({ email });
      if (!user) {
        res.status(404).json({ error: "Usuário não encontrado." });
        return;
      }
  
      const tiposValidos = ["atleta", "profissional", "clube"];
      if (!tiposValidos.includes(user.tipoConta.toLowerCase())) {
        res.status(400).json({ error: "Tipo de conta inválido." });
        return;
      }
  
      const senhaCorreta = await bcrypt.compare(senha, user.senha);
      if (!senhaCorreta) {
        res.status(401).json({ error: "Senha incorreta." });
        return;
      }
  
      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
  
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
      });
  
      res.status(200).json({
        message: "Login bem-sucedido!",
        usuario: {
          id: user.id,
          nome: user.nome,
          email: user.email,
          tipoConta: user.tipoConta,
          avatar: user.avatar, // ou fotoPerfil, conforme sua entidade
        },
        token: {
          token: token
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao realizar login." });
      return;
    }
  },  

  excluirConta: async (req: Request, res: Response) => {
    const { id } = req.params;
    const { senha } = req.body;
  
    if (!senha) {
      res.status(400).json({ mensagem: "Senha é obrigatória para exclusão." });
      return; // só return para sair da função, sem retornar o res
    }
  
    try {
      const user = await userRepository.findOneBy({ id: Number(id) });
      if (!user) {
        res.status(404).json({ mensagem: "Usuário não encontrado." });
        return;
      }
  
      const senhaValida = await bcrypt.compare(senha, user.senha);
      if (!senhaValida) {
        res.status(401).json({ mensagem: "Senha incorreta." });
        return;
      }
  
      await userRepository.remove(user);
      res.status(200).json({ mensagem: "Conta excluída com sucesso." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensagem: "Erro interno ao excluir conta." });
    }
  },
  

  atualizarPerfil: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { nome, sobrenome, nascimento, bio } = req.body;

      const user = await userRepository.findOneBy({ id: Number(id) });
      if (!user) {
        res.status(404).json({ mensagem: 'Usuário não encontrado.' });
        return
      }

      user.nome = nome || user.nome;
      user.nascimento = nascimento || user.nascimento;
      user.bio = bio || user.bio;

      await userRepository.save(user);
      res.status(200).json({ mensagem: 'Perfil atualizado com sucesso!', user });
      return
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensagem: 'Erro ao atualizar perfil.' });
      return
    }
  },

  uploadFoto: async (req: Request, res: Response) => {
    try {
      const { id} = req.params;
      const { avatar} = req.body;
   const user = await userRepository.findOneBy({ id: Number(id) });
      if (!user) {
        res.status(404).json({ mensagem: 'Usuário não encontrado.' });
        return
      }
  user.avatar=avatar

      await userRepository.save(user);

      res.status(200).json({ mensagem: 'Foto de perfil atualizada com sucesso!' });
      return
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensagem: 'Erro ao atualizar a foto.' });
      return
    }
  },



  listarPerfil: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user = await userRepository.findOneBy({ id: Number(id) });

      if (!user) {
        res.status(404).json({ mensagem: 'Usuário não encontrado.' });
        return
      }

      res.status(200).json(user);
      return
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensagem: 'Erro ao buscar perfil.' });
      return
    }
  }
};
