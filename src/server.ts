import express, { Request, Response } from "express";

const server = express();
const PORT = process.env.PORT || 3005;

server.get("/", (req: Request, res: Response) => {
  return res
    .status(200)
    .json({ message: "Vending machine here. What do you want to buy?" });
});

server.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
