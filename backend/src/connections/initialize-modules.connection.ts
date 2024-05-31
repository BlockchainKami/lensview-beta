import { connectToMongoDB } from "./mongo-db.connection";

export const initializeModules = async () => {
  await connectToMongoDB();
};
