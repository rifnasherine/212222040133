import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

export const logError = async (stack, level, pkg, message) => {
  try {
    await axios.post("http://20.244.56.144/evaluation-service/logs", {
      stack,
      level,
      package: pkg,
      message,
    }, {
      headers: {
        Authorization: `Bearer ${process.env.AFFORDMED_AUTH_TOKEN}`
      }
    });
  } catch (err) {
    console.error("Logging failed:", err.message);
  }
};
