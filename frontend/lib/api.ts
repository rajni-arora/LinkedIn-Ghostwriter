import axios from "axios";

const client = axios.create({
  baseURL: "http://localhost:8000",
  headers: { "Content-Type": "application/json" },
});

interface GeneratePostRequest {
  topic: string;
  tone: string;
  api_key: string;
}

interface GeneratePostResponse {
  post: string;
}

export async function generatePost(
  payload: GeneratePostRequest
): Promise<GeneratePostResponse> {
  try {
    const { data } = await client.post<GeneratePostResponse>(
      "/generate/post",
      payload
    );
    return data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response?.data?.detail) {
      throw new Error(err.response.data.detail);
    }
    throw new Error(
      "Failed to connect to the backend. Is it running on port 8000?"
    );
  }
}
