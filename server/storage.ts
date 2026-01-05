import { db } from "./db";
import { locationQueries, type InsertLocationQuery, type LocationQuery } from "@shared/schema";
import { chatStorage, type IChatStorage } from "./replit_integrations/chat/storage";
import { desc } from "drizzle-orm";

export interface IStorage extends IChatStorage {
  createLocationQuery(query: InsertLocationQuery): Promise<LocationQuery>;
  getRecentLocationQueries(): Promise<LocationQuery[]>;
}

export class DatabaseStorage implements IStorage {
  // Inherit chat storage methods
  getConversation = chatStorage.getConversation;
  getAllConversations = chatStorage.getAllConversations;
  createConversation = chatStorage.createConversation;
  deleteConversation = chatStorage.deleteConversation;
  getMessagesByConversation = chatStorage.getMessagesByConversation;
  createMessage = chatStorage.createMessage;

  async createLocationQuery(query: InsertLocationQuery): Promise<LocationQuery> {
    const [result] = await db.insert(locationQueries).values(query).returning();
    return result;
  }

  async getRecentLocationQueries(): Promise<LocationQuery[]> {
    return await db.select().from(locationQueries).orderBy(desc(locationQueries.createdAt)).limit(10);
  }
}

export const storage = new DatabaseStorage();
