import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

// Define your title-to-link mapping
const titleToLinkMap = [
  { title: "Total Orders", link: "/orders" },
  { title: "Total Products", link: "/products" },
  { title: "Total Revenue", link: "/orders" },
];

// Function to get the link based on the title
const getLinkForTitle = (title) => {
  const mapping = titleToLinkMap.find((item) => item.title === title);
  return mapping ? mapping.link : "/"; // Fallback to a default route if title not found
};

const DashboardCard = ({ title, icon: Icon, value, currency }) => {
  const link = getLinkForTitle(title); // Get the link based on title

  return (
    <Card className="bg-white shadow-lg rounded-xl border border-gray-300 overflow-hidden w-full transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:ring-2 hover:ring-yellow-400 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500">
      <CardHeader className="bg-gray-50 p-4 border-b border-gray-200 justify-center flex">
        <Link href={link} passHref>
          <CardTitle className="text-xl font-semibold text-gray-800 text-center hover:underline">
            {title}
          </CardTitle>
        </Link>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center p-6 transition-transform transform hover:-translate-y-1">
        <Icon
          size={60}
          className="text-orange-500 transition-colors duration-300 hover:text-yellow-300"
        />
      </CardContent>
      <CardFooter className="bg-gray-50 p-4 border-t border-gray-200 justify-center transition-colors duration-300 hover:text-yellow-300">
        <span className="text-3xl font-bold text-gray-900">
          {currency ? `₹ ${value}` : value}
        </span>
      </CardFooter>
    </Card>
  );
};

export default DashboardCard;
