import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Spinner from "../components/Spinner.js";
import { ReactSortable } from "react-sortablejs";


//reassigning the values here as the names here were same as the ones declated in states hence existing...
export default function ProductForm({
    _id,
    title: existingTitle,
    description: existingDescription,
    price: existingPrice,
    images: existingImages,
    category: existingCategory
}) {
    const [title, setTitle] = useState(existingTitle || "");
    const [description, setDescription] = useState(existingDescription || "");
    const [price, setPrice] = useState(existingPrice || "");
    const [category, setCategory] = useState(existingCategory || "");
    const [images, setImages] = useState(existingImages || []);
    const [isUploading, setIsUploading] = useState(false)
    const [categories, setCategories] = useState([])
    const router = useRouter();

    useEffect(() => {
        axios.get("/api/categories").then(result => {
            console.log(result);
            setCategories(result.data)
        })
    }, [])


    async function saveProduct(e) {
        e.preventDefault();
        const data = { title, description, price, images, category };
        if (_id) {
            await axios.put("/api/products", { ...data, _id });
            router.push("/products");
        } else {
            await axios.post("/api/products", data);
            router.push("/products");
        }
    }
    async function uploadImage(e) {
        const files = e.target?.files;
        setIsUploading(true)
        if (files.length > 0) {
            const data = new FormData();
            for (const file of files) {
                data.append("file", file);
            }
            const res = await axios.post("/api/uploadImage", data);
            setImages((oldImages) => {
                return [...oldImages, ...res.data.links];
            });
            setIsUploading(false)
        }
    }

    function updateImagesOrder(images) {
        console.log(arguments)
        //setting new images in the old images state hence console logged arguments above to see how the images are coming
        setImages(images)
    }

    return (
        <form onSubmit={saveProduct}>
            <label className="text-blue-900">Product Name</label>
            <input
                className="border-2 border-gray-300 rounded-md px-1 w-full mb-2"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                type="text"
                placeholder="Product Name"
            />

            <label className="mb-2 text-blue-900 text-center flex text-12px gap-1 rounded-lg">Category</label>
            <select className="mb-2 border border-gray-500 rounded-md" value={category} onChange={e => setCategory(e.target.value)}>
                <option value=""
                >Choose a Category</option>
                {categories.length > 0 && categories.map(c => (
                    <option value={c._id}>{c.name}</option>
                ))}
            </select>


            <label className="mb-2 text-blue-900 text-center flex text-12px gap-1 rounded-lg">Product Image</label>
            <div className="mb-2 flex flex-wrap gap-2">
                <ReactSortable list={images} className="flex flex-wrap gap-2" setList={updateImagesOrder}>
                    {!!images?.length &&
                        images.map((link) => (
                            <div key={link} className="h-24 inline-block">
                                <img src={link} className="h-[100%] rounded-lg" />
                            </div>
                        ))}
                </ReactSortable >
                {isUploading && (
                    <div className="h-24  flex items-center rounded-lg">
                        <Spinner />
                    </div>
                )}
                <label className="cursor-pointer  w-24 h-24 border text-center flex items-center justify-center text-sm gap-1 text-gray-500 bg-gray-300 rounded-lg">
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
                            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                        />
                    </svg>
                    <div>Upload</div>
                    <input type="file" className="hidden" onChange={uploadImage} />
                </label>
            </div>

            <label className="text-blue-900">Description</label>
            <textarea
                className="border-2 border-gray-300 rounded-md px-1 w-full mb-2"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                type="text"
                placeholder="Description"
            />
            <label className="text-blue-900">Price</label>
            <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="border-2 border-gray-300 rounded-md px-1 w-full mb-2"
                type="number"
                placeholder="Price"
            />
            <button className="rounded-md bg-blue-800 px-4 py-1 mt-2 text-white">
                Save
            </button>
        </form>
    );
}
