import axios from "axios";

const PYTHON_API_URL = process.env.AI_PARSER_URL;

export const extractResumeText = async (fileUrl) => {
  try {
    const response = await axios.post(`${PYTHON_API_URL}/extract-text`, {
      file_url: fileUrl
    });

    return response.data;
  } catch (error) {
    console.error("Python Resume Parsing Error:", error.message);
    if (error.response) {
      throw new Error(error.response.data.detail || "Python service error");
    }
    throw new Error("Failed to connect to Resume Parser Service");
  }
};
