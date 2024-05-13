import express from "express";
import { initRoutes } from "./handlers/routes";
import { AppDataSource } from "./database/database";
import swaggerDocs from "./swagger/swagger";
import path from "path";


const main = async () => {
    const app = express()
    const port = 3000

    try {

        await AppDataSource.initialize()
        console.error("well connected to database")
    } catch (error) {
        console.log(error)
        console.error("Cannot contact database")
        process.exit(1)
    }

    const publicDirPath = path.join(__dirname, 'frontend');
    app.use(express.static(publicDirPath));

    app.use(express.json())
    initRoutes(app)
    app.listen(port, () => {
        console.log(`Server running on port ${port}`)
        swaggerDocs(app,port)
    })
}

main()