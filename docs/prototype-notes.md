# Candy Sort Factory – Prototype notes (v39)

## Đơn hàng xe tải (v39)
- Từ L3 mỗi xe tải có **đơn hàng 4 màu**: ô màu trên sàn xe (ô `?` = màu nào cũng được), chip **NEXT** dưới nút ⚙️ cho biết đơn của xe kế tiếp.
- Box tới cuối line: đúng màu xe cần → xe tự chạy tới/lui cho ô đó khớp piston rồi đẩy vào; sai màu → chạy tiếp lên **băng chờ 3 chỗ** (staging) sau cuối line, mỗi chỗ có piston riêng, đẩy lên xe khi xe cần màu đó.
- Băng chờ đầy + box đầu line sai màu + không box nào trên băng chờ hợp → sau 2.2 giây **xe rời đi khi chưa đầy** (−1 ★), các đơn còn lại được xếp lại ưu tiên màu đang chờ → không bao giờ kẹt cứng.
- Độ khó (`order`): L1–2 = 0 (không đơn), L3–4, L6 = 1 (theo thứ tự lời giải, 2 ô `?`), L5, L7–9 = 2 (xáo ±3, 1 ô `?`), L10 = 3 (xáo ±6, không `?`). Đơn hàng được kiểm tra chắc chắn chạy được với băng chờ ≤2 chỗ theo lời giải.
- Bot đi theo lời giải: thắng 100% (4/4 mỗi màn, cả 2 theme). Bot tham lam đã biết ưu tiên màu xe cần: L1–2 4/4 · L3 3/4 · L4 2/4 · L5 4/4 · L6 2/4 · L7 2/4 · L8 0/4 · L9 0/4 · L10 1/4 (thua ở L8–10 do kẹt trên board, không phải do bến xe).
- Cầu trục thứ 2 trong theme Factory dời xuống z=10.6 để không che băng chờ.

## Dev setup (git + VS Code)
Project trên máy người dùng: `C:\Users\VNG\Documents\CandySortFactory` (Windows). Cấu trúc: `src/themes/factory.html` + `src/themes/candy.html` (template có `/*THREE*/`), `src/launcher.html` (menu theme, placeholder `/*THREE_SRC*/ /*TPL_INDUSTRIAL*/ /*TPL_CANDY*/`), `vendor/three.min.js` (r128), `scripts/build.mjs` (Node, `npm run build` → `dist/candy_sort_factory.html`, `dist/factory.html`, `dist/candy.html`), `tests/smoke.mjs` (Playwright, tuỳ chọn), `docs/prototype-notes.md`. Cấu hình VS Code nằm trong `CandySortFactory.code-workspace` (settings, task Build = Ctrl+Shift+B, launch Edge/Chrome debug, extension khuyên dùng) vì công cụ từ xa không được ghi vào `.vscode/` hay `.git/`. Git: người dùng chạy `setup-git.cmd` 1 lần (init nhánh main, commit đầu, tag v38); `dist/` bị gitignore.

File: **candy_sort_factory.html** (v38) – launcher 1 file, Three.js r128 nhúng 1 lần, low-poly, portrait 9:19.5.
- Theme chính / mặc định: **🏭 Nhà máy** (thép, bê tông, băng cao su, thùng carton + băng keo, piston, xe tải).
  - v37 – **trong nhà xưởng** (trước nhìn như ngoài trời): nền tối + sương, ánh sáng trần (hemi lạnh, đèn chính ấm), sàn bê tông mài bóng có ron cắt, bỏ vạch đứt của đường ô tô → bến xếp hàng trong nhà (sàn epoxy tối, 2 vạch dẫn liền, cao su chắn bến), tường tôn sóng 2 bên + cột thép chữ I + dầm cao, máng cáp + ống chạy dọc tường, 2 cầu trục (gantry) xanh vắt ngang bến xe, đèn treo nhà xưởng (chao + kính sáng + quầng trên trần + nón sáng + vũng sáng trên sàn), vũng sáng lớn trên sàn chính, bụi bay trong vùng sáng, lối đi bộ sơn xanh bên trái, cửa cuốn ở đầu bến.
