# quiet-ui-registry

무채색 위주의 절제된 UI를 다른 프로젝트에 `npx shadcn add`로 설치하기 위한 shadcn 커스텀 레지스트리입니다.

## 디자인 특징

- **팔레트**: shadcn `new-york` / neutral 기반의 무채색(oklch, 라이트·다크)
- **editorial 보조 토큰**: 색은 거의 쓰지 않고, 호버할 때만 파란 강조색이 드러납니다
  - `foreground-subtle` (`text-foreground-subtle`): 옅은 본문 보조색
  - `surface-hover` (`bg-surface-hover`): 선택·호버 배경
  - `accent-hover` (`text-accent-hover`): 호버 강조색(파랑)
- **폰트**: Pretendard Variable (npm `pretendard` 패키지로 설치, 폰트 파일은 앱 번들에 포함)
- **라운드**: `--radius: 0.625rem`
- **기타**: Tailwind v4가 없앤 버튼 `cursor: pointer` 복원

## 구성

| 이름 | 종류 | 내용 |
| --- | --- | --- |
| `theme` | theme | 색 토큰, 폰트, base 스타일 |
| `utils` | lib | `cn()` |
| `button` `badge` `card` `dialog` `input` `label` `select` `switch` `table` `textarea` `tooltip` | ui | 컴포넌트 |
| `help-tip` | component | 필드명에 점선 밑줄을 긋고 설명 툴팁을 띄움. 앱 루트에 `TooltipProvider` 필요 |

컴포넌트끼리의 의존성(예: `dialog` → `button`)과 npm 의존성(radix-ui, lucide-react 등)은 함께 설치됩니다.

## 다른 프로젝트에서 쓰기

전제: React + Tailwind v4 + tsconfig 경로 별칭(`@/*`)이 설정된 프로젝트.

1. 프로젝트 루트에 `components.json`을 둡니다(`npx shadcn@4.21.0 init`으로 만들거나 직접 작성). `registries`에 이 레지스트리 주소를 추가합니다.

   ```json
   {
     "registries": {
       "@quiet": "https://raw.githubusercontent.com/yeneua/quiet-ui-registry/main/r/{name}.json"
     }
   }
   ```

   저장소가 비공개라면 토큰 헤더를 함께 넘깁니다(`GITHUB_TOKEN` 환경변수에 `repo` 읽기 권한이 있는 토큰).

   ```json
   {
     "registries": {
       "@quiet": {
         "url": "https://raw.githubusercontent.com/yeneua/quiet-ui-registry/main/r/{name}.json",
         "headers": { "Authorization": "token ${GITHUB_TOKEN}" }
       }
     }
   }
   ```

2. 테마와 필요한 컴포넌트를 설치합니다.

   ```bash
   npx shadcn@4.21.0 add @quiet/theme @quiet/button @quiet/dialog @quiet/help-tip
   ```

   - `theme`은 프로젝트 CSS 파일(`components.json`의 `tailwind.css`)에 토큰과 Pretendard `@import`를 추가합니다.
   - 컴포넌트 안의 import(`@/shared/ui/...`, `@/shared/lib/utils`)는 설치하는 프로젝트의 `aliases` 설정에 맞게 자동으로 바뀝니다.
   - 설치된 파일은 그 프로젝트 소유이므로 자유롭게 고쳐 써도 됩니다.

## 레지스트리 관리

```bash
npm install
```

```bash
npm run build
```

`registry.json`과 `src/`를 읽어 `r/*.json`을 만듭니다. 소스를 고친 뒤에는 꼭 다시 빌드하세요.

```bash
npm run serve
```

`r/`를 `http://localhost:4873/r/{name}.json`으로 서빙합니다. push 전에 로컬에서 확인할 때 씁니다(`"@quiet": "http://localhost:4873/r/{name}.json"`).

빌드한 뒤 `r/`까지 커밋하고 push해야 다른 프로젝트에 반영됩니다. raw URL은 몇 분 동안 캐시되므로, push 직후에는 예전 내용이 받아질 수 있습니다.

### admin 디자인이 바뀌었을 때

`src/shared/`는 admin의 `src/shared/` 경로 구조를 그대로 따릅니다. admin에서 컴포넌트나 토큰을 고쳤다면

1. 해당 파일을 이 폴더의 같은 경로로 복사합니다.
2. `src/index.css`의 토큰을 고쳤다면 `registry.json`의 `theme` → `cssVars`에도 똑같이 반영합니다.
3. 새 컴포넌트는 `registry.json`의 `items`에 항목을 추가합니다.
4. `npm run build`로 다시 빌드합니다.

저장소 주소나 이름이 바뀌면 `registry.json`의 `homepage`와 위 `registries` 예시의 URL도 함께 바꿔주세요.

### shadcn CLI 버전

CLI는 `4.21.0`으로 고정해 두었습니다. 이 버전으로 빌드와 설치를 검증했습니다.
