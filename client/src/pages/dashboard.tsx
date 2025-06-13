import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Monitor, CheckCircle, XCircle, AlertTriangle, UserCircle, LogOut, UserCog, Mail, Phone } from "lucide-react";
import ComputerTable from "@/components/computer-table";
import AddComputerModal from "@/components/add-computer-modal";
import RemoteAccessModal from "@/components/remote-access-modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import type { Computer } from "@shared/schema";
const countryCodes = [
  { name: "United States", dial_code: "+1", code: "US" },
  { name: "United Kingdom", dial_code: "+44", code: "GB" },
  { name: "Canada", dial_code: "+1", code: "CA" },
  { name: "Australia", dial_code: "+61", code: "AU" },
  { name: "India", dial_code: "+91", code: "IN" },
  { name: "Germany", dial_code: "+49", code: "DE" },
  { name: "France", dial_code: "+33", code: "FR" },
  { name: "Japan", dial_code: "+81", code: "JP" },
  { name: "China", dial_code: "+86", code: "CN" },
  { name: "Brazil", dial_code: "+55", code: "BR" },
  { name: "South Africa", dial_code: "+27", code: "ZA" },
  { name: "Russia", dial_code: "+7", code: "RU" },
  { name: "Mexico", dial_code: "+52", code: "MX" },
  { name: "Italy", dial_code: "+39", code: "IT" },
  { name: "Spain", dial_code: "+34", code: "ES" },
  { name: "Netherlands", dial_code: "+31", code: "NL" },
  { name: "Sweden", dial_code: "+46", code: "SE" },
  { name: "Norway", dial_code: "+47", code: "NO" },
  { name: "Finland", dial_code: "+358", code: "FI" },
  { name: "Denmark", dial_code: "+45", code: "DK" },
  { name: "Belgium", dial_code: "+32", code: "BE" },
  { name: "Switzerland", dial_code: "+41", code: "CH" },
  { name: "Austria", dial_code: "+43", code: "AT" },
  { name: "Poland", dial_code: "+48", code: "PL" },
  { name: "Czech Republic", dial_code: "+420", code: "CZ" },
  { name: "Portugal", dial_code: "+351", code: "PT" },
  { name: "Ireland", dial_code: "+353", code: "IE" },
  { name: "Greece", dial_code: "+30", code: "GR" },
  { name: "Turkey", dial_code: "+90", code: "TR" },
  { name: "Argentina", dial_code: "+54", code: "AR" },
  { name: "Chile", dial_code: "+56", code: "CL" },  
  { name: "Colombia", dial_code: "+57", code: "CO" },
  { name: "Peru", dial_code: "+51", code: "PE" },
  { name: "Venezuela", dial_code: "+58", code: "VE" },
  { name: "Philippines", dial_code: "+63", code: "PH" },
  { name: "Indonesia", dial_code: "+62", code: "ID" },
  { name: "Malaysia", dial_code: "+60", code: "MY" },
  { name: "Singapore", dial_code: "+65", code: "SG" },
  { name: "Thailand", dial_code: "+66", code: "TH" },
  { name: "Vietnam", dial_code: "+84", code: "VN" },
  { name: "New Zealand", dial_code: "+64", code: "NZ" },
  { name: "South Korea", dial_code: "+82", code: "KR" },
  { name: "United Arab Emirates", dial_code: "+971", code: "AE" },
  { name: "Saudi Arabia", dial_code: "+966", code: "SA" },  
  { name: "Egypt", dial_code: "+20", code: "EG" },
  { name: "Morocco", dial_code: "+212", code: "MA" },
  { name: "Nigeria", dial_code: "+234", code: "NG" },
  { name: "Kenya", dial_code: "+254", code: "KE" },
  { name: "Uganda", dial_code: "+256", code: "UG" },
  { name: "Tanzania", dial_code: "+255", code: "TZ" },
  { name: "Zimbabwe", dial_code: "+263", code: "ZW" },
  { name: "Ghana", dial_code: "+233", code: "GH" },
  { name: "Cameroon", dial_code: "+237", code: "CM" },
  { name: "Senegal", dial_code: "+221", code: "SN" },
  { name: "Ivory Coast", dial_code: "+225", code: "CI" },
  { name: "Algeria", dial_code: "+213", code: "DZ" },
  { name: "Tunisia", dial_code: "+216", code: "TN" },
  { name: "Libya", dial_code: "+218", code: "LY" },
  { name: "Bangladesh", dial_code: "+880", code: "BD" },
  { name: "Pakistan", dial_code: "+92", code: "PK" },
  { name: "Sri Lanka", dial_code: "+94", code: "LK" },
  { name: "Nepal", dial_code: "+977", code: "NP" },
  { name: "Afghanistan", dial_code: "+93", code: "AF" },
  { name: "Kazakhstan", dial_code: "+7", code: "KZ" },
  { name: "Uzbekistan", dial_code: "+998", code: "UZ" },
  { name: "Azerbaijan", dial_code: "+994", code: "AZ" },
  { name: "Georgia", dial_code: "+995", code: "GE" },
  { name: "Armenia", dial_code: "+374", code: "AM" },
  { name: "Mongolia", dial_code: "+976", code: "MN" },
  { name: "Iraq", dial_code: "+964", code: "IQ" },
  { name: "Syria", dial_code: "+963", code: "SY" },
  { name: "Lebanon", dial_code: "+961", code: "LB" },
  { name: "Jordan", dial_code: "+962", code: "JO" },
  { name: "Oman", dial_code: "+968", code: "OM" },
  { name: "Qatar", dial_code: "+974", code: "QA" },
  { name: "Bahrain", dial_code: "+973", code: "BH" },
  { name: "Kuwait", dial_code: "+965", code: "KW" },
  { name: "Yemen", dial_code: "+967", code: "YE" },
  { name: "Afghanistan", dial_code: "+93", code: "AF" },
  { name: "Myanmar (Burma)", dial_code: "+95", code: "MM" },
  { name: "Cambodia", dial_code: "+855", code: "KH" },
  { name: "Laos", dial_code: "+856", code: "LA" },
  { name: "Brunei", dial_code: "+673", code: "BN" },
  { name: "Macao", dial_code: "+853", code: "MO" },
  { name: "Hong Kong", dial_code: "+852", code: "HK" },
  { name: "Taiwan", dial_code: "+886", code: "TW" },
  { name: "Maldives", dial_code: "+960", code: "MV" }
];