- Theme phụ: **🍬 Xưởng kẹo** (v28). (v30–v31 từng thêm Halloween / Tết / Mỏ đá quý → đã bỏ ở v32 theo yêu cầu; script derive.py + themes_v2.py + build_5themes.py vẫn còn trong workspace nếu cần lại.)
- Menu chọn theme: nút "🎨 Theme: … · Đổi" ở màn bắt đầu + nút 🎨 trên HUD. Đổi theme giữa màn → load lại đúng level đang chơi và vào chơi luôn.
- Kỹ thuật: mỗi theme là 1 bản game đầy đủ (source game_factory.html / game_candy.html), launcher nạp bản được chọn vào iframe (srcdoc) + inject window.__START {level, play}; game gửi postMessage {csf:'menu'} để mở menu. Build: build.py (cũng xuất build_industrial.html / build_candy.html chạy riêng). Sửa gameplay thì phải sửa cả 2 source.

## Bố cục
Silo kẹo (trên, **chạy vượt mép trên màn hình**) → vòng băng chuyền → **4 làn × tối đa 6 box** hàng chờ → **tấm booster ở đáy**. Line đóng gói + xe tải ở cột bên phải (box đầy rời vòng, xuống line dọc bên phải, piston đẩy ngang sang xe trong hố bến). Đã thử và bỏ bố cục line/xe dưới đáy (v13).

## Board rộng hơn (v20 → v21: thêm 1 cột mỗi bên)
- Vòng băng dài hơn (đoạn thẳng LL 3.75), line đóng gói + hố xe dời sang phải (TX 5.6, RX 6.95), camera khung lại.
- Khung tối đa 14 cột (vừa tầm với của vòng băng).

## 10 level đầu (v38 – board nhỏ lại, độ khó chỉnh theo bot)
Số box = cột×hàng/4, chia đều 4 làn → box mỗi làn = cột×hàng/16. Mẫu: band = lớp ngang · split = khối trái/phải · ring = khung lồng · diag = sọc chéo.
| # | Board | Màu | Mẫu | Box (mỗi làn) | Bot tham lam thắng |
|---|---|---|---|---|---|
| 1 | 8×8 | 2 | band – tutorial | 16 (4) | 6/6 |
| 2 | 8×10 | 2 | split | 20 (5) | 5/6 |
| 3 | 10×10 | 3 | band | 25 (~6) | 6/6 |
| 4 | 10×12 | 3 | ring | 30 (~8) | 6/6 |
| 5 | 10×12 | 3 | band | 30 (~8) | 5/6 |
| 6 | 12×12 | 4 | ring | 36 (9) | 4/6 |
| 7 | 12×12 | 3 | diag | 36 (9) | 4/6 |
| 8 | 12×14 | 4 | split | 42 (~11) | 3/6 |
| 9 | 14×14 | 5 | ring | 49 (~12) | 4/6 |
| 10 | 14×16 | 4 | diag – boss | 56 (14) | 2/6 |
Mọi level: bot đi đúng lời giải thắng 6/6. Nhận xét: ring dễ nhất, diag/split khó nhất; split 3 màu ở L5 quá khó (2/6) nên đổi sang band; L10 5 màu = 0/6 nên giảm còn 4 màu.

## Silo không giới hạn trong khung nhìn (v19)
- Camera chỉ khung **9 hàng kẹo dưới cùng** (VIS_ROWS=9); máng + kính + khung thép kéo dài lên trên, ra khỏi mép trên màn hình → người chơi không thấy đỉnh board. Kẹo phía trên trượt dần vào khi kẹo dưới được hút.

