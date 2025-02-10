import chalk from "chalk";
import mongoose from "mongoose";

export async function mongoConnect() {
  const uri = process.env.ATLAS_URI;

  if (!uri) {
    console.error(
      `${chalk.redBright("[ERROR]")} ${chalk.whiteBright(
        "ATLAS_URI is not defined in environment variables."
      )}`
    );
    return;
  }

  try {
    await mongoose.connect(uri);
    console.log(
      `${chalk.whiteBright("[CLIENT]")} ${chalk.greenBright(
        "Connected to MongoDB 🥭"
      )}`
    );
  } catch (error) {
    console.error(
      `${chalk.redBright("[ERROR]")} ${chalk.whiteBright(
        "Error to connect MongoDB:"
      )}`,
      error
    );
  }
}
