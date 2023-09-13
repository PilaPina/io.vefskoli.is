import { NextRequest, NextResponse as res } from "next/server";
import { connectToDatabase } from "@/utils/mongoose-connector";
import { Guide, GuideType } from "@/models/guide";

interface Success {
  message: string;
}

/**
 * @swagger
 * /api/guides:
 *   post:
 *     description: Creates a new guide
 *     responses:
 *      200:
 *       description: guide created successfully
 *      400:
 *       description: Bad request - Invalid guide data
 *   get:
 *     description: Returns all guides
 *     responses:
 *       200:
 *         description: Successfully returned all guides
 *       404:
 *         description: No guides found
 */


export const POST = async (
  req: NextRequest
) => {
  // TODO: Add logic to create a guide
  await connectToDatabase();
  const body = await req.json();
  Guide.create(body);
  res.json({ message: "Guide created successfully" }, { status: 200 });
}

export const GET = async (
  req: NextRequest,
) => {
  await connectToDatabase();
  const guides = await Guide.find({});
  if (guides === null) {
    return res.json({ message: "Guide not found" }, { status: 404 });
  }
   return res.json(guides, { status: 200 });
}

