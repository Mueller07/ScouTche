import { DataSource } from 'typeorm';
import { User } from '../models/User';
import { Evento } from '../models/evento';

import { Participar } from '../models/participar';


export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',      // Ajuste para seu host
  port: 3306,             // Ajuste para sua porta
  username: 'root',
  password: 'root',
  database: 'scoutche',
  entities: [User,Evento,Participar],
  synchronize: true,      // só use true para dev
  logging: false,
});