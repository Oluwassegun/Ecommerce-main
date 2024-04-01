import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server"

//this code allows us find a specific size in the  database
export async function GET(
    req: Request,
    {params}: {params: {colorId: string}}
) {
    try {
        if (!params.colorId) {
            return new NextResponse("Color id is required", {status: 400})
        };

        const color = await prismadb.color.findUnique({
            where: {
                id: params.colorId
            }
        });

        return NextResponse.json(color)
    } catch (error) {
        console.log("[COLOR_GET]", error)
        return new NextResponse("Internal error", {status: 500})
    }
}

//this code allows us to update the colors in the  database
export async function PATCH(
    req: Request,
    {params}: {params: {colorId: string, storeId: string}}
) {
    try {
        const {userId} = auth()
        const body = await req.json();

        const {name, value} = body

        if (!userId) {
            return new NextResponse("Unauthenticated", {status: 401})
        };

        if (!value) {
            return new NextResponse("value is required", {status: 400})
        }

        if (!name) {
            return new NextResponse("name is required", {status: 400})
        }

        if (!params.colorId) {
            return new NextResponse ("color id is required", {status: 400})
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId
            }
        });

        if (!storeByUserId) {
            return new NextResponse("Unauthorized", {status: 403})
        }

        const color = await prismadb.color.updateMany({
            where: {
                id: params.colorId
            },
            data: {
                name,
                value
            }
        });

        return NextResponse.json(color)
    } catch (error) {
        console.log("[COLOR_PATCH]", error)
        return new NextResponse ("Internal error", {status: 500})
    }
};

// this code deletes colors from the database
export async function DELETE(
    req: Request,
    {params}: {params: {storeId: string, colorId: string}}
) {
    try {
        const {userId} =auth()

        if (!userId) {
            return new NextResponse("Unauthenticated", {status: 401})
        }

        if (!params.colorId) {
            return new NextResponse ("color id is required", {status: 400})
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        });

        if (!storeByUserId) {
            return new NextResponse ("Unauthorized", {status: 403})
        }

        const color = await prismadb.color.deleteMany({
            where: {
                id: params.colorId
            }
        });

        return NextResponse.json(color)
    } catch (error) {
        console.log("[COLOR_DELETE]", error)
        return new NextResponse("Internal error", {status: 500})
    }
}