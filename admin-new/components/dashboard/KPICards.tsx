import { Card, CardContent } from "@/components/ui/card";

export default function KPICards() {
  const kpis = [
    { label: "Total Sales", value: "$14,200" },
    { label: "New Orders", value: "32" },
    { label: "Visitors", value: "1,024" },
    { label: "New Customers", value: "12" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-5">
      {kpis.map((kpi, idx) => (
        <Card
          key={idx}
          className={`bg-gradient-to-br from-indigo-500 to-purple-600 transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110`}
        >
          <CardContent className="p-4">
            <div className="text-sm opacity-70">{kpi.label}</div>
            <div className="text-xl font-bold">{kpi.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
