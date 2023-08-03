import Layout from "@/components/Layout";
import { data } from "autoprefixer";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from "react-sweetalert2";

function Category({ swal }) {
    const [name, setName] = useState("");
    const [editedCategory, setEditedCategory] = useState(null);
    const [categories, setCategories] = useState([]);
    const [parentCategory, setParentCategory] = useState("");
    const [properties, setProperties] = useState([]);
    useEffect(() => {
        fetchCategories();
    }, []);
    function fetchCategories() {
        axios.get("/api/categories").then((result) => {
            setCategories(result.data);
        });
    }
    async function saveCategory(e) {
        e.preventDefault();
        const data = { name };

        // If parentCategory is not empty, set the value as an ObjectId
        if (parentCategory) {
            data.parentCategory = parentCategory;
        } else {
            // If parentCategory is empty (user selected "No parent category"), set it as null
            data.parentCategory = null;
        }

        if (editedCategory) {
            data._id = editedCategory._id;
            await axios.put("/api/categories", data);
            setEditedCategory(null);
        } else {
            await axios.post("/api/categories", data);
        }

        setName("");
        fetchCategories();
    }

    function editCategory(category) {
        try {
            console.log(category._id);
            setEditedCategory(category);
            setName(category.name);
            setParentCategory(category.parent?._id);
        } catch (err) {
            console.log(err);
        }
    }

    function deleteCategory(category) {
        swal
            .fire({
                title: "Are you sure?",
                text: `Do you want to delete category ${category.name}?`,
                showCancelButton: true,
                cancelButtonText: "Cancel",
                confirmButtonText: "Yes, Delete this category",
                confirmButtonColor: "#d55",
                reverseButtons: true,
            })
            .then(async (result) => {
                if (result.isConfirmed) {
                    const catId = category._id;
                    await axios.delete("/api/categories?_id=" + catId);
                    fetchCategories();
                }
            });
    }
    function addProperty() {
        setProperties((prev) => {
            return [...prev, { name: "", values: "" }];
        });
    }
    return (
        <Layout>
            <h1 className="text-blue-900 text-xl font-bold mb-2">Categories</h1>
            <label className="text-blue-900 text-l font-semi-bold mb-2">
                {editedCategory
                    ? `Edit Category ${editedCategory.name}`
                    : "Create New Category"}
            </label>
            <form onSubmit={saveCategory}>
                <div className="flex gap-1">
                    <input
                        type="text"
                        className="mb-0 w-full px-2 border-gray-300"
                        placeholder={"Category Name"}
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                    />

                    <select
                        className=" border-2 border-gray-300 rounded-md px-1 w-full"
                        value={parentCategory || ""} // Set the value to an empty string if parentCategory is null
                        onChange={(e) => setParentCategory(e.target.value || null)} // Set parentCategory to null if the user selects the option with an empty string value
                    >
                        <option value="">No parent category</option>
                        {categories.length > 0 &&
                            categories.map((category) => (
                                <option key={category._id} value={category._id}>
                                    {category.name}
                                </option>
                            ))}
                    </select>
                </div>
                <div className="mb-2">
                    <label className="block">Properties</label>
                    <button
                        type="button"
                        class="px-4 py-1 text-sm bg-blue-900 text-white font-semibold rounded-md border-blue-200"
                        onClick={addProperty}
                    >
                        Add Property
                    </button>

                    {properties.length > 0 &&
                        properties.map((property) => (
                            <div className="gap-3 flex mt-3">
                                <input
                                    value={property.name}
                                    className="border border-blue-700 px-1 py-2 rounded-md"
                                    type="text"
                                    placeholder="Property Name (eg: Color)"
                                />
                                <input
                                    value={property.values}
                                    type="text"
                                    className="border border-blue-700 rounded-md px-1 py-2"
                                    placeholder="Values, comma seperated"
                                />
                            </div>
                        ))}
                </div>
                <button
                    type="submit"
                    className="bg-blue-900 text-white py-1 px-2 rounded-md mt-2"
                >
                    Save
                </button>
            </form>

            <table className="w-full mt-4">
                <thead className="bg-blue-100">
                    <tr className="border p-1 border-blue-200">
                        <td className="border p-1 border-blue-200">Category Name</td>
                        <td className="border p-1 border-blue-200">Parent Category</td>
                        <td className="border p-1 border-blue-200"></td>
                    </tr>
                </thead>
                <tbody>
                    {categories.length > 0 &&
                        categories.map((category) => (
                            <tr className="border p-1 border-blue-200">
                                <td className="border p-1 border-blue-200">{category.name}</td>
                                {/* important */}
                                <td className="border p-1 border-blue-200">
                                    {category?.parent?.name}
                                </td>
                                <td className="border p-1 border-blue-200 flex items-center gap-2">
                                    <button
                                        className="bg-blue-900 text-white px-2 py-1 rounded-md gap-1 inline-flex"
                                        onClick={() => editCategory(category)}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="1.5"
                                            stroke="currentColor"
                                            className="w-4 h-4"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                                            />
                                        </svg>
                                        Edit
                                    </button>
                                    <button
                                        className="bg-red-600 text-white px-2 py-1 rounded-md gap-1 inline-flex"
                                        onClick={() => deleteCategory(category)}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="w-6 h-6"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                            />
                                        </svg>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </Layout>
    );
}

export default withSwal(({ swal }, ref) => <Category swal={swal} />);
