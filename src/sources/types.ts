/** 문제은행의 문제 1개 (데이터 소스와 무관한 공통 형태) */
export interface Question {
  id: string;
  question: string;
  choices: string[];
  /** 정답 (선택지 문자 "A" 등 또는 선택지 텍스트) */
  answer: string;
  explanation?: string;
  topic?: string;
}

export interface QuestionFilter {
  id?: string;
  topic?: string;
}

/** 데이터 소스 어댑터 인터페이스 (Google Sheets / Notion / CSV ...) */
export interface QuestionSource {
  /** 전체 문제 로드 */
  list(): Promise<Question[]>;
  /** 조건에 맞는 문제 1개 (id 없으면 랜덤) */
  get(filter?: QuestionFilter): Promise<Question | undefined>;
  /** 오답 횟수 등 풀이 결과를 소스에 기록 (지원하는 소스만) */
  recordResult?(id: string, correct: boolean): Promise<void>;
}
