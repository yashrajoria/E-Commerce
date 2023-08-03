import Layout from "@/components/Layout";
import { data } from "autoprefixer";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Categories() {
    const [name, setName] = useState("");
    const [categories, setCategories] = useState([]);
    useEffect(() => {
        fetchCategories()
    }, []);
    function fetchCategories() {
        axios.get("/api/categories").then((result) => {
            setCategories(result.data);
        });
    }
    async function saveCategory(e) {
        e.preventDefault();
        await axios.post("/api/categories", { name: name });
        setName("");
        fetchCategories()
    }

    return (
        <Layout>
            <h1 className="text-blue-900 text-xl font-bold mb-2">Categories</h1>
            <label className="text-blue-900 text-l font-semi-bold mb-2">
                New Category Name
            </label>
            <form onSubmit={saveCategory} className="flex gap-1">
                <input
                    type="text"
                    className="mb-0 w-full px-2 border-gray-300"
                    placeholder={"Category Name"}
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                />
                <button
                    type="submit"
                    className="bg-blue-900 text-white py-1 px-2 rounded-md"
                >
                    Save
                </button>
            </form>
            <table className="w-full mt-4">
                <thead className="bg-blue-100">
                    <tr className="border p-1 border-blue-200">
                        <td className="border p-1 border-blue-200">Category Name</td>
                    </tr>
                </thead>
                <tbody>
                    {categories.length > 0 &&
                        categories.map((category) => (
                            <tr className="border p-1 border-blue-200">
                                <td className="border p-1 border-blue-200">{category.name}</td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </Layout>
    );
}
