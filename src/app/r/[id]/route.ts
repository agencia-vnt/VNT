import { signatureRedirect } from "@/lib/signature";
import { signatureDependencies } from "@/lib/signature-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 10;

type Context = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: Context) {
  const { id } = await params;
  return signatureRedirect(request, id, signatureDependencies());
}

export async function HEAD(request: Request, context: Context) {
  return GET(request, context);
}
