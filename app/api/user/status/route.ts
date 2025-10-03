import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ status: null }, { status: 401 });
    }
    
    // Return basic user status without database dependency
    return NextResponse.json({
      status: 'active',
      userId,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error fetching user status:", error);
    return NextResponse.json({ error: "Failed to fetch status" }, { status: 500 });
  }
}
