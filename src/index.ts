import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { GoogleSheetsSource } from "./sources/googleSheets.js";
import { registerTools } from "./tools/index.js";

async function main() {
  const server = new McpServer({ name: "study-mcp", version: "0.1.0" });

  // TODO: 환경변수/설정 파일에서 읽기 (3단계: study.config.yaml)
  const source = new GoogleSheetsSource({
    sheetId: process.env.SHEET_ID ?? "",
    sheetName: process.env.SHEET_NAME ?? "Sheet1",
  });

  registerTools(server, source);
  // TODO(2단계): resources / prompts 등록

  await server.connect(new StdioServerTransport());
  // stdio 서버이므로 stdout은 프로토콜 전용 — 로그는 stderr로
  console.error("study-mcp running on stdio");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
