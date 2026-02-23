import dotenv from "dotenv";
dotenv.config();

const INPUT_FOLDER = process.env.INPUT_FOLDER;
const OUTPUT_FOLDER = process.env.OUTPUT_FOLDER;
const TEMP_FOLDER = process.env.TEMP_FOLDER;

if (!INPUT_FOLDER || !OUTPUT_FOLDER || !TEMP_FOLDER) {
  throw new Error("Missing required environment variables");
}

export const config = {
  inputFolder: INPUT_FOLDER,
  outputFolder: OUTPUT_FOLDER,
  tempFolder: TEMP_FOLDER,
};