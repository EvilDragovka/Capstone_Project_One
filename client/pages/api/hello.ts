// Importing types for Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
// Importing types for Next.js API routes
type Data = {
  name: string;
};
// Default exported function for handling the API route
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {// Sending a JSON response with status code 200 and a body containing a name property.
  res.status(200).json({ name: "John Doe" });
}
