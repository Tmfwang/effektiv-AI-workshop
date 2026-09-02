import { proxyQuiz } from "@/lib/api-server";

export const dynamic = "force-dynamic";

export async function GET() {
  return proxyQuiz();
}
