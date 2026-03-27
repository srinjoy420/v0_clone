import {drizzle} from "drizzle-orm/node-postgres"
import dotenv from "dotenv"
import pkg from "pg"

dotenv.config()

const {Pool}=pkg
const connectionString=process.env.DATABASE_URl!;

const pool=new Pool({connectionString})

export const db=drizzle(pool);