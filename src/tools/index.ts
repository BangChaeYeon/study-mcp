import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { QuestionSource } from "../sources/types.js";

const text = (t: string) => ({ content: [{ type: "text" as const, text: t }] });

/** 1단계 tool 등록. 핸들러 본문은 구현 예정. */
export function registerTools(server: McpServer, source: QuestionSource): void {
  server.registerTool(
    "get_question",
    {
      description: "문제 1개 조회 (주제 필터 / 랜덤 / ID 지정)",
      inputSchema: { topic: z.string().optional(), id: z.string().optional() },
    },
    async ({ topic, id }) => {
      const q = await source.get({ topic, id });
      return text(q ? JSON.stringify(q) : "조건에 맞는 문제가 없습니다.");
    },
  );

  server.registerTool(
    "submit_answer",
    {
      description: "정답 판정 + 풀이 기록 저장",
      inputSchema: { id: z.string(), choice: z.string() },
    },
    async () => text("TODO: submit_answer"),
  );

  server.registerTool(
    "get_explanation",
    {
      description: "해설 조회",
      inputSchema: { id: z.string() },
    },
    async () => text("TODO: get_explanation"),
  );
}
