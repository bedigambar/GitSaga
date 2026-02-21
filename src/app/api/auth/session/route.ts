import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function GET() {
    const session = await getSession();

    if (!session) {
        return NextResponse.json(null, { status: 401 });
    }

    return NextResponse.json({
        user: {
            id: session.userId,
            name: session.name,
            email: session.email,
            image: session.image,
            login: session.login,
        },
    });
}
