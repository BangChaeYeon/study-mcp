# study-mcp

> 정리한 문제은행을 Claude가 튜터처럼 활용하게 해주는 **범용 학습 MCP 서버**

구글 시트·노션 DB·CSV 등에 정리해 둔 문제/정답/해설을 MCP 서버가 읽어오고,
풀이 기록을 바탕으로 **간격 반복(Spaced Repetition)** 복습 스케줄과 약점 분석을 제공합니다.
Claude는 이 도구들을 이용해 문제를 출제하고, 채점 결과를 바탕으로 해설·개념 설명을 해주는 튜터 역할을 합니다.

자격증 기출, 전공 시험 문제, 단어장 등 **문제/정답 형태로 정리된 데이터라면 무엇이든** 설정만으로 연결할 수 있는 것을 목표로 합니다.

---

## 개발 사유

- 문제를 시트에 정리해 두어도, 막상 "오늘 뭘 풀지 / 어디가 약한지"는 직접 관리해야 했음
- LLM에게 채점까지 맡기면 가끔 틀리게 판정함 → **정확해야 하는 부분은 서버, 유연해야 하는 부분은 Claude**로 역할 분리
- MCP의 tools / resources / prompts 를 모두 직접 설계해 보는 학습 목적

## 역할 분리

| 구분 | MCP 서버 | Claude |
|---|---|---|
| 담당 | 데이터 조회, 정답 판정, 풀이 기록, 복습 스케줄 계산 | 출제, 해설 풀이, 응용 질문, 학습 계획 제안 |
| 성격 | 결정적(deterministic), 정확성 | 대화형, 유연성 |

## 사용 예시

```
나: 오늘 복습할 거 있어?
Claude → get_due_reviews()            → 네트워크 3문제, 데이터베이스 2문제
Claude → get_question("q_142")        → 문제 표시
나: B
Claude → submit_answer("q_142", "B")  → 오답 / 정답 C / 다음 복습: 내일
Claude: (해설을 바탕으로) B가 아니라 C인 이유는...
```

---

## 기능 (MCP 인터페이스)

### Tools
| 이름 | 설명 | 단계 |
|---|---|---|
| `get_question(topic?, id?)` | 문제 1개 조회 (주제 필터 / 랜덤 / ID 지정) | 1 |
| `submit_answer(id, choice)` | 정답 판정 + 풀이 기록 저장 | 1 |
| `get_explanation(id)` | 해설 조회 | 1 |
| `get_due_reviews(limit?)` | 오늘 복습할 문제 목록 (SM-2 기반) | 2 |
| `get_weak_topics()` | 주제별 정답률 집계, 약한 주제 순 정렬 | 2 |
| `list_topics()` | 문제은행의 주제 목록 | 2 |

### Resources
| URI | 설명 | 단계 |
|---|---|---|
| `study://stats` | 전체 학습 통계 (푼 문제 수, 정답률, 연속 학습일) | 2 |
| `study://topics/{topic}` | 주제별 통계 | 2 |

### Prompts
| 이름 | 설명 | 단계 |
|---|---|---|
| `mock_exam` | 모의고사 모드 (N문제 연속 출제, 마지막에 일괄 채점) | 2 |
| `review_mistakes` | 오답 복습 모드 | 2 |

---

## 로드맵

- [ ] **1단계 — MVP**
  - 구글 시트 하나를 데이터 소스로 사용
  - `get_question` / `submit_answer` / `get_explanation`
  - 오답 횟수를 시트에 기록
  - 샘플 문제은행(`examples/sample.csv`) 제공
  - Claude Desktop에 연결해서 실사용
- [ ] **2단계 — 학습 기능**
  - SM-2 알고리즘으로 복습 스케줄 계산
  - 약점 분석, resources / prompts 추가
  - 풀이 기록 저장소 분리 (로컬 JSON 또는 SQLite)
- [ ] **3단계 — 범용화**
  - 데이터 소스 어댑터 구조 (Google Sheets / Notion / CSV)
  - 설정 파일로 컬럼 매핑 → 다른 문제은행에도 적용 가능
  - 테스트, npm 배포 검토

---

## 설정 (3단계 목표)

```yaml
# study.config.yaml
source: google_sheets        # google_sheets | notion | csv
sheet_id: <SPREADSHEET_ID>
sheet_name: Sheet1
columns:
  id: 번호
  question: 문제
  choices: 문항
  answer: 정답
  explanation: 해설
  topic: 분류
```

## 기술 스택

- **Runtime**: Node.js + TypeScript
- **MCP**: `@modelcontextprotocol/sdk` (stdio transport)
- **Data**: `googleapis` (Google Sheets), `@notionhq/client` (예정)
- **Validation**: `zod` (tool 입력 스키마)
- **Storage**: 로컬 JSON → SQLite (예정)
- **Dev**: MCP Inspector로 tool 단위 테스트

## 디렉터리 구조 (예정)

```
src/
├── index.ts            # MCP 서버 엔트리, tool/resource/prompt 등록
├── tools/              # tool 핸들러
├── sources/            # 데이터 소스 어댑터
│   ├── types.ts        # QuestionSource 인터페이스
│   └── googleSheets.ts
├── scheduler/
│   └── sm2.ts          # 간격 반복 알고리즘
└── store/              # 풀이 기록 저장소
examples/
└── sample.csv          # 샘플 문제은행
```

---

## 실행 방법 (작성 예정)

```bash
npm install
npm run build
npx @modelcontextprotocol/inspector node dist/index.js   # 로컬 테스트
```

Claude Desktop 연결 설정은 구현 후 추가 예정.
