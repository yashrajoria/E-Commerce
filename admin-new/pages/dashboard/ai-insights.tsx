import Head from "next/head";
import { GetServerSideProps } from "next";
import { AIInsightsWorkspace } from "@/components/dashboard/ai/AIInsightsWorkspace";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

const AIInsightsPage = () => {
  return (
    <>
      <Head>
        <title>AI Insights | ShopSwift Admin</title>
        <meta
          name="description"
          content="Flagship AI Insights workspace for admin operations with tool trace diagnostics"
        />
      </Head>
      <div className="flex min-h-screen bg-background">
        <DashboardSidebar />
        <div className="min-w-0 flex-1">
          <AIInsightsWorkspace />
        </div>
      </div>
    </>
  );
};

export default AIInsightsPage;

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};
