import { mongooseConnect } from "@/lib/mongoose"
import { Category } from "@/models/Category"
import mongoose from "mongoose"

export default async function newCategory(req, res) {
    const { method } = req
    await mongooseConnect()

    if (method === "GET") {
        res.json(await Category.find().populate('parent'))
    }


    if (method === "POST") {
        const { name, parentCategory } = req.body
        console.log(name)
        const cateDoc = await Category.create({ name, parent: parentCategory })
        res.json(cateDoc)
    }
}