## Booster + HUD (v34 – toàn bộ UI tiếng Anh)
- Thanh booster: 🦾 **Grab** ×2 · 🔀 **Shuffle** ×2 · ➕ **Add Slot** ×1 · 🧲 **Magnet** ×2.
- **Grab (v35 = cần cẩu gắp):** cáp thả từ trên xuống, đầu gắp 4 ngón móc (hub cam, đèn cam/xanh). Mở rộng ngón → hạ xuống vùng 3×3 → khép ngón, kẹo phù hợp gom vào lòng gắp → nhấc lên → bay tới từng box đầu làn, hạ xuống, hé ngón thả kẹo rơi vào từng ô → box đầy bay lên line → cáp kéo gắp lên trên.
- Cách chọn: bấm booster (nút sáng) → chạm lên board để chọn **vùng 3×3** quanh ô đó (tự kẹp trong biên board). Kẹo trong vùng trùng màu với box đầu làn (còn slot) được vòi hút gom lên rồi nhả vào các box đầu làn; box nào đủ 4 bay thẳng lên line đóng gói, box chưa đủ ở lại làn với số kẹo đã có (gửi lên băng vẫn hút tiếp). Vùng không có kẹo phù hợp → báo, không trừ lượt, vẫn ở chế độ chọn. Bấm lại nút để huỷ.
- **Magnet (v36 = cần cẩu nam châm điện):** chọn 1 box (kệ hoặc băng) → nam châm thả xuống (bám theo box nếu đang chạy), bật điện (cuộn dây sáng xanh + vùng từ trường) → box bật dính lên dưới nam châm, rời kệ/băng → nhấc lên, kẹo cùng màu còn thiếu rung lên, bật khỏi máng, bay vòng cung vào từng ô → nam châm mang box tới đầu line, xoay đúng hướng, hạ xuống, ngắt điện thả box → cáp kéo lên.
- **Shuffle (v36 = băng chạy ngược qua máy xáo):** 4 băng làn chạy lùi, mọi box lăn xuống chui vào cửa dưới tấm booster → tấm booster rung, cửa làn sáng xanh, khói → box theo thứ tự mới chạy lên lại từ cửa, hàng đầu ra trước. Box đã có kẹo giữ nguyên màu.
- **Add Slot (v36 = lắp module):** tay gắp hạ cụm đèn thứ 6 xuống đảo giữa vòng băng, thả ra, 4 con ốc xoay xuống kèm tia lửa, đèn nháy 3 lần rồi bật → sức chứa 6.
- Điểm thả đầu line có khoá (dropResv) để tay robot và box bay không thả chồng.
- **Tăng tốc** = nút bật/tắt ⏩ x1/x2 góc trên trái. Góc trên phải: LEVEL + ⚙️ **Settings** (50px). Modal Settings (tạm dừng game): Sound, Vibration, Slow motion, Theme (chỉ khi trong launcher), Restart level, Resume.
- Toast dời xuống top 112px để không bị HUD che.
- Ngôn ngữ: toàn bộ chữ trong game + launcher đã chuyển sang tiếng Anh (Factory / Candy Workshop).

## Tấm booster + nguồn box
- Mép trên tấm nằm ngay dưới hàng box thứ 6; 4 cửa ra thẳng hàng 4 làn, box mới trồi lên từ dưới tấm. Không hiện số box còn chờ (đã bỏ nhãn ▲ +N ở v22). Đã bỏ toast thông tin đầu màn (kẹo · box) ở v23; chỉ L1 còn toast hướng dẫn.
- 4 nút dàn đều lấp kín tấm (xem mục Booster + HUD).

## Tay robot gắp box đầy (v24)
- Sửa lỗi box đầy phải chạy thêm 1 vòng mới ra (cũ: chỉ rẽ ra ở giữa khúc cua phải và chỉ khi đầu line trống).
- Tay robot cam 2 khớp (đế xoay + vai + khuỷu + cổ tay, kẹp 2 ngón) đặt trên đảo giữa vòng băng, đầu phải. Ngay khi box đủ 4 kẹo (đã rơi xong) và nằm trong tầm với (~2.25 quanh đế, phủ nửa phải đoạn dưới silo + khúc cua + đầu đoạn về), tay vươn theo box đang chạy, kẹp, nhấc, xoay box về hướng line rồi đặt xuống đầu line đóng gói. Nếu đầu line chưa trống thì tay giữ box lơ lửng phía trên chờ.
- Đã bỏ đoạn băng nối từ vòng sang line; line đóng gói bắt đầu ngay dưới điểm thả.
- Đèn trên đế: xanh = rảnh, cam = đang gắp.

## Xe tải
Không có cổng (đã bỏ ở v21). Xe mới chạy lên từ dưới tấm booster vào đậu; xe đầy chạy thẳng lên phía trên.

## HUD (v21)
Chỉ còn pill **LEVEL** ở góc trên phải (đè lên đường xe, không che board) + 3 nút 🔊 🐢 ↻ xếp dọc bên dưới. Đã bỏ ★ điểm, 📦 box còn lại, Băng n/N.

## Game feel
Âm thanh WebAudio + rung (nút 🔊); phản hồi bấm được/không được; viền sáng quanh box đầu làn có màu đang lộ, kẹo hàng ngoài cùng to + nhún; băng theo vùng tốc độ (chậm dưới silo, nhanh 1.75x đoạn về). Không có phần thưởng khi có kẹo.

