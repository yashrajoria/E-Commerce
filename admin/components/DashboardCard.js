import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

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

const DashboardCard = ({
  title,
  icon: Icon,
  value,
  currency,
  orderDetails,
}) => {
  const link = getLinkForTitle(title); // Get the link based on title

  return (
    <Card className="bg-white shadow-lg rounded-xl border border-gray-300 overflow-hidden w-full transition-all duration-300 transform">
      <CardHeader className="bg-gray-50 p-4 border-b border-gray-200 justify-center flex">
        {title === "Total Orders" ? (
          <HoverCard>
            <HoverCardTrigger className="text-xl font-semibold text-gray-800 hover:underline hover:text-purple-500 transition-colors duration-300">
              <Link href={link} passHref>
                <span className="text-xl font-semibold text-gray-800 hover:underline hover:text-purple-500 transition-colors duration-300">
                  {title}
                </span>
              </Link>
            </HoverCardTrigger>
            <HoverCardContent className="p-4 bg-white rounded-lg shadow-lg border border-gray-200">
              <div className="space-y-4">
                {orderDetails.map((details, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-gray-50 p-3 rounded-md shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="text-sm font-medium text-gray-600">
                      <p>
                        <span className="font-semibold text-gray-800">
                          Paid:
                        </span>{" "}
                        {details.paid}
                      </p>
                      <p>
                        <span className="font-semibold text-gray-800">
                          Unpaid:
                        </span>{" "}
                        {details.unpaid}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </HoverCardContent>
          </HoverCard>
        ) : (
          <Link href={link} passHref>
            <span className="text-xl font-semibold text-gray-800 hover:underline hover:text-purple-500 transition-colors duration-300">
              {title}
            </span>
          </Link>
        )}
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center p-6">
        <Icon
          size={60}
          className="text-orange-500 transition-colors duration-300 hover:text-yellow-300"
        />
      </CardContent>
      <CardFooter className="bg-gray-50 p-4 border-t border-gray-200 justify-center">
        <span className="text-3xl font-bold text-gray-900">
          {currency ? `₹ ${value}` : value}
        </span>
      </CardFooter>
    </Card>
  );
};

export default DashboardCard;
