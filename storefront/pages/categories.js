import Header from "@/components/Header";
import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/Category";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Categories = ({ categories }) => {
  // Step 1: Organize categories by parent
  const categoryMap = categories.reduce((acc, category) => {
    acc[category._id] = { ...category, children: [] };
    return acc;
  }, {});

  // Populate children
  categories.forEach((category) => {
    if (category.parent) {
      categoryMap[category.parent].children.push(category);
    }
  });

  // Step 2: Render the accordion
  return (
    <>
      <Header />
      <div className="container mx-auto p-6 text-black min-h-screen">
        <h1 className="text-3xl font-bold text-black mb-6">Categories</h1>

        {Object.values(categoryMap).map((category) => (
          <Accordion key={category._id} type="single" collapsible>
            <AccordionItem value={`item-${category._id}`}>
              <AccordionTrigger className="py-4 px-6 text-xl font-semibold text-black hover:bg-red-200 transition-colors rounded-lg">
                <Link href={`/categories/${category._id}`}>
                  {category.name}
                </Link>
              </AccordionTrigger>
              <AccordionContent className="py-4 px-6">
                {category.children.length > 0 ? (
                  <ul className="list-disc pl-6">
                    {category.children.map((child) => (
                      <li key={child._id} className="mb-4">
                        <Link
                          href={`/categories/${child._id}`}
                          className="text-black hover:underline"
                        >
                          {child.name}
                        </Link>
                        <div className="ml-4">
                          {child.properties.map((property, index) => (
                            <div key={index} className="mb-2">
                              <strong>{property.name}:</strong>
                              <ul className="list-inside list-disc text-gray-300">
                                {property.values.map((value, idx) => (
                                  <li key={idx}>{value}</li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400">No child categories</p>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </div>
    </>
  );
};

export default Categories;

export async function getServerSideProps() {
  await mongooseConnect();
  const categories = await Category.find();
  const categoryMap = new Map();

  // Map categories for quick access
  categories.forEach((category) => {
    categoryMap.set(category._id.toString(), category);
  });

  // Filter categories to find main categories (parent is null)
  const mainCategories = categories.map((category) => ({
    name: category.name,
    properties: category.properties, // Subcategories are included here
    parent: category.parent,
    catId: category._id.toString(),
  }));

  // Filter out categories that are main categories (parent is null)
  const result = mainCategories
    .filter((mainCategory) => mainCategory.parent !== null)
    .map((mainCategory) => {
      // Find subcategories of the main category
      const subCategories = mainCategories.map((subCategory) => ({
        name: subCategory.name,
        properties: subCategory.properties,
        parent: subCategory.catId,
        catId: subCategory.catId,
      }));

      return {
        ...mainCategory,
        properties: subCategories,
      };
    });
  return {
    props: {
      categories: JSON.parse(JSON.stringify(categories)),
    },
  };
}
