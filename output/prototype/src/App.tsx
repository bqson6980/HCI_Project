import { useState } from 'react'

type Screen = 'overview' | 'ticket' | 'floormap' | 'checkposition' | 'payment'

const SCREENS: { id: Screen; label: string; sub: string }[] = [
  { id: 'overview', label: '1. Tổng quan', sub: 'Công suất & Chỗ trống B1-B6' },
  { id: 'ticket', label: '2. Nhận thẻ', sub: 'Vào bãi & Ghi nhận xe' },
  { id: 'floormap', label: '3. Sơ đồ tầng B2', sub: 'Trực quan chỗ trống & Lối vào/ra' },
  { id: 'checkposition', label: '4. Tra cứu vị trí', sub: 'Check-position bằng thẻ' },
  { id: 'payment', label: '5. Thanh toán', sub: 'Luồng trả thẻ & Mở barie' },
]

type FloorStatus = 'full' | 'warn' | 'ok'

const FLOORS: { id: string; name: string; type: string; used: number; total: number; status: FloorStatus }[] = [
  { id: 'B1', name: 'Tầng B1', type: 'Xe máy', used: 300, total: 300, status: 'full' },
  { id: 'B2', name: 'Tầng B2', type: 'Xe máy', used: 245, total: 300, status: 'warn' },
  { id: 'B3', name: 'Tầng B3', type: 'Xe máy', used: 49, total: 300, status: 'ok' },
  { id: 'B4', name: 'Tầng B4', type: 'Xe máy', used: 300, total: 300, status: 'full' },
  { id: 'B5', name: 'Tầng B5', type: 'Xe máy', used: 102, total: 300, status: 'ok' },
  { id: 'B6', name: 'Tầng B6', type: 'Xe máy', used: 80, total: 300, status: 'ok' },
]

function statusBadge(status: FloorStatus) {
  if (status === 'full') return { label: 'ĐẦY', bg: 'bg-rose-500 text-white border-rose-600' }
  if (status === 'warn') return { label: 'GẦN ĐẦY', bg: 'bg-amber-400 text-amber-950 border-amber-500' }
  return { label: 'CÒN TRỐNG', bg: 'bg-emerald-500 text-white border-emerald-600' }
}

function statusBarBg(status: FloorStatus) {
  if (status === 'full') return 'bg-rose-500'
  if (status === 'warn') return 'bg-amber-400'
  return 'bg-emerald-500'
}

function ScreenFrame({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-xl backdrop-blur-md sm:p-7">
      <div className="mb-6 border-b border-slate-200 pb-4">
        {subtitle && (
          <span className="inline-block rounded-md bg-emerald-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-800">
            {subtitle}
          </span>
        )}
        <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
          {title}
        </h2>
      </div>
      {children}
    </section>
  )
}

/* =========================================================================
   1. TỔNG QUAN CHỖ TRỐNG (OVERVIEW SCREEN)
   ========================================================================= */
function OverviewScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const totalSlots = FLOORS.reduce((acc, f) => acc + f.total, 0)
  const totalUsed = FLOORS.reduce((acc, f) => acc + f.used, 0)
  const totalFree = totalSlots - totalUsed

  return (
    <ScreenFrame title="Tổng quan chỗ trống gửi xe (Hầm B1 - B6)">
      {/* Metric summary panel */}
      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Tổng sức chứa</p>
          <p className="mt-1 text-2xl font-extrabold text-slate-900">{totalSlots.toLocaleString()} <span className="text-sm font-normal text-slate-500">chỗ</span></p>
        </div>
        <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-rose-700">Đã sử dụng</p>
          <p className="mt-1 text-2xl font-extrabold text-rose-700">{totalUsed.toLocaleString()} <span className="text-sm font-normal text-rose-600">chỗ ({Math.round((totalUsed / totalSlots) * 100)}%)</span></p>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-emerald-700">Còn trống toàn bãi</p>
          <p className="mt-1 text-2xl font-extrabold text-emerald-700">{totalFree.toLocaleString()} <span className="text-sm font-normal text-emerald-600">chỗ khả dụng</span></p>
        </div>
      </div>

      {/* Floors list arranged from top to bottom */}
      <div className="flex flex-col gap-3">
        {FLOORS.map((f) => {
          const percent = Math.round((f.used / f.total) * 100)
          const available = f.total - f.used
          const badge = statusBadge(f.status)

          return (
            <div
              key={f.id}
              className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 sm:flex-row sm:items-center sm:justify-between"
            >
              {/* Floor Identifier */}
              <div className="flex items-center gap-3.5 min-w-[140px]">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-lg font-black text-white sm:h-14 sm:w-14 sm:text-xl">
                  {f.id}
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{f.name}</h3>
                  <p className="text-xs text-slate-500">{f.type}</p>
                </div>
              </div>

              {/* Progress & Occupancy Info */}
              <div className="flex-1 max-w-lg">
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">
                    Còn trống: <strong className="text-slate-900 font-bold">{available}</strong> / {f.total} chỗ
                  </span>
                  <span className="text-slate-500 font-medium">{percent}% đã dùng</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 border border-slate-200">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${statusBarBg(f.status)}`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center sm:justify-end min-w-[100px]">
                <span className={`rounded-full border px-3.5 py-1 text-xs font-extrabold ${badge.bg}`}>
                  {badge.label}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-6 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-semibold text-slate-700">
        <span className="flex items-center gap-2">
          <span className="h-3.5 w-3.5 rounded-full bg-emerald-500" /> Còn trống (Available)
        </span>
        <span className="flex items-center gap-2">
          <span className="h-3.5 w-3.5 rounded-full bg-amber-400" /> Gần đầy (&gt;80%)
        </span>
        <span className="flex items-center gap-2">
          <span className="h-3.5 w-3.5 rounded-full bg-rose-500" /> Đầy hẳn (100%)
        </span>
      </div>
    </ScreenFrame>
  )
}

/* =========================================================================
   2. NHẬN THẺ KHI GỬI XE (TICKET SCREEN)
   ========================================================================= */
function TicketScreen() {
  const [ticketIssued, setTicketIssued] = useState(false)

  return (
    <ScreenFrame title="Nhận thẻ khi gửi xe vào bãi" subtitle="Cổng vào / ANPR Camera tự động">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Nhận diện biển số tự động</span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Camera Active
            </span>
          </div>

          <div className="rounded-xl border border-slate-300 bg-white p-4 text-center shadow-inner">
            <p className="text-xs text-slate-500">Biển số phát hiện</p>
            <p className="mt-1 text-3xl font-extrabold tracking-wider text-slate-900" style={{ fontFamily: '"IBM Plex Mono", monospace' }}>
              52-F1 888.88
            </p>
            <p className="mt-2 text-xs font-medium text-slate-600">
              Thời gian vào: <span className="font-mono font-bold text-slate-900">19:45:23 - 18/08/2026</span>
            </p>
          </div>

          <div className="mt-4 overflow-hidden rounded-xl border border-slate-800 bg-slate-950 text-slate-200">
            <div className="flex items-center justify-between border-b border-slate-800 px-3 py-2 text-[11px] font-mono text-emerald-400">
              <span>CAM-ENTRY-GATE-01</span>
              <span>LIVE 1080P</span>
            </div>
            <div className="relative flex h-40 items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 p-4">
              <div className="rounded-lg border-2 border-emerald-400/80 bg-black/60 px-4 py-2 text-center backdrop-blur">
                <p className="text-xs font-mono text-emerald-300">ANPR MATCH 99.8%</p>
                <p className="text-xl font-bold font-mono text-white">52-F1 888.88</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5">
          <div>
            <h3 className="text-base font-bold text-slate-900">Bảng giá gửi xe theo khung giờ</h3>
            <p className="text-xs text-slate-500">Áp dụng cho xe máy & ô tô vãng lai</p>

            <div className="mt-4 divide-y divide-slate-100 rounded-xl border border-slate-200 bg-slate-50/50">
              {[
                ['Khung 0 - 4 giờ', '4.000 VNĐ'],
                ['Khung 4 - 12 giờ', '8.000 VNĐ'],
                ['Qua đêm (> 12 giờ)', '15.000 VNĐ'],
                ['Vé tháng cư dân', '120.000 VNĐ / tháng'],
              ].map(([time, fee]) => (
                <div key={time} className="flex items-center justify-between px-4 py-3 text-sm">
                  <span className="font-medium text-slate-700">{time}</span>
                  <span className="font-mono font-bold text-emerald-700">{fee}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6">
            {!ticketIssued ? (
              <button
                type="button"
                onClick={() => setTicketIssued(true)}
                className="w-full rounded-2xl bg-emerald-600 py-4 text-base font-extrabold text-white shadow-lg transition hover:bg-emerald-700 active:scale-95"
              >
                PRESS TO RECEIVE CARD / NHẤN NÚT LẤY THẺ
              </button>
            ) : (
              <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-center">
                <p className="text-base font-bold text-emerald-900">✅ THẺ ĐÃ PHÁT THÀNH CÔNG!</p>
                <p className="mt-1 text-xs text-emerald-700">Mã thẻ: <strong className="font-mono">P-8821</strong> | Vui lòng giữ thẻ cẩn thận & Mở cổng Barie.</p>
                <button
                  type="button"
                  onClick={() => setTicketIssued(false)}
                  className="mt-3 rounded-lg border border-emerald-600 px-3 py-1 text-xs font-bold text-emerald-800 hover:bg-emerald-100"
                >
                  Lấy thẻ mới (Reset demo)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </ScreenFrame>
  )
}

/* =========================================================================
   3. SƠ ĐỒ CHỖ TRỐNG TẦNG B2 (FLOOR MAP SCREEN)
   ========================================================================= */
/* =========================================================================
   3. SƠ ĐỒ CHỖ TRỐNG TẦNG B2 (FLOOR MAP SCREEN)
   ========================================================================= */
interface SubBlock {
  status: 'full' | 'available'
  available?: number
  total?: number
}

const ZONE_A_BLOCKS: SubBlock[][] = [
  [{ status: 'full' }, { status: 'full' }, { status: 'full' }],
  [{ status: 'full' }, { status: 'full' }, { status: 'available', available: 5, total: 20 }],
]

const ZONE_B_BLOCKS: SubBlock[][] = [
  [{ status: 'full' }, { status: 'full' }, { status: 'full' }],
  [{ status: 'available', available: 2, total: 20 }, { status: 'full' }, { status: 'full' }],
]

const ZONE_C_BLOCKS: SubBlock[][] = [
  [{ status: 'full' }, { status: 'full' }, { status: 'available', available: 2, total: 20 }],
  [{ status: 'available', available: 15, total: 20 }, { status: 'full' }, { status: 'full' }],
]

const ZONE_D_BLOCKS: SubBlock[][] = [
  [{ status: 'available', available: 4, total: 20 }, { status: 'full' }, { status: 'full' }],
  [{ status: 'available', available: 5, total: 20 }, { status: 'full' }, { status: 'available', available: 1, total: 20 }],
]

const ZONES_DATA = [
  { id: 'A', name: 'A', blocks: ZONE_A_BLOCKS },
  { id: 'B', name: 'B', blocks: ZONE_B_BLOCKS },
  { id: 'C', name: 'C', blocks: ZONE_C_BLOCKS },
  { id: 'D', name: 'D', blocks: ZONE_D_BLOCKS },
]

function ZoneCard({ name, blocks }: { name: string; blocks: SubBlock[][] }) {
  return (
    <div className="rounded-3xl border-2 border-slate-300 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-center text-3xl font-black text-slate-900">{name}</h3>
      <div className="grid gap-3">
        {blocks.map((row, rIdx) => (
          <div key={rIdx} className="grid grid-cols-3 gap-3">
            {row.map((block, cIdx) => {
              if (block.status === 'full') {
                return (
                  <div
                    key={cIdx}
                    className="flex h-16 sm:h-20 items-center justify-center rounded-2xl bg-rose-500 shadow-xs transition hover:opacity-90"
                    title="Khu vực đã đầy"
                  />
                )
              }
              return (
                <div
                  key={cIdx}
                  className="flex h-16 sm:h-20 items-center justify-center rounded-2xl bg-emerald-500 text-white font-extrabold text-lg sm:text-xl shadow-xs transition hover:opacity-90 font-mono"
                  title={`Còn trống: ${block.available}/${block.total}`}
                >
                  {block.available}/{block.total}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

function FloorMapScreen() {
  return (
    <ScreenFrame title="Sơ đồ chi tiết tầng B2">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md">
        {/* Floor Title Header */}
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
            TẦNG B2
          </h2>
          <p className="mt-1 text-xs text-slate-500 font-medium">Sơ đồ tổng quan phân khu A - B - C - D</p>
        </div>

        {/* 2x2 Zones Grid */}
        <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
          {ZONES_DATA.map((z) => (
            <ZoneCard key={z.id} name={z.name} blocks={z.blocks} />
          ))}
        </div>

        {/* Bottom Entrance & You are here Pin */}
        <div className="mt-8 flex flex-col items-center justify-center gap-1.5 pt-4">
          <div className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-2xl text-white shadow-md animate-bounce">
              ⬆
            </span>
            <span className="text-2xl">📍</span>
          </div>
          <span className="rounded-full bg-slate-900 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-white shadow-sm">
            You are here! (Vị trí của bạn)
          </span>
        </div>

        {/* Legend at bottom */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-6 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-semibold text-slate-700">
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 rounded-md bg-emerald-500" /> Còn trống (hiện số chỗ / tổng)
          </span>
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 rounded-md bg-rose-500" /> Đã đầy (Occupied)
          </span>
        </div>
      </div>
    </ScreenFrame>
  )
}

/* =========================================================================
   4. TRA CỨU VỊ TRÍ XE (CHECK-POSITION SCREEN)
   ========================================================================= */
function CheckPositionScreen() {
  const [cardScanned, setCardScanned] = useState(false)

  return (
    <ScreenFrame title="Tra cứu vị trí xe đỗ bằng Thẻ (Check-Position)" subtitle="Kiosk tìm xe / Quẹt thẻ để hiện vị trí">
      {!cardScanned ? (
        <div className="my-8 flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-emerald-300 bg-emerald-50/40 p-8 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-600 text-3xl text-white shadow-lg">
            💳
          </div>
          <h3 className="mt-4 text-xl font-extrabold text-slate-900">VUI LÒNG QUẸT THẺ GỬI XE VÀO MÁY KIOSK</h3>
          <p className="mt-1 max-w-md text-sm text-slate-600">
            Đưa thẻ gửi xe lại gần vùng cảm biến hoặc bấm nút giả lập bên dưới để hệ thống định vị vị trí xe đỗ của bạn.
          </p>
          <button
            type="button"
            onClick={() => setCardScanned(true)}
            className="mt-6 rounded-2xl bg-emerald-600 px-6 py-3.5 text-sm font-extrabold text-white shadow-lg transition hover:bg-emerald-700 active:scale-95"
          >
            QUẸT THẺ P-8821 (GIẢ LẬP TRA CỨU)
          </button>
        </div>
      ) : (
        <div>
          {/* Header banner showing scanned vehicle location */}
          <div className="mb-6 rounded-2xl border border-emerald-400 bg-emerald-500 p-4 text-white shadow-md">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-100">KẾT QUẢ TRA CỨU THẺ #P-8821</p>
                <h3 className="text-xl font-extrabold">Xe của bạn đang đỗ tại: TẦNG B2 - KHU C - Ô VỊ TRÍ C4</h3>
                <p className="text-xs text-emerald-100 mt-0.5">Biển số: <strong>52-F1 888.88</strong> | Thời gian gửi: 16:20:10</p>
              </div>
              <button
                type="button"
                onClick={() => setCardScanned(false)}
                className="rounded-xl border border-white/40 bg-white/20 px-3 py-2 text-xs font-bold text-white hover:bg-white/30"
              >
                Quẹt thẻ khác ↺
              </button>
            </div>
          </div>

          {/* 2x2 Grid: Zone C highlighted, Zones A/B/D hatched & dimmed */}
          <div className="grid gap-5 md:grid-cols-2">
            {/* KHU A - DIMMED OUT */}
            <div className="striped-pattern flex min-h-[170px] flex-col items-center justify-center rounded-2xl border border-slate-300 p-5 text-center shadow-inner">
              <span className="text-2xl font-extrabold text-slate-400">KHU A</span>
              <span className="mt-1 text-xs font-semibold text-slate-400">(Khu vực khác - Không có xe bạn)</span>
            </div>

            {/* KHU B - DIMMED OUT */}
            <div className="striped-pattern flex min-h-[170px] flex-col items-center justify-center rounded-2xl border border-slate-300 p-5 text-center shadow-inner">
              <span className="text-2xl font-extrabold text-slate-400">KHU B</span>
              <span className="mt-1 text-xs font-semibold text-slate-400">(Khu vực khác - Không có xe bạn)</span>
            </div>

            {/* KHU C - HIGHLIGHTED ZONE WITH CAR MARKER */}
            <div className="rounded-2xl border-2 border-emerald-500 bg-white p-5 shadow-lg ring-4 ring-emerald-100">
              <div className="mb-3 flex items-center justify-between border-b border-emerald-100 pb-2">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-xs font-bold text-white">C</span>
                  <h4 className="text-base font-extrabold text-emerald-900">KHU C (KHU VỰC XE ĐỖ)</h4>
                </div>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                  Vị trí đánh dấu: C4
                </span>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: 15 }, (_, i) => {
                  const spotNum = `C${i + 1}`
                  const isCarSpot = spotNum === 'C4'
                  const isOccupied = i === 1 || i === 3 || i === 7

                  if (isCarSpot) {
                    return (
                      <div
                        key={spotNum}
                        className="col-span-2 flex flex-col items-center justify-center rounded-xl bg-emerald-600 p-2 text-white shadow-md ring-4 ring-emerald-300 animate-bounce"
                      >
                        <span className="text-lg">🚗</span>
                        <span className="text-xs font-extrabold">XE CỦA BẠN (C4)</span>
                      </div>
                    )
                  }

                  return (
                    <div
                      key={spotNum}
                      className={`flex h-10 items-center justify-center rounded-lg text-xs font-bold ${
                        isOccupied ? 'bg-rose-100 text-rose-700 border border-rose-300' : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {spotNum}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* KHU D - DIMMED OUT */}
            <div className="striped-pattern flex min-h-[170px] flex-col items-center justify-center rounded-2xl border border-slate-300 p-5 text-center shadow-inner">
              <span className="text-2xl font-extrabold text-slate-400">KHU D</span>
              <span className="mt-1 text-xs font-semibold text-slate-400">(Khu vực khác - Không có xe bạn)</span>
            </div>
          </div>

          {/* Current Position & Navigation Guidance */}
          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">📍 VỊ TRÍ HIỆN TẠI (CURRENT POSITION)</p>
                <p className="text-base font-bold text-slate-900">Kiosk Tra cứu Lối vào Tầng B2 (Kiosk #01)</p>
                <p className="mt-1 text-xs text-slate-600">
                  <strong>Hướng dẫn đường đi:</strong> Từ Kiosk đi thẳng 15m theo Lối đi chính → Rẽ phải vào Khu C → Ô đỗ C4 bên tay trái.
                </p>
              </div>
              <div className="rounded-xl border border-emerald-300 bg-emerald-100 px-4 py-2 text-xs font-bold text-emerald-900">
                Khoảng cách đến xe: ~25 mét
              </div>
            </div>
          </div>
        </div>
      )}
    </ScreenFrame>
  )
}

/* =========================================================================
   5. LUỒNG THANH TOÁN TƯƠNG TÁC (PAYMENT SCREEN)
   ========================================================================= */
type CheckoutStep = 'tap_card' | 'pay' | 'success'

function PaymentScreen() {
  const [step, setStep] = useState<CheckoutStep>('tap_card')
  const [method, setMethod] = useState<'qr' | 'card'>('qr')

  return (
    <ScreenFrame title="Luồng Thanh toán & Rời bãi xe" subtitle="Kiosk Cổng ra / Tương tác trả thẻ -> Thanh toán -> Barie mở">
      {/* Progress Steps Indicator */}
      <div className="mb-6 grid grid-cols-3 gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2 text-center text-xs font-bold">
        {[
          ['1. Quẹt thẻ gửi xe', 'tap_card'],
          ['2. Thanh toán (QR / Thẻ POS)', 'pay'],
          ['3. Mở Barie rời bãi', 'success'],
        ].map(([label, sId], idx) => {
          const isCurrent = step === sId
          const stepOrder = ['tap_card', 'pay', 'success']
          const isPassed = stepOrder.indexOf(step) > idx

          return (
            <div
              key={sId}
              className={`rounded-xl py-2.5 transition ${
                isCurrent
                  ? 'bg-emerald-600 text-white shadow'
                  : isPassed
                  ? 'bg-emerald-100 text-emerald-900'
                  : 'text-slate-400'
              }`}
            >
              {label}
            </div>
          )
        })}
      </div>

      {/* BƯỚC 1: QUẸT THẺ */}
      {step === 'tap_card' && (
        <div className="my-6 flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-900 text-3xl text-white shadow-lg">
            💳
          </div>
          <h3 className="mt-4 text-xl font-extrabold text-slate-900">QUẸT THẺ GỬI XE TẠI KIOSK CỔNG RA</h3>
          <p className="mt-1 max-w-md text-sm text-slate-600">
            Quẹt hoặc thả thẻ gửi xe vào khe nhận thẻ để xem thông tin và thanh toán ngay.
          </p>
          <button
            type="button"
            onClick={() => setStep('pay')}
            className="mt-6 rounded-2xl bg-emerald-600 px-7 py-4 text-base font-extrabold text-white shadow-lg transition hover:bg-emerald-700 active:scale-95"
          >
            QUẸT THẺ THU PHÍ (THẺ #P-8821) →
          </button>
        </div>
      )}

      {/* BƯỚC 2: THANH TOÁN TRỰC TIẾP (THÔNG TIN + MÃ QR / PHƯƠNG THỨC NẰM CÙNG 1 MÀN HÌNH) */}
      {step === 'pay' && (
        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-12">
            {/* Cột trái: Thông tin gửi xe & Phí */}
            <div className="lg:col-span-5 flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div>
                <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Thông tin phiếu gửi xe</h3>
                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Mã thẻ:</span>
                    <span className="font-mono font-bold text-slate-900">#P-8821</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Biển số xe:</span>
                    <span className="font-mono font-bold text-emerald-700">52-F1 888.88</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Vị trí đỗ:</span>
                    <span className="font-semibold text-slate-800">Tầng B2 - Khu C (C4)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Thời gian vào:</span>
                    <span className="font-mono text-slate-700">16:20 (18/08)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Thời gian ra:</span>
                    <span className="font-mono text-slate-700">19:45 (18/08)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Thời lượng đỗ:</span>
                    <span className="font-semibold text-slate-800">3 giờ 25 phút</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-center">
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">Tổng tiền cần thanh toán</p>
                <p className="mt-1 text-3xl font-black text-emerald-700 font-mono">4.000 VNĐ</p>
              </div>
            </div>

            {/* Cột phải: Mã QR hiển thị sẵn & Chọn phương thức thanh toán trực tiếp */}
            <div className="lg:col-span-7 rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm flex flex-col justify-between">
              <div>
                {/* Thanh chuyển phương thức thanh toán nhanh */}
                <div className="mb-5 flex rounded-xl bg-slate-200/70 p-1 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setMethod('qr')}
                    className={`flex-1 rounded-lg py-2.5 transition ${
                      method === 'qr' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    📱 Quét mã QR
                  </button>
                  <button
                    type="button"
                    onClick={() => setMethod('card')}
                    className={`flex-1 rounded-lg py-2.5 transition ${
                      method === 'card' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    💳 Chạm thẻ POS
                  </button>
                </div>

                {/* Nội dung thanh toán tương ứng */}
                {method === 'qr' && (
                  <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-5 border border-slate-200 text-center">
                    <p className="text-sm font-extrabold text-slate-900">Mở App Ngân hàng / MoMo / VNPay quét mã này</p>
                    <div className="my-3 flex items-center justify-center rounded-2xl border-2 border-dashed border-emerald-400 bg-emerald-50/50 p-4">
                      <div className="w-44 rounded-xl border border-slate-300 bg-white p-3 text-center shadow-sm">
                        <div className="grid grid-cols-8 gap-1">
                          {Array.from({ length: 64 }).map((_, i) => (
                            <div key={i} className={`h-2.5 rounded-[1px] ${i % 3 === 0 || i % 5 === 0 ? 'bg-slate-900' : 'bg-slate-100'}`} />
                          ))}
                        </div>
                        <p className="mt-2 font-mono text-[9px] font-bold text-slate-600">PARKING-PAY-4K</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">Tự động nhận diện số tiền <strong>4.000 VNĐ</strong></p>
                  </div>
                )}

                {method === 'card' && (
                  <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-8 border border-slate-200 text-center">
                    <div className="text-4xl">💳</div>
                    <p className="mt-3 text-base font-bold text-slate-900">CHẠM THẺ NGÂN HÀNG (POS)</p>
                    <p className="mt-1 text-xs text-slate-500 max-w-xs">Chạm thẻ Visa, Mastercard hoặc ATM Napas vào thiết bị đọc POS bên cạnh màn hình.</p>
                  </div>
                )}
              </div>

              {/* Action Button: Nút duy nhất để hoàn tất & mở Barie */}
              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep('tap_card')}
                  className="rounded-2xl border border-slate-300 bg-white px-4 py-3.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
                >
                  ← Quẹt thẻ khác
                </button>
                <button
                  type="button"
                  onClick={() => setStep('success')}
                  className="flex-1 rounded-2xl bg-emerald-600 py-3.5 text-sm font-black text-white shadow-lg transition hover:bg-emerald-700 active:scale-95"
                >
                  XÁC NHẬN THANH TOÁN & MỞ BARIE ✔
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BƯỚC 3: XÁC NHẬN THÀNH CÔNG & MỞ BARIE */}
      {step === 'success' && (
        <div className="rounded-3xl border border-emerald-300 bg-emerald-50 p-6 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-600 text-3xl text-white shadow-lg">
            ✓
          </div>
          <h3 className="mt-4 text-2xl font-extrabold text-emerald-950">THANH TOÁN THÀNH CÔNG!</h3>
          <p className="mt-1 text-sm text-emerald-800">Số tiền: <strong className="font-mono text-base">4.000 VNĐ</strong> | Mã GD: TX-2026-00431</p>

          {/* BARRIER GATE OPEN BADGE */}
          <div className="my-6 rounded-2xl border-2 border-emerald-500 bg-emerald-600 p-4 text-white shadow-lg animate-pulse">
            <p className="text-xl font-extrabold tracking-wide">🚧 CỔNG BARIE ĐÃ MỞ - CHÚC QUÝ KHÁCH AN TOÀN!</p>
          </div>

          <button
            type="button"
            onClick={() => setStep('tap_card')}
            className="rounded-xl bg-slate-900 px-6 py-3 text-xs font-bold text-white shadow hover:bg-black"
          >
            Hoàn tất & Quay về màn hình ban đầu
          </button>
        </div>
      )}
    </ScreenFrame>
  )
}

/* =========================================================================
   MAIN APP ROUTER & SHELL
   ========================================================================= */
export default function App() {
  const [activeScreen, setActiveScreen] = useState<Screen>('overview')

  const screenMap: Record<Screen, React.ReactNode> = {
    overview: <OverviewScreen onNavigate={setActiveScreen} />,
    ticket: <TicketScreen />,
    floormap: <FloorMapScreen />,
    checkposition: <CheckPositionScreen />,
    payment: <PaymentScreen />,
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_10%_10%,#ecfdf5_0%,#f0fdf4_36%,#f8fafc_70%)] text-slate-900" style={{ fontFamily: '"IBM Plex Sans", sans-serif' }}>
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-700">Parking Kiosk HCI System</p>
            <h1 className="text-sm font-bold text-slate-900 sm:text-base" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
              Hệ thống Gửi xe Thông minh - Web Prototype Trực quan
            </h1>
          </div>
          <span className="rounded-full border border-emerald-300 bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
            Interactive Prototype v2.0
          </span>
        </div>
      </header>

      <nav className="border-b border-slate-200/80 bg-white/60 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-6xl gap-2 overflow-x-auto px-4 py-3 sm:px-6">
          {SCREENS.map((s) => {
            const active = s.id === activeScreen
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setActiveScreen(s.id)}
                className={`min-w-fit rounded-xl px-3.5 py-2.5 text-left transition ${
                  active
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-white text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 border border-slate-200'
                }`}
              >
                <p className="text-xs font-bold">{s.label}</p>
                <p className={`text-[10px] ${active ? 'text-emerald-100' : 'text-slate-400'}`}>{s.sub}</p>
              </button>
            )
          })}
        </div>
      </nav>

      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">{screenMap[activeScreen]}</main>

      <footer className="border-t border-slate-200 bg-white/60 py-4 text-center text-xs font-medium text-slate-500">
        Bản Prototype HCI Chuẩn hóa theo Yêu cầu Khảo sát • Nhấn các Tab menu để tương tác các màn hình.
      </footer>
    </div>
  )
}
