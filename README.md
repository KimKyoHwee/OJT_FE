# Batch Job Management System

배치 작업을 관리하고 모니터링하기 위한 웹 기반 대시보드 애플리케이션입니다.

## 기능

- 배치 작업 목록 조회 및 관리
- 실시간 작업 상태 모니터링
- 작업 즉시 실행 기능
- 통계 대시보드 (전체 작업 수, 실행 중인 작업, 성공률, 평균 응답 시간)
- 자동 데이터 갱신 (5초 간격)

## 기술 스택

- **Frontend**: Next.js 14, React 18, TypeScript
- **상태 관리**: TanStack Query (React Query)
- **스타일링**: Tailwind CSS
- **HTTP 클라이언트**: Axios
- **백엔드**: Spring Boot (8080 포트)

## 프로젝트 구조

```
src/
├── app/
│   └── page.tsx           # 메인 페이지 (Next.js App Router 진입점)
│
├── components/
│   ├── JobList.tsx        # 작업 목록 테이블 컴포넌트
│   └── JobStats.tsx       # 통계 대시보드 컴포넌트
│
├── services/
│   └── jobService.ts      # API 통신 서비스
│
└── types/
    └── job.ts            # TypeScript 타입 정의
```

### 주요 컴포넌트 설명

#### JobList.tsx
- 배치 작업 목록을 테이블 형태로 표시
- 각 작업의 상태, 스케줄, 실행 시간 정보 제공
- 작업 실행 및 삭제 기능

#### JobStats.tsx
- 전체 작업 통계를 카드 형태로 표시
- 실시간 데이터 갱신
- 주요 지표 시각화

#### jobService.ts
- Spring 백엔드와 통신하는 API 클라이언트
- RESTful API 호출 처리
- 타입 안정성이 보장된 응답 처리

## 설치 및 실행

1. 의존성 설치
```bash
npm install
```

2. 개발 모드 실행
```bash
npm run dev
```

3. 프로덕션 빌드
```bash
npm run build
npm start
```

## API 엔드포인트

기본 URL: `http://localhost:8080/api`

### 작업 관리
- `GET /jobs` - 전체 작업 목록 조회
- `GET /jobs/stats` - 작업 통계 조회
- `POST /jobs` - 새 작업 생성
- `POST /jobs/:id/run` - 작업 즉시 실행
- `PATCH /jobs/:id/status` - 작업 상태 업데이트
- `DELETE /jobs/:id` - 작업 삭제

## 환경 설정

### 환경 변수
- `NEXT_PUBLIC_API_URL`: API 서버 주소 (기본값: http://localhost:8080/api)

### TypeScript 설정
- Path Alias: `@/*` → `src/*`
- ESModule Interop 활성화
- React JSX 지원

## 라이선스

MIT License 