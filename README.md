# Candy Sort Factory

Prototype game giải đố 3D low-poly, màn hình dọc: tap box ở hàng chờ → box chạy trên vòng băng chuyền dưới silo kẹo, hút kẹo cùng màu → đầy 4 ô thì tay robot gắp ra dây chuyền đóng gói → lên xe tải.
Viết bằng Three.js r128, build ra **1 file HTML duy nhất** (mở thẳng bằng trình duyệt, không cần server).

## Cấu trúc thư mục

```
CandySortFactory/
├─ src/
│  ├─ themes/
│  │  ├─ factory.html     ← theme Factory (mặc định) – toàn bộ game: HTML + CSS + JS
│  │  └─ candy.html       ← theme Candy Workshop – cùng gameplay, khác hình ảnh
│  └─ launcher.html       ← trang bọc ngoài: menu chọn theme, nạp theme vào iframe
├─ vendor/three.min.js    ← Three.js r128 (MIT, xem three.LICENSE)
├─ scripts/build.mjs      ← build: ghép three.js + 2 theme vào dist/
├─ tests/smoke.mjs        ← (tuỳ chọn) bot tự chơi hết 10 level cả 2 theme
├─ docs/prototype-notes.md← ghi chú thiết kế, lịch sử phiên bản, bảng level
└─ dist/                  ← file build (không đưa vào git)
   ├─ candy_sort_factory.html  ← bản chính (có menu chọn theme)
   ├─ factory.html / candy.html← từng theme riêng
```

Trong mỗi file theme, chỗ `/*THREE*/` sẽ được thay bằng Three.js khi build. **Sửa gameplay thì sửa cả 2 file trong `src/themes/`** (gameplay giống nhau, chỉ khác phần hình ảnh/màu).

## Mở trong Visual Studio Code

1. VS Code → **File → Open Workspace from File…** → chọn `CandySortFactory.code-workspace`
   (file này chứa toàn bộ cấu hình: settings, task build, cấu hình chạy/debug, extension khuyên dùng).
2. VS Code hỏi *"Do you trust the authors…"* → **Yes, I trust**. Sau đó bấm **Install** ở thông báo extension khuyên dùng
   (Live Server, GitLens, Git Graph, EditorConfig) — hoặc tab Extensions → mục *Workspace Recommendations*.
3. Cần **Node.js 18+** để build (https://nodejs.org – bản LTS). Kiểm tra: mở Terminal trong VS Code (`Ctrl+\``) gõ `node -v`.

## Build & chạy

| Việc | Cách làm |
|---|---|
| Build | `Ctrl+Shift+B` (task **Build game**) hoặc `npm run build` |
| Build + mở game | `Ctrl+Shift+P` → *Tasks: Run Task* → **Build & open in browser** |
| Chạy có debug | tab **Run and Debug** (`Ctrl+Shift+D`) → **Play (Edge, debug)** → `F5` (đặt breakpoint trong `dist/…` hoặc dùng DevTools) |
| Live reload | build xong, chuột phải `dist/candy_sort_factory.html` → **Open with Live Server** |
| Test tự động (tuỳ chọn) | `npm i -D playwright` → `npx playwright install chromium` → `npm test` |

Hook test có sẵn trong game (gõ trong DevTools Console của từng theme): `G.play(level)`, `G.info()`, `G.turbo(giây, 'seq'|true)`.

## Làm việc với AI trong VS Code

Toàn bộ context của cuộc trao đổi thiết kế (game là gì, cấu trúc code, quy tắc sửa 2 theme, sở thích thiết kế, ý tưởng chưa làm)
nằm trong **`AGENTS.md`** — Claude Code (đọc qua `CLAUDE.md`), Codex và GitHub Copilot đều tự đọc file này khi mở project.
Lịch sử chi tiết các phiên bản: `docs/prototype-notes.md`. Khi đổi thiết kế, cập nhật 2 file này để AI lần sau nắm đúng.

## Git

Cần cài **Git for Windows**: https://git-scm.com/download/win (cài xong mở lại VS Code).

**Khởi tạo repo (làm 1 lần):** double-click `setup-git.cmd` trong thư mục project, hoặc trong Terminal của VS Code gõ `.\setup-git.cmd`.
Script sẽ hỏi tên/email nếu máy chưa cấu hình, rồi tạo repo nhánh `main`, commit đầu tiên và tag `v38`.

(Làm tay cũng được: tab Source Control → **Initialize Repository** → gõ message → **Commit**.)

Làm việc hằng ngày trong VS Code:

1. Sửa file → tab **Source Control** (`Ctrl+Shift+G`) hiện danh sách thay đổi (bấm vào file để xem diff).
2. Gõ message (vd `Tune level 5 difficulty`) → **Commit**.
3. Thử nghiệm lớn → tạo nhánh: bấm tên nhánh `main` ở góc dưới trái → **Create new branch…**
4. Xem lịch sử: extension **Git Graph** (biểu tượng ở thanh Source Control) hoặc **GitLens**.

Đưa lên GitHub / GitLab (khi muốn backup hoặc làm nhóm): tạo repo trống trên web → trong VS Code **Source Control → … → Remote → Add Remote** dán URL → **Publish Branch** / **Sync Changes**.

> `dist/` không nằm trong git: muốn chia sẻ game cho người khác thì build rồi gửi file `dist/candy_sort_factory.html`.
