import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ComputerTable from "@/components/computer-table";
import { useQuery } from "@tanstack/react-query";
import { Monitor, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Stats {
  total: number;
  online: number;
  offline: number;
  warning: number;
}

export default function StatsOverview() {
  const { data: stats } = useQuery({
    queryKey: ["/api/computers/stats/overview"],
    queryFn: async () => {
      const response = await fetch("/api/computers/stats/overview");
      if (!response.ok) {
        throw new Error("Failed to fetch stats");
      }
      return response.json() as Promise<Stats>;
    },
  });

  const { data: computers = [] } = useQuery({
    queryKey: ["/api/computers"],
    queryFn: async () => {
      const response = await fetch("/api/computers");
      if (!response.ok) {
        throw new Error("Failed to fetch computers");
      }
      return response.json();
    },
  });

  const getFilteredComputers = (status?: string) => {
    if (!status) return computers;
    if (status === "warning")
      return computers.filter((c: any) => c.status === "warning");
    return computers.filter((c: any) => c.status === status);
  };

  const statCards = [
    {
      title: "Total Computers",
      value: stats?.total || 0,
      icon: Monitor,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      status: undefined,
    },
    {
      title: "Online",
      value: stats?.online || 0,
      icon: CheckCircle,
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      status: "online",
    },
    {
      title: "Offline",
      value: stats?.offline || 0,
      icon: XCircle,
      bgColor: "bg-red-50",
      iconColor: "text-red-600",
      status: "offline",
    },
    {
      title: "Alerts",
      value: stats?.warning || 0,
      icon: AlertTriangle,
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
      status: "warning",
    },
  ];

  return (
    <Accordion type="multiple" className="mb-8">
      {statCards.map((stat, index) => (
        <AccordionItem value={stat.title} key={index}>
          <AccordionTrigger>
            <div className="flex items-center">
              <div className={`p-2 ${stat.bgColor} rounded-lg`}>
                <stat.icon className={`${stat.iconColor} h-6 w-6`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  {stat.title}
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stat.value}
                </p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <ComputerTable
              computers={stat.status ? getFilteredComputers(stat.status) : computers}
              isLoading={false}
              onEdit={() => {}}
              onDelete={() => {}}
              onConnectRemote={() => {}}
              onRefresh={() => {}}
            />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
