import express, { Request, Response } from "express";
const app = express()
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
app.use(express.json())

app.get('/', async (req: Request, res: Response) => {
    const allUsers = await prisma.user.findMany(); 
    res.json(allUsers)
})

app.post('/', async (req: Request, res: Response) => {
    const newUser = await prisma.user.create({data: req.body})
    res.json(newUser)
})

app.put('/:id', async (req: Request, res: Response) => {
    const id = req.params.id;
    const newAge = req.body.age;
    const updatedUser = await prisma.user.update({
        where: {id: id}, 
        data: {age: newAge},
    })
    res.json(updatedUser)
})

app.delete("/:id", async (req: Request, res: Response) => {
    const id = req.params.id
    const deleteUser = await prisma.user.delete({
        where: { id: id}
    })
    res.json(deleteUser)
})

app.post('/house', async (req: Request, res: Response) => {
    const newHouse = await prisma.house.create({ data: req.body })
    res.json(newHouse)
})

app.get('/house', async (req: Request, res: Response) => {
    const allHouses = await prisma.house.findMany({
        include: {
            owner: true,
            builtBy: true
        }
    }); 
    res.json(allHouses)
})

app.get('/house/:id', async (req: Request, res: Response) => {
    const id = req.params.id
    const allHouses = await prisma.house.findUnique({
        where: {
            id,
        },
        include: {
            owner: true,
            builtBy: true
        }
    }); 
    res.json(allHouses)
})

app.post('/house/many', async (req: Request, res: Response) => {
    const newhouses = await prisma.house.createMany({data: req.body})
    res.json(newhouses)
})

app.get("/house/withDilters", async (req: Request, res: Response) => {
    const filteredHouses = await prisma.house.findMany({
        where: {
            wifiPassword: {
                not: null,
            },
            owner: {
                age: {
                    gte: 22, // greater than equal to
                },
            },
        }, 
        orderBy: [
            {
                owner: {
                    firstName: "desc",
                },
            },
        ],
        include: {
            owner: true,
            builtBy: true,
        }
    })
    res.json(filteredHouses)
})

app.listen(3001, () => console.log(`Server running on port 3001`))