## Theme: xưởng kẹo cổ tích (v25, thay theme nhà máy công nghiệp)
- Bước 1 – màu/chất liệu: nền trời hồng kem + sương nhẹ; sàn caro hồng–bạc hà; khu sơn pastel (xanh baby, đào, oải hương, bạc hà); thép → đồng thau/đồng đỏ/vàng; sơn → bạc hà, hồng, đỏ cherry; ánh nắng vàng ấm.
- Bước 2 – re-skin bộ phận: silo = hũ kẹo (nền hồng, khung + vành đáy vàng, chân kẹo gậy), đèn van = kẹo mút xoắn (vẫn đỏ/xanh khi chặn/nhả); băng vòng = bánh quế, ray sọc kẹo gậy đỏ/bạc hà, nan socola, trống donut phủ kem rắc cốm ở đầu trái; làn hàng chờ = băng bánh quế, ray kẹo gậy, bộ nâng lò xo + đệm marshmallow; tay robot hồng khớp đồng; box = hộp quà chấm bi, ruy băng satin thay băng keo, nơ thay sticker; piston = găng tay đấm trên lò xo; xe tải = tàu kẹo (đầu máy bạc hà + toa hồng, bánh đỏ, ống khói kẹo gậy, mái che sọc), hố xe = đường ray tà vẹt bánh quế; ống kẹo gậy + bánh răng cookie chip socola; còi tàu thay còi xe.
- v26: **sông socola** chảy dưới hũ kẹo + quanh vòng băng (trái→phải) và một nhánh chạy dọc bên trái kệ box xuống đáy màn hình (texture xoáy socola sữa/đen, bóng, chảy chậm), bờ kem tươi; đường ray = tà vẹt bánh quế dày (mặt ô vuông nổi, cạnh nhiều lớp kem) trên nền vụn socola, ray vàng; texture rõ hơn: bánh quế nổi khối (băng vòng + băng làn), sàn kệ = bánh quy lỗ, sàn đóng gói = kem oải hương rắc cốm, đảo giữa = kem hồng rắc cốm to, nan socola bóng, kẹo gậy có vệt bóng, hộp quà chấm bi đậm; bật anisotropy cho texture. Bỏ ống kẹo gậy bên trái kệ (nằm trên sông).
- v27: dòng chảy rõ: sửa lỗi sông/donut chỉ chạy trong chế độ test (giờ updateDecor chạy mỗi frame); sông 2 lớp (nền xoáy + lớp vệt sáng chảy nhanh gấp ~1.9), tốc độ FLOW 0.55; kẹo marshmallow (trắng/hồng/bạc hà) trôi theo dòng: sang trái dưới hũ kẹo rồi xuôi xuống nhánh trái; bong bóng socola phồng lên rồi vỡ bắn giọt.
- v28: giảm độ chói: ánh sáng hemi 0.56 / nắng 0.64, nền + sương 0xdcbfcc, gạch caro đậm hơn (#e6b5c8 / #b5dccb), nền hũ kẹo 0xefc6d6, màu kem 0xf0dcc5, nút booster bớt trắng.
- UI chỉnh nhẹ cho hợp: tấm booster socola viền vàng + dải sọc hồng, nút kem hồng, card/toast socola.
- Chưa làm (bước 3–4): cây kẹo mút/nấm kẹo dẻo/sông socola, ống kính dẫn kẹo, âm thanh hộp nhạc, co giãn nảy nhiều hơn, bo tròn khối (r128 không có RoundedBox).

## Luật
Box xoay theo khúc cua; box đầy được tay robot gắp ra line. Mỗi box lướt 1 lần là đủ 4 kẹo. Tối đa 5 box trong hệ thống (6 nếu dùng booster); đầy + tất cả chạy hết 1 vòng không hút được → thua.

## Test
Hook `G.turbo(giây, autoplay)` chạy mô phỏng nhanh không render; `G.dbg()` in trạng thái board/băng; `G.turbo(s,'seq')` chơi theo đúng lời giải để kiểm tra level giải được. Bot auto đôi khi tự kẹt do chọn box sai thứ tự (không phải lỗi game).

## Còn trong danh sách audit (chưa làm)
6 cảnh báo sắp thua mạnh hơn · 7 đèn chờ trên mâm nâng · 8 thanh tiến độ màn · 9 màn thắng có pháo giấy/sao lần lượt · 10 xáo kệ bay đổi chỗ · 11 rung camera · 12 chuyển động nền · 13 gộp mesh/giới hạn pixel ratio cho FPS.
