import { mongooseConnect } from "@/lib/mongoose"
import { Category } from "@/models/Category"
import mongoose from "mongoose"

export default async function newCategory(req, res) {
    const { method } = req
    await mongooseConnect()

    if (method === "GET") {
        res.json(await Category.find())
    }


    if (method === "POST") {
        const { name } = req.body
        console.log(name)
        const cateDoc = await Category.create({ name })
        res.json(cateDoc)
    }
}