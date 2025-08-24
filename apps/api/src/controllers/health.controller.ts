import { RequestHandler } from "express";

import mongoose from "mongoose";

export const getHealthInfo: RequestHandler = async (req, res) => {
  let dbStatus = "disconnected";
  let dbLatency = null;

  try {
    const start = Date.now();
    await mongoose.connection.db?.admin().ping();
    dbLatency = Date.now() - start;
    dbStatus = "connected";
  } catch {
    dbStatus = "error";
  }

  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version,
    db: {
      status: dbStatus,
      latency: dbLatency,
    },
    memoryUsage: process.memoryUsage(),
    cpuUsage: process.cpuUsage(),
  });
};
