import { signatureArrival } from "@/lib/signature";
import { signatureDependencies } from "@/lib/signature-store";

export const runtime = "nodejs";
export const maxDuration = 10;

export async function POST(request: Request) {
  return signatureArrival(request, signatureDependencies());
}
