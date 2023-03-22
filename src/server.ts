import express, { Request, Response } from "express";
import connectDB from "./utils/db.utils";
import appModule from "./routes/index";

export const server = express();
server.use(express.json());
const PORT = process.env.PORT || 3005;

server.get("/", (req: Request, res: Response) => {
  return res
    .status(200)
    .json({ message: "Vending machine here. What do you want to buy?" });
});

server.use("/api/v1/", appModule);

server.listen(PORT, () => {
  connectDB().catch(() => console.log("db connection error"));
  console.log(`server started on port ${PORT}`);
});
