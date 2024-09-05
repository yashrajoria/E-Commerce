import Chart from "@/components/Chart";
import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  return (
    <Layout>
      <div className="text-blue-900 flex justify-between">
        <h2>
          Hello, <b>{session?.user?.name}</b>
        </h2>
        <div className="flex  bg-gray-300 text-black gap-1 rounded-lg">
          <img
            src={session?.user?.image}
            alt="User Image"
            className="w-6 h-6 overflow-hidden"
          />
          <span className="px-2">{session?.user?.name}</span>
        </div>
      </div>
      <Chart />
    </Layout>
  );
}
