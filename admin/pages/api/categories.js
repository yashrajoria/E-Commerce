import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/Category";
import mongoose from "mongoose";

export default async function newCategory(req, res) {
  const { method } = req;
  await mongooseConnect();

  if (method === "GET") {
    res.json(await Category.find().populate("parent"));
  }

  if (method === "POST") {
    const { name, parentCategory, properties } = req.body;
    console.log(name);
    const cateDoc = await Category.create({
      name,
      parent: parentCategory,
      properties,
    });
    res.json(cateDoc);
  }
  if (method === "PUT") {
    const { name, parentCategory, _id, properties } = req.body;
    console.log(name);
    const cateDoc = await Category.updateOne(
      { _id },
      { name, parent: parentCategory, properties: properties }
    );
    res.json(cateDoc);
  }

  if (method === "DELETE") {
    const { _id } = req.query;
    await Category.deleteOne({ _id });
    res.json("Category deleted");
  }
}
