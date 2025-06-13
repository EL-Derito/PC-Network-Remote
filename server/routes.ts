import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertComputerSchema, updateComputerSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all computers
  app.get("/api/computers", async (req, res) => {
    try {
      const { search, status } = req.query;
      
      let computers;
      if (search) {
        computers = await storage.searchComputers(search as string);
      } else if (status) {
        computers = await storage.getComputersByStatus(status as string);
      } else {
        computers = await storage.getAllComputers();
      }
      
      res.json(computers);
    } catch (error) {
      console.error("Error fetching computers:", error);
      res.status(500).json({ message: "Failed to fetch computers" });
    }
  });

  // Get single computer
  app.get("/api/computers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const computer = await storage.getComputer(id);
      
      if (!computer) {
        return res.status(404).json({ message: "Computer not found" });
      }
      
      res.json(computer);
    } catch (error) {
      console.error("Error fetching computer:", error);
      res.status(500).json({ message: "Failed to fetch computer" });
    }
  });

  // Create computer
  app.post("/api/computers", async (req, res) => {
    try {
      const result = insertComputerSchema.safeParse(req.body);
      
      if (!result.success) {
        const errorMessage = fromZodError(result.error);
        return res.status(400).json({ message: errorMessage.toString() });
      }
      
      const computer = await storage.createComputer(result.data);
      res.status(201).json(computer);
    } catch (error) {
      console.error("Error creating computer:", error);
      res.status(500).json({ message: "Failed to create computer" });
    }
  });

  // Update computer
  app.patch("/api/computers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const result = updateComputerSchema.safeParse(req.body);
      
      if (!result.success) {
        const errorMessage = fromZodError(result.error);
        return res.status(400).json({ message: errorMessage.toString() });
      }
      
      const computer = await storage.updateComputer(id, result.data);
      
      if (!computer) {
        return res.status(404).json({ message: "Computer not found" });
      }
      
      res.json(computer);
    } catch (error) {
      console.error("Error updating computer:", error);
      res.status(500).json({ message: "Failed to update computer" });
    }
  });

  // Delete computer
  app.delete("/api/computers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteComputer(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Computer not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting computer:", error);
      res.status(500).json({ message: "Failed to delete computer" });
    }
  });

  // Get computer statistics
  app.get("/api/computers/stats/overview", async (req, res) => {
    try {
      const computers = await storage.getAllComputers();
      
      const stats = {
        total: computers.length,
        online: computers.filter(c => c.status === "online").length,
        offline: computers.filter(c => c.status === "offline").length,
        warning: computers.filter(c => c.status === "warning").length
      };
      
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
