import { DataSource } from "typeorm"

const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 3306,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
})


AppDataSource
    .initialize()
    .then(() => {
        console.log(`AppDataSource has been initialized`);
    })
    .catch((err) => {
        console.error(`AppDataSource initialization error`, err);
    })

export default AppDataSource;