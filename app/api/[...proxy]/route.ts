import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const SPRING_BOOT_URL = process.env.NEXT_PUBLIC_BASE_URL;

async function proxy(req: NextRequest) {
    const pathMatch = req.nextUrl.pathname.match(/^\/api(.*)/);
    const path = pathMatch ? pathMatch[1] : req.nextUrl.pathname;
    const targetUrl = `${SPRING_BOOT_URL}${path}${req.nextUrl.search}`;

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const headers = new Headers(req.headers);
    headers.delete("host"); // Let the subrequest form its own host
    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    try {
        const res = await fetch(targetUrl, {
            method: req.method,
            headers,
            body: req.method !== "GET" && req.method !== "HEAD" ? await req.text() : undefined,
        });

        const responseHeaders = new Headers(res.headers);
        responseHeaders.delete("content-encoding");

        return new NextResponse(res.body, {
            status: res.status,
            headers: responseHeaders,
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Proxy error" }, { status: 500 });
    }
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