const departmentOptions = [
  "HK", "RES", "IT", "KIT", "T&C", "SPA", "T&R", "F&B"
];

export default function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeStat, setActiveStat] = useState<string | null>(null);
  const [isInventoryOpen, setIsInventoryOpen] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isRemoteModalOpen, setIsRemoteModalOpen] = useState(false);
  const [selectedComputer, setSelectedComputer] = useState<Computer | null>(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [personalInfoOpen, setPersonalInfoOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [username, setUsername] = useState(() => {
    // Try to get logged in user from localStorage or default to 'admin'
    const stored = localStorage.getItem('logged_in_user');
    return stored || 'admin';
  });
  const [countryCode, setCountryCode] = useState("+1");
  const [department, setDepartment] = useState("");
  const [occupation, setOccupation] = useState("");
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const { data: computers = [], isLoading, refetch } = useQuery({
    queryKey: ["/api/computers", searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      const response = await fetch(`/api/computers?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch computers");
      }
      return response.json() as Promise<Computer[]>;
    },
  });

  // Close profile menu on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false);
      }
    }
    if (profileMenuOpen) {
      document.addEventListener("mousedown", handleClick);
    } else {
      document.removeEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [profileMenuOpen]);

  const filteredComputers =
    activeStat && activeStat !== "Total Computers"
      ? computers.filter((c: Computer) => {
          if (activeStat === "Online") return c.status === "online";
          if (activeStat === "Offline") return c.status === "offline";
          if (activeStat === "Alerts") return c.status === "warning";
          return true;
        })
      : computers;

  const handleConnectRemote = (computer: Computer) => {
    if (computer.remoteEnabled && computer.remotePassword) {
      setSelectedComputer(computer);
      setIsRemoteModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md border-b border-gray-200 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Monitor className="text-blue-600 h-8 w-8 mr-3" />
              <h1 className="text-xl font-medium text-gray-900">Computer Management System</h1>
            </div>
            <div className="relative" ref={profileMenuRef}>
              <button
                className="flex items-center space-x-2 focus:outline-none"
                onClick={() => setProfileMenuOpen((v) => !v)}
                title="Profile menu"
              >
                <img
                  src={profilePic || "https://ui-avatars.com/api/?name=" + encodeURIComponent(username)}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover border"
                />
                <span className="text-sm text-gray-600 font-medium hidden sm:inline">{username}</span>
              </button>
              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50">
                  <button
                    className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => { setPersonalInfoOpen(true); setProfileMenuOpen(false); }}
                  >
                    <UserCog className="w-4 h-4 mr-2" /> Personal Info
                  </button>
                  <button
                    className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={onLogout}
                  >
                    <LogOut className="w-4 h-4 mr-2" /> Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Personal Info Submenu */}
        {personalInfoOpen && (
          <div className="fixed top-0 right-0 h-full w-full max-w-sm bg-white border-l border-gray-200 shadow-2xl z-50 p-6 flex flex-col">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <img
                src={profilePic || "https://ui-avatars.com/api/?name=" + encodeURIComponent(username)}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover border mr-2"
              />
              Personal Info
            </h3>
            <div className="flex flex-col items-center mb-4">
              <label htmlFor="profile-pic-upload" className="cursor-pointer">
                <img
                  src={profilePic || "https://ui-avatars.com/api/?name=" + encodeURIComponent(username)}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover border mb-2"
                />
                <input
                  id="profile-pic-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = ev => setProfilePic(ev.target?.result as string);
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
              <span className="text-base font-medium text-gray-800 mt-1">{username}</span>
              <span className="text-sm text-gray-600">Change Profile Picture</span>
            </div>
            <div className="mb-2 flex items-center">
              <Mail className="w-4 h-4 mr-2 text-black" strokeWidth={2.2} />
              <input type="email" className="border p-2 rounded w-full" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="mb-4 flex items-center">
              <Phone className="w-4 h-4 mr-2 text-black" strokeWidth={2.2} />
              <select
                className="border p-2 rounded mr-2 w-32"
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
              >
                {countryCodes.map((c) => (
                  <option key={c.code} value={c.dial_code}>
                    {c.dial_code}
                  </option>
                ))}
              </select>
              <input
                type="tel"
                className="border p-2 rounded w-full"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
              />
            </div>
            <div className="mb-2 flex items-center">
              <svg className="w-4 h-4 mr-2 text-black" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path d="M3 21v-2a4 4 0 014-4h10a4 4 0 014 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <select
                className="border p-2 rounded w-full"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              >
                <option value="">Select Department</option>
                {departmentOptions.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div className="mb-4 flex items-center">
              <svg className="w-4 h-4 mr-2 text-black" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3v4M8 3v4M2 13h20"/></svg>
              <input
                type="text"
                className="border p-2 rounded w-full"
                placeholder="Occupation / Position"
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
              />
            </div>
            <div className="flex justify-end space-x-2 mt-auto">
              <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={() => setPersonalInfoOpen(false)}>Save</button>
              <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => setPersonalInfoOpen(false)}>Close</button>
            </div>
          </div>
        )}
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview as interactive buttons */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: "Total Computers",
              value: computers.length,
              icon: <Monitor className="h-5 w-5 text-gray-400" />,
            },
            {
              title: "Online",
              value: computers.filter((c: Computer) => c.status === "online").length,
              icon: <CheckCircle className="h-5 w-5 text-green-400" />,
            },
            {
              title: "Offline",
              value: computers.filter((c: Computer) => c.status === "offline").length,
              icon: <XCircle className="h-5 w-5 text-red-400" />,
            },
            {
              title: "Alerts",
              value: computers.filter((c: Computer) => c.status === "warning").length,
              icon: <AlertTriangle className="h-5 w-5 text-yellow-400" />,
            }
          ].map((stat) => (
            <button
              key={stat.title}
              className={`border border-gray-200 rounded-lg bg-white p-6 text-left transition-shadow focus:outline-none focus:ring-2 focus:ring-blue-500 ${activeStat === stat.title ? "ring-2 ring-blue-500" : ""}`}
              onClick={() => setActiveStat(stat.title === activeStat ? null : stat.title)}
            >
              <div className="flex items-center">
                {stat.icon}
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
        {/* Computer Inventory */}
        <div className="bg-white rounded-lg shadow mb-8 mt-8">
          <div>
            {/* Table Header with Actions */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-lg font-medium text-gray-900 mb-2 sm:mb-0">Computer Inventory</h2>
                <div className="flex space-x-3">
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
