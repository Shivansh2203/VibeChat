import express from "express";
import { protectRoute } from "../middleware/auth.js";

import {
  getMessages,
  getUsersForSidebar,
  markMessageAsSeen,
  sendMessage,
} from "../controllers/messageController.js";

const messageRouter = express.Router();

// Get all users except logged-in user + unseen counts
messageRouter.get("/users", protectRoute, getUsersForSidebar);

// Get all messages with a selected user
messageRouter.get("/:id", protectRoute, getMessages);

// Mark a message as seen
messageRouter.put("/mark/:id", protectRoute, markMessageAsSeen);

// Send a message
messageRouter.post("/send/:id", protectRoute, sendMessage);

export default messageRouter;
