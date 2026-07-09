import { NextResponse } from 'next/server';

const backend = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

type Context = {
  params: {
    path: string[];
  };
};

async function proxy(request: Request, context: Context) {
  const incomingUrl = new URL(request.url);
  const targetPath = context.params.path.join('/');
  const targetUrl = new URL(`/${targetPath}${incomingUrl.search}`, backend);

  try {
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: buildHeaders(request),
      body: ['GET', 'HEAD'].includes(request.method) ? undefined : await request.text(),
      cache: 'no-store',
    });

    const contentType = response.headers.get('content-type') || '';
    const body = contentType.includes('application/json') ? await response.json() : await response.text();

    return NextResponse.json(body, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'backend_unavailable',
        message: `Could not reach backend at ${backend}.`,
      },
      { status: 502 }
    );
  }
}

function buildHeaders(request: Request) {
  const headers = new Headers();
  const contentType = request.headers.get('content-type');
  const authorization = request.headers.get('authorization');

  if (contentType) headers.set('content-type', contentType);
  if (authorization) headers.set('authorization', authorization);

  return headers;
}

export async function GET(request: Request, context: Context) {
  return proxy(request, context);
}

export async function POST(request: Request, context: Context) {
  return proxy(request, context);
}

export async function PUT(request: Request, context: Context) {
  return proxy(request, context);
}

export async function DELETE(request: Request, context: Context) {
  return proxy(request, context);
}
