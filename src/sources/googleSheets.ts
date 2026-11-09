import type { Question, QuestionFilter, QuestionSource } from "./types.js";

export interface GoogleSheetsOptions {
  sheetId: string;
  sheetName: string;
}

/** TODO(1단계): googleapis로 시트 읽기 + 오답 횟수 기록 */
export class GoogleSheetsSource implements QuestionSource {
  constructor(private readonly options: GoogleSheetsOptions) {}

  async list(): Promise<Question[]> {
    throw new Error(`not implemented: sheet ${this.options.sheetId}`);
  }

  async get(_filter?: QuestionFilter): Promise<Question | undefined> {
    throw new Error("not implemented");
  }

  async recordResult(_id: string, _correct: boolean): Promise<void> {
    throw new Error("not implemented");
  }
}
