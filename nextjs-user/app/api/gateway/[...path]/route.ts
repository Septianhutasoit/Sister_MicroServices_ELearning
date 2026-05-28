import { NextRequest, NextResponse } from 'next/server';

// Mapping route prefix → backend service port & host
// Sesuai arsitektur distributed, hubungkan notifications langsung ke Laptop 1 (10.206.80.189:8080)
const SERVICE_MAP: Record<string, { port: number; stripPrefix: boolean; host?: string }> = {
    'auth':          { port: 3001, stripPrefix: true },                                          // /auth/login -> localhost:3001/login
    'courses':       { port: 3002, stripPrefix: false },                                         // /courses    -> localhost:3002/courses
    'enroll':        { port: 3002, stripPrefix: false },                                         // /enroll     -> localhost:3002/enroll
    'enrollments':   { port: 3002, stripPrefix: false },                                         // /enrollments -> localhost:3002/enrollments
    'notifications': { port: 8080, stripPrefix: false, host: '10.206.80.189' },                  // /notifications -> 10.206.80.189:8080/notifications
    'exams':         { port: 3004, stripPrefix: true },                                          // /exams      -> localhost:3004
};

async function proxyRequest(request: NextRequest, params: { path: string[] }) {
    const pathParts = params.path;
    const serviceKey = pathParts[0]; // e.g. "auth", "courses", "notifications"
    const service = SERVICE_MAP[serviceKey];

    if (!service) {
        return NextResponse.json(
            { status: 'error', message: `Service '${serviceKey}' tidak ditemukan` },
            { status: 404 }
        );
    }

    // Bangun target URL
    let targetPath: string;
    if (service.stripPrefix) {
        targetPath = pathParts.slice(1).join('/');
    } else {
        targetPath = pathParts.join('/');
    }

    const host = service.host || 'localhost';
    const targetUrl = `http://${host}:${service.port}/${targetPath}`;
    console.log(`[Proxy] ${request.method} → ${targetUrl}`);

    try {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        const authHeader = request.headers.get('Authorization');
        if (authHeader) {
            headers['Authorization'] = authHeader;
        }

        const fetchOptions: RequestInit = {
            method: request.method,
            headers,
        };

        if (request.method === 'POST' || request.method === 'PUT' || request.method === 'PATCH') {
            try {
                const body = await request.json();
                fetchOptions.body = JSON.stringify(body);
            } catch {
                // Body kosong
            }
        }

        const response = await fetch(targetUrl, fetchOptions);
        const contentType = response.headers.get('content-type') || '';
        
        if (contentType.includes('application/json')) {
            const data = await response.json();
            return NextResponse.json(data, { status: response.status });
        } else {
            const text = await response.text();
            return new NextResponse(text, { status: response.status });
        }
    } catch (error: any) {
        console.error(`[Proxy Error] ${targetUrl}:`, error.message);
        return NextResponse.json(
            { status: 'error', message: `Gagal menghubungi ${serviceKey}-service (${host}:${service.port}): ${error.message}` },
            { status: 502 }
        );
    }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    return proxyRequest(request, await params);
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    return proxyRequest(request, await params);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    return proxyRequest(request, await params);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    return proxyRequest(request, await params);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    return proxyRequest(request, await params);
}
