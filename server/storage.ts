import { computers, type Computer, type InsertComputer, type UpdateComputer, users, type User, type InsertUser } from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Computer methods
  getAllComputers(): Promise<Computer[]>;
  getComputer(id: number): Promise<Computer | undefined>;
  createComputer(computer: InsertComputer): Promise<Computer>;
  updateComputer(id: number, computer: UpdateComputer): Promise<Computer | undefined>;
  deleteComputer(id: number): Promise<boolean>;
  searchComputers(query: string): Promise<Computer[]>;
  getComputersByStatus(status: string): Promise<Computer[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private computers: Map<number, Computer>;
  private currentUserId: number;
  private currentComputerId: number;

  constructor() {
    this.users = new Map();
    this.computers = new Map();
    this.currentUserId = 1;
    this.currentComputerId = 1;
    
    // Initialize with some sample data for development
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Add sample computers
    const sampleComputers: InsertComputer[] = [
      {
        name: "DEV-WORKSTATION-01",
        processor: "Intel Core i7-12700K",
        ram: "32GB DDR4",
        storage: "1TB NVMe SSD",
        ipAddress: "192.168.1.101",
        remoteEnabled: true,
        remotePassword: "secure123",
        status: "online"
      },
      {
        name: "LAPTOP-MARKETING-03",
        processor: "AMD Ryzen 7 5800H",
        ram: "16GB DDR4",
        storage: "512GB NVMe SSD",
        ipAddress: "192.168.1.205",
        remoteEnabled: false,
        remotePassword: null,
        status: "offline"
      },
      {
        name: "SERVER-DATABASE-01",
        processor: "Intel Xeon E5-2698 v4",
        ram: "64GB ECC DDR4",
        storage: "2TB RAID 1 SSD",
        ipAddress: "192.168.1.10",
        remoteEnabled: true,
        remotePassword: "admin456",
        status: "warning"
      }
    ];

    sampleComputers.forEach(computer => {
      const id = this.currentComputerId++;
      const newComputer: Computer = { ...computer, id };
      this.computers.set(id, newComputer);
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Computer methods
  async getAllComputers(): Promise<Computer[]> {
    return Array.from(this.computers.values());
  }

  async getComputer(id: number): Promise<Computer | undefined> {
    return this.computers.get(id);
  }

  async createComputer(insertComputer: InsertComputer): Promise<Computer> {
    const id = this.currentComputerId++;
    const computer: Computer = { ...insertComputer, id };
    this.computers.set(id, computer);
    return computer;
  }

  async updateComputer(id: number, updateComputer: UpdateComputer): Promise<Computer | undefined> {
    const existingComputer = this.computers.get(id);
    if (!existingComputer) {
      return undefined;
    }
    
    const updatedComputer: Computer = { ...existingComputer, ...updateComputer };
    this.computers.set(id, updatedComputer);
    return updatedComputer;
  }

  async deleteComputer(id: number): Promise<boolean> {
    return this.computers.delete(id);
  }

  async searchComputers(query: string): Promise<Computer[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.computers.values()).filter(computer =>
      computer.name.toLowerCase().includes(lowerQuery) ||
      computer.processor.toLowerCase().includes(lowerQuery) ||
      computer.ram.toLowerCase().includes(lowerQuery) ||
      computer.storage.toLowerCase().includes(lowerQuery) ||
      computer.ipAddress.includes(query)
    );
  }

  async getComputersByStatus(status: string): Promise<Computer[]> {
    return Array.from(this.computers.values()).filter(computer =>
      computer.status === status
    );
  }
}

export const storage = new MemStorage();
