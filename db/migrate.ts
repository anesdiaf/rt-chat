import { neon } from "@neondatabase/serverless";
import { drizzle } from 'drizzle-orm/neon-http';


const sql = neon("postgresql://neondb_owner:npg_xPO4JZgKWvB7@ep-raspy-king-a97660xx-pooler.gwc.azure.neon.tech/neondb?sslmode=require")
export const db = drizzle({ client: sql });