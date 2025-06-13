import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Monitor, User } from "lucide-react";
import StatsOverview from "@/components/stats-overview";
import ComputerTable from "@/components/computer-table";
import AddComputerModal from "@/components/add-computer-modal";
import RemoteAccessModal from "@/components/remote-access-modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Computer } from "@shared/schema";

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [ramFilter, setRamFilter] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isRemoteModalOpen, setIsRemoteModalOpen] = useState(false);
  const [selectedComputer, setSelectedComputer] = useState<Computer | null>(null);

  const { data: computers = [], isLoading, refetch } = useQuery({
    queryKey: ["/api/computers", searchQuery, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (statusFilter) params.append("status", statusFilter);
      
      const response = await fetch(`/api/computers?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch computers");
      }
      return response.json() as Promise<Computer[]>;
    },
  });

  const filteredComputers = computers.filter(computer => {
    if (ramFilter && !computer.ram.toLowerCase().includes(ramFilter.toLowerCase())) {
      return false;
    }
    return true;
  });

  const handleConnectRemote = (computer: Computer) => {
    if (computer.remoteEnabled && computer.remotePassword) {
      setSelectedComputer(computer);
      setIsRemoteModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Monitor className="text-blue-600 h-8 w-8 mr-3" />
              <h1 className="text-xl font-medium text-gray-900">Computer Management System</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">IT Administrator</span>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="text-white h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <StatsOverview />

        {/* Computer Management */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Table Header with Actions */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-lg font-medium text-gray-900">Computer Inventory</h2>
              <div className="mt-4 sm:mt-0 flex space-x-3">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search computers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64"
                  />
                </div>
                <Button
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Add Computer
                </Button>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
            <div className="flex flex-wrap gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Status</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={ramFilter} onValueChange={setRamFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="All RAM" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All RAM</SelectItem>
                  <SelectItem value="8GB">8GB+</SelectItem>
                  <SelectItem value="16GB">16GB+</SelectItem>
                  <SelectItem value="32GB">32GB+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Computer Table */}
          <ComputerTable
            computers={filteredComputers}
            isLoading={isLoading}
            onEdit={(computer) => {
              setSelectedComputer(computer);
              setIsAddModalOpen(true);
            }}
            onDelete={() => refetch()}
            onConnectRemote={handleConnectRemote}
            onRefresh={refetch}
          />
        </div>
      </div>

      {/* Modals */}
      <AddComputerModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setSelectedComputer(null);
        }}
        onSuccess={() => {
          refetch();
          setIsAddModalOpen(false);
          setSelectedComputer(null);
        }}
        computer={selectedComputer}
      />

      <RemoteAccessModal
        isOpen={isRemoteModalOpen}
        onClose={() => {
          setIsRemoteModalOpen(false);
          setSelectedComputer(null);
        }}
        computer={selectedComputer}
      />
    </div>
  );
}
