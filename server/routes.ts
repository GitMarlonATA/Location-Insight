import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { registerChatRoutes } from "./replit_integrations/chat";
import { registerImageRoutes } from "./replit_integrations/image";
import { api } from "@shared/routes";
import { z } from "zod";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Register integration routes
  registerChatRoutes(app);
  registerImageRoutes(app);

  app.post(api.location.describe.path, async (req, res) => {
    try {
      const { latitude, longitude } = api.location.describe.input.parse(req.body);

      // 1. Reverse Geocoding (Nominatim) to get context
      let address = "Unknown Location";
      try {
        const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`, {
          headers: {
            'User-Agent': 'ReplitLocationApp/1.0'
          }
        });
        if (geoRes.ok) {
          const geoData = await geoRes.json();
          address = geoData.display_name || address;
        }
      } catch (e) {
        console.error("Geocoding failed:", e);
      }

      // 2. Generate Description with OpenAI
      const prompt = `
        I am at Latitude: ${latitude}, Longitude: ${longitude}.
        The approximate address is: ${address}.
        
        Provide a concise, interesting description of what is around this location. 
        Mention landmarks, type of area (urban, rural, residential, commercial), 
        and any notable features close by. Keep it under 150 words.
      `;

      const completion = await openai.chat.completions.create({
        model: "gpt-5.1", // Using the model from blueprint instructions
        messages: [{ role: "user", content: prompt }],
        max_completion_tokens: 300,
      });

      const description = completion.choices[0]?.message?.content || "Could not generate description.";

      // 3. Store in DB
      await storage.createLocationQuery({
        latitude: String(latitude),
        longitude: String(longitude),
        address,
        description,
      });

      res.json({ description, address });

    } catch (err) {
      console.error(err);
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid input" });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.get(api.location.history.path, async (req, res) => {
    const history = await storage.getRecentLocationQueries();
    res.json(history);
  });

  return httpServer;
}
