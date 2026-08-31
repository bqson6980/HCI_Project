import { useState, type ReactNode } from 'react'

type Screen = 'overview' | 'ticket' | 'floormap' | 'checkposition' | 'payment'
type CheckoutStep = 'tap_card' | 'pay' | 'success'
type PaymentMethod = 'qr' | 'card'

type FloorSummary = {
  id: string
  name: string
  type: string
  used: number
  total: number
  status: 'full' | 'warn' | 'ok'
}

const SCREENS: { id: Screen; label: string; sub: string }[] = [
  { id: 'overview', label: '1. Tổng quan', sub: 'Công suất & chỗ trống B1-B6' },
  { id: 'ticket', label: '2. Nhận thẻ', sub: 'Vào bãi & ghi nhận xe' },
  { id: 'floormap', label: '3. Sơ đồ tầng', sub: 'Chọn chỗ đỗ' },
  { id: 'checkposition', label: '4. Tra cứu vị trí', sub: 'Tìm xe bằng thẻ' },
  { id: 'payment', label: '5. Thanh toán', sub: 'Hoàn tất & mở barie' },
]

const FLOORS: FloorSummary[] = [
  { id: 'B1', name: 'Tầng B1', type: 'Xe máy', used: 300, total: 300, status: 'full' },
  { id: 'B2', name: 'Tầng B2', type: 'Xe máy', used: 245, total: 300, status: 'warn' },
  { id: 'B3', name: 'Tầng B3', type: 'Xe máy', used: 49, total: 300, status: 'ok' },
  { id: 'B4', name: 'Tầng B4', type: 'Xe máy', used: 300, total: 300, status: 'full' },
  { id: 'B5', name: 'Tầng B5', type: 'Xe máy', used: 102, total: 300, status: 'ok' },
  { id: 'B6', name: 'Tầng B6', type: 'Xe máy', used: 80, total: 300, status: 'ok' },
]

function statusBadge(status: FloorSummary['status']) {
  if (status === 'full') return { label: 'ĐẦY', bg: 'bg-rose-500 text-white border-rose-600' }
  if (status === 'warn') return { label: 'GẦN ĐẦY', bg: 'bg-amber-400 text-amber-950 border-amber-500' }
  return { label: 'CÒN TRỐNG', bg: 'bg-emerald-500 text-white border-emerald-600' }
}

function statusBarBg(status: FloorSummary['status']) {
  if (status === 'full') return 'bg-rose-500'
  if (status === 'warn') return 'bg-amber-400'
  return 'bg-emerald-500'
}

function ScreenFrame({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
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

function OverviewScreen() {
  const totalSlots = FLOORS.reduce((sum, floor) => sum + floor.total, 0)
  const totalUsed = FLOORS.reduce((sum, floor) => sum + floor.used, 0)
  const totalFree = totalSlots - totalUsed

  return (
    <ScreenFrame title="Tổng quan chỗ trống gửi xe (Hầm B1 - B6)">
      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Tổng sức chứa</p>
          <p className="mt-1 text-2xl font-extrabold text-slate-900">
            {totalSlots.toLocaleString()} <span className="text-sm font-normal text-slate-500">chỗ</span>
          </p>
        </div>
        <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-rose-700">Đã sử dụng</p>
          <p className="mt-1 text-2xl font-extrabold text-rose-700">
            {totalUsed.toLocaleString()} <span className="text-sm font-normal text-rose-600">chỗ ({Math.round((totalUsed / totalSlots) * 100)}%)</span>
          </p>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-emerald-700">Còn trống toàn bãi</p>
          <p className="mt-1 text-2xl font-extrabold text-emerald-700">
            {totalFree.toLocaleString()} <span className="text-sm font-normal text-emerald-600">chỗ khả dụng</span>
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {FLOORS.map((floor) => {
          const percent = Math.round((floor.used / floor.total) * 100)
          const available = floor.total - floor.used
          const badge = statusBadge(floor.status)

          return (
            <div key={floor.id} className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-[140px] items-center gap-3.5">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-lg font-black text-white sm:h-14 sm:w-14 sm:text-xl">
                  {floor.id}
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{floor.name}</h3>
                  <p className="text-xs text-slate-500">{floor.type}</p>
                </div>
              </div>

              <div className="max-w-lg flex-1">
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">
                    Còn trống: <strong className="font-bold text-slate-900">{available}</strong> / {floor.total} chỗ
                  </span>
                  <span className="font-medium text-slate-500">{percent}% đã dùng</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                  <div className={`h-full rounded-full transition-all duration-500 ${statusBarBg(floor.status)}`} style={{ width: `${percent}%` }} />
                </div>
              </div>

              <div className="flex min-w-[150px] items-center justify-end">
                <span className={`rounded-full border px-3.5 py-1 text-xs font-extrabold ${badge.bg}`}>{badge.label}</span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-6 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-semibold text-slate-700">
        <span className="flex items-center gap-2"><span className="h-3.5 w-3.5 rounded-full bg-emerald-500" /> Còn trống</span>
        <span className="flex items-center gap-2"><span className="h-3.5 w-3.5 rounded-full bg-amber-400" /> Gần đầy</span>
        <span className="flex items-center gap-2"><span className="h-3.5 w-3.5 rounded-full bg-rose-500" /> Đầy</span>
      </div>
    </ScreenFrame>
  )
}

function TicketScreen({ ticketIssued, onIssueTicket, onResetTicket }: { ticketIssued: boolean; onIssueTicket: () => void; onResetTicket: () => void }) {
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
              <button type="button" onClick={onIssueTicket} className="w-full rounded-2xl bg-emerald-600 py-4 text-base font-extrabold text-white shadow-lg transition hover:bg-emerald-700 active:scale-95">
                NHẤN ĐỂ NHẬN THẺ
              </button>
            ) : (
              <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-center">
                <p className="text-base font-bold text-emerald-900">✅ THẺ ĐÃ PHÁT THÀNH CÔNG!</p>
                <p className="mt-1 text-xs text-emerald-700">Mã thẻ: <strong className="font-mono">P-8821</strong> | Vui lòng giữ thẻ cẩn thận.</p>
                <button type="button" onClick={onResetTicket} className="mt-3 rounded-lg border border-emerald-600 px-3 py-1 text-xs font-bold text-emerald-800 hover:bg-emerald-100">
                  Lấy thẻ mới
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </ScreenFrame>
  )
}

function FloorMapScreen({ selectedFloor, selectedZone, selectedSlot, onSelectSlot, onBack, onCheckPosition }: {
  selectedFloor: string
  selectedZone: string
  selectedSlot: string
  onSelectSlot: (zone: string, slot: string) => void
  onBack: () => void
  onCheckPosition: () => void
}) {
  const zoneData = [
    {
      zone: 'A',
      slots: [
        { key: 'A1', count: '5/20', taken: false },
        { key: 'A2', count: '2/20', taken: false },
        { key: 'A3', count: '3/20', taken: false },
        { key: 'A4', count: '4/20', taken: false },
        { key: 'A5', count: '1/20', taken: false },
        { key: 'A6', count: '5/20', taken: false },
      ],
    },
    {
      zone: 'B',
      slots: [
        { key: 'B1', count: '2/20', taken: false },
        { key: 'B2', count: '3/20', taken: false },
        { key: 'B3', count: '5/20', taken: false },
        { key: 'B4', count: '4/20', taken: false },
        { key: 'B5', count: '1/20', taken: false },
        { key: 'B6', count: '2/20', taken: false },
      ],
    },
    {
      zone: 'C',
      slots: [
        { key: 'C1', count: '1/20', taken: false },
        { key: 'C2', count: '5/20', taken: true },
        { key: 'C3', count: '3/20', taken: false },
        { key: 'C4', count: '2/20', taken: false },
        { key: 'C5', count: '4/20', taken: false },
        { key: 'C6', count: '1/20', taken: false },
      ],
    },
    {
      zone: 'D',
      slots: [
        { key: 'D1', count: '2/20', taken: false },
        { key: 'D2', count: '1/20', taken: false },
        { key: 'D3', count: '4/20', taken: false },
        { key: 'D4', count: '6/20', taken: false },
        { key: 'D5', count: '3/20', taken: false },
        { key: 'D6', count: '2/20', taken: false },
      ],
    },
  ]

  return (
    <ScreenFrame title="Sơ đồ chi tiết tầng" subtitle="Bãi xe / Khu vực và chỗ trống">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-md sm:p-6">
        <div className="mb-5 text-center">
          <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
            TẦNG {selectedFloor}
          </h2>
          <p className="mt-1 text-xs font-medium text-slate-500">Sơ đồ chi tiết khu vực A - B - C - D</p>
        </div>

        <div className="mx-auto grid max-w-4xl gap-4 sm:gap-6 md:grid-cols-2">
          {zoneData.map(({ zone, slots }) => (
            <div key={zone} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-[inset_0_0_0_1px_rgba(148,163,184,0.2)]">
              <div className="mb-3 text-center text-2xl font-black text-slate-900">{zone}</div>
              <div className="grid grid-cols-3 gap-2.5">
                {slots.map((slot) => {
                  const isSelected = selectedZone === zone && selectedSlot === slot.key
                  const isFree = !slot.taken

                  return (
                    <button
                      key={slot.key}
                      type="button"
                      onClick={() => onSelectSlot(zone, slot.key)}
                      className={`relative flex h-14 items-center justify-center rounded-xl border text-xs font-extrabold transition sm:h-16 ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-500 text-white ring-4 ring-emerald-100'
                          : isFree
                            ? 'border-emerald-200 bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                            : 'border-rose-200 bg-rose-100 text-rose-700'
                      }`}
                    >
                      <span className="absolute inset-0 rounded-xl border border-white/30" />
                      {slot.count}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-slate-700">
            <span className="flex h-5 w-5 items-center justify-center rounded-full border border-emerald-500 bg-emerald-100 text-[10px] text-emerald-700">i</span>
            <span>YOU ARE HERE</span>
            <span className="text-slate-400">(Vị trí của bạn)</span>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-5 text-[11px] font-semibold text-slate-600">
          <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-emerald-100 border border-emerald-300" /> Còn trống</span>
          <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-rose-100 border border-rose-300" /> Đã đầy</span>
        </div>

        <div className="mt-6 flex justify-center gap-3">
          <button type="button" onClick={onBack} className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100">← Quay về tổng quan</button>
          <button type="button" onClick={onCheckPosition} className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700">Tra cứu vị trí</button>
        </div>
      </div>
    </ScreenFrame>
  )
}

function CheckPositionScreen({ positionChecked, selectedFloor, selectedZone, selectedSlot, onCheck, onBackToMap, onGoToPayment }: {
  positionChecked: boolean
  selectedFloor: string
  selectedZone: string
  selectedSlot: string
  onCheck: () => void
  onBackToMap: () => void
  onGoToPayment: () => void
}) {
  if (!positionChecked) {
    return (
      <ScreenFrame title="Tra cứu vị trí xe đỗ bằng thẻ" subtitle="Kiosk tìm xe / quẹt thẻ để hiện vị trí">
        <div className="my-8 flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-emerald-300 bg-emerald-50/40 p-8 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-600 text-3xl text-white shadow-lg">💳</div>
          <h3 className="mt-4 text-xl font-extrabold text-slate-900">VUI LÒNG QUẸT THẺ GỬI XE VÀO MÁY KIOSK</h3>
          <p className="mt-1 max-w-md text-sm text-slate-600">
            Đưa thẻ gửi xe lại gần vùng cảm biến hoặc bấm nút để hệ thống định vị vị trí xe đỗ.
          </p>
          <button type="button" onClick={onCheck} className="mt-6 rounded-2xl bg-emerald-600 px-6 py-3.5 text-sm font-extrabold text-white shadow-lg transition hover:bg-emerald-700 active:scale-95">
            QUẸT THẺ P-8821 (GIẢ LẬP TRA CỨU)
          </button>
        </div>
      </ScreenFrame>
    )
  }

  return (
    <ScreenFrame title="Tra cứu vị trí xe đỗ bằng thẻ" subtitle="Kiosk tìm xe / quẹt thẻ để hiện vị trí">
      <div className="mb-6 rounded-2xl border border-emerald-400 bg-emerald-500 p-4 text-white shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-100">KẾT QUẢ TRA CỨU THẺ #P-8821</p>
            <h3 className="text-xl font-extrabold">Xe của bạn đang đỗ tại: TẦNG {selectedFloor} - KHU {selectedZone} - Ô VỊ TRÍ {selectedSlot}</h3>
            <p className="mt-0.5 text-xs text-emerald-100">Biển số: <strong>52-F1 888.88</strong> | Thời gian gửi: 16:20:10</p>
          </div>
          <button type="button" onClick={onCheck} className="rounded-xl border border-white/40 bg-white/20 px-3 py-2 text-xs font-bold text-white hover:bg-white/30">
            Quẹt thẻ khác ↺
          </button>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {['A', 'B', 'C', 'D'].map((zone) => (
          <div key={zone} className={`flex min-h-[170px] flex-col items-center justify-center rounded-2xl border p-5 text-center shadow-inner ${zone === selectedZone ? 'border-emerald-500 bg-white ring-4 ring-emerald-100' : 'border-slate-300 bg-slate-50/70'}`}>
            <span className={`text-2xl font-extrabold ${zone === selectedZone ? 'text-emerald-900' : 'text-slate-400'}`}>KHU {zone}</span>
            <span className={`mt-1 text-xs font-semibold ${zone === selectedZone ? 'text-emerald-700' : 'text-slate-400'}`}>
              {zone === selectedZone ? `Vị trí đã chọn: ${selectedSlot}` : '(Khu vực khác - Không có xe bạn)'}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-center gap-3">
        <button type="button" onClick={onBackToMap} className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100">← Xem sơ đồ</button>
        <button type="button" onClick={onGoToPayment} className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700">Thanh toán rời bãi</button>
      </div>
    </ScreenFrame>
  )
}

function PaymentScreen({ checkoutStep, paymentMethod, selectedFloor, selectedZone, selectedSlot, onSetStep, onSetMethod, onFinish }: {
  checkoutStep: CheckoutStep
  paymentMethod: PaymentMethod
  selectedFloor: string
  selectedZone: string
  selectedSlot: string
  onSetStep: (step: CheckoutStep) => void
  onSetMethod: (method: PaymentMethod) => void
  onFinish: () => void
}) {
  const stepOrder: CheckoutStep[] = ['tap_card', 'pay', 'success']

  return (
    <ScreenFrame title="Luồng thanh toán & rời bãi xe" subtitle="Kiosk cổng ra / tương tác trả thẻ -> thanh toán -> barie mở">
      <div className="mb-6 grid grid-cols-3 gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2 text-center text-xs font-bold">
        {[
          ['1. Quẹt thẻ gửi xe', 'tap_card'],
          ['2. Thanh toán', 'pay'],
          ['3. Mở barie rời bãi', 'success'],
        ].map(([label, step], idx) => {
          const stepKey = step as CheckoutStep
          const isCurrent = checkoutStep === stepKey
          const isPassed = stepOrder.indexOf(checkoutStep) > idx

          return (
            <div key={stepKey} className={`rounded-xl py-2.5 transition ${isCurrent ? 'bg-emerald-600 text-white shadow' : isPassed ? 'bg-emerald-100 text-emerald-900' : 'text-slate-400'}`}>
              {label}
            </div>
          )
        })}
      </div>

      {checkoutStep === 'tap_card' && (
        <div className="my-6 flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-900 text-3xl text-white shadow-lg">💳</div>
          <h3 className="mt-4 text-xl font-extrabold text-slate-900">QUẸT THẺ GỬI XE TẠI KIOSK CỔNG RA</h3>
          <p className="mt-1 max-w-md text-sm text-slate-600">
            Quẹt hoặc thả thẻ gửi xe vào khe nhận thẻ để xem thông tin và thanh toán ngay.
          </p>
          <button type="button" onClick={() => onSetStep('pay')} className="mt-6 rounded-2xl bg-emerald-600 px-7 py-4 text-base font-extrabold text-white shadow-lg transition hover:bg-emerald-700 active:scale-95">
            QUẸT THẺ THU PHÍ (THẺ #P-8821) →
          </button>
        </div>
      )}

      {checkoutStep === 'pay' && (
        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-12">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-5">
              <h3 className="border-b border-slate-100 pb-3 text-lg font-bold text-slate-900">Thông tin phiếu gửi xe</h3>
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-slate-500">Mã thẻ:</span><span className="font-mono font-bold text-slate-900">#P-8821</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Biển số xe:</span><span className="font-mono font-bold text-emerald-700">52-F1 888.88</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Vị trí đỗ:</span><span className="font-semibold text-slate-800">Tầng {selectedFloor} - Khu {selectedZone} ({selectedSlot})</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Thời gian vào:</span><span className="font-mono text-slate-700">16:20 (18/08)</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Thời gian ra:</span><span className="font-mono text-slate-700">19:45 (18/08)</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Thời lượng đỗ:</span><span className="font-semibold text-slate-800">3 giờ 25 phút</span></div>
              </div>

              <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-center">
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">Tổng tiền cần thanh toán</p>
                <p className="mt-1 text-3xl font-black font-mono text-emerald-700">4.000 VNĐ</p>
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm lg:col-span-7">
              <div>
                <div className="mb-5 flex rounded-xl bg-slate-200/70 p-1 text-xs font-bold">
                  <button type="button" onClick={() => onSetMethod('qr')} className={`flex-1 rounded-lg py-2.5 transition ${paymentMethod === 'qr' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>
                    📱 Quét mã QR
                  </button>
                  <button type="button" onClick={() => onSetMethod('card')} className={`flex-1 rounded-lg py-2.5 transition ${paymentMethod === 'card' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>
                    💳 Chạm thẻ POS
                  </button>
                </div>

                {paymentMethod === 'qr' ? (
                  <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-5 text-center">
                    <p className="text-sm font-extrabold text-slate-900">Mở App Ngân hàng / MoMo / VNPay quét mã này</p>
                    <div className="my-3 flex items-center justify-center rounded-2xl border-2 border-dashed border-emerald-400 bg-emerald-50/50 p-4">
                      <div className="w-44 rounded-xl border border-slate-300 bg-white p-3 text-center shadow-sm">
                        <div className="grid grid-cols-8 gap-1">
                          {Array.from({ length: 64 }).map((_, index) => (
                            <div key={index} className={`h-2.5 rounded-[1px] ${index % 3 === 0 || index % 5 === 0 ? 'bg-slate-900' : 'bg-slate-100'}`} />
                          ))}
                        </div>
                        <p className="mt-2 font-mono text-[9px] font-bold text-slate-600">PARKING-PAY-4K</p>
                      </div>
                    </div>
                    <p className="text-xs font-medium text-slate-500">Tự động nhận diện số tiền <strong>4.000 VNĐ</strong></p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 text-center">
                    <div className="text-4xl">💳</div>
                    <p className="mt-3 text-base font-bold text-slate-900">CHẠM THẺ NGÂN HÀNG (POS)</p>
                    <p className="mt-1 max-w-xs text-xs text-slate-500">Chạm thẻ Visa, Mastercard hoặc ATM Napas vào thiết bị đọc POS bên cạnh màn hình.</p>
                  </div>
                )}
              </div>

              <div className="mt-6 flex gap-3">
                <button type="button" onClick={() => onSetStep('tap_card')} className="rounded-2xl border border-slate-300 bg-white px-4 py-3.5 text-xs font-bold text-slate-700 hover:bg-slate-100">← Quẹt thẻ khác</button>
                <button type="button" onClick={() => onSetStep('success')} className="flex-1 rounded-2xl bg-emerald-600 py-3.5 text-sm font-black text-white shadow-lg transition hover:bg-emerald-700 active:scale-95">XÁC NHẬN THANH TOÁN & MỞ BARIE ✔</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {checkoutStep === 'success' && (
        <div className="rounded-3xl border border-emerald-300 bg-emerald-50 p-6 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-600 text-3xl text-white shadow-lg">✓</div>
          <h3 className="mt-4 text-2xl font-extrabold text-emerald-950">THANH TOÁN THÀNH CÔNG!</h3>
          <p className="mt-1 text-sm text-emerald-800">Số tiền: <strong className="font-mono text-base">4.000 VNĐ</strong> | Mã GD: TX-2026-00431</p>

          <div className="my-6 rounded-2xl border-2 border-emerald-500 bg-emerald-600 p-4 text-white shadow-lg animate-pulse">
            <p className="text-xl font-extrabold tracking-wide">🚧 CỔNG BARIE ĐÃ MỞ - CHÚC QUÝ KHÁCH AN TOÀN!</p>
          </div>

          <button type="button" onClick={onFinish} className="rounded-xl bg-slate-900 px-6 py-3 text-xs font-bold text-white shadow hover:bg-black">Hoàn tất & quay về màn hình ban đầu</button>
        </div>
      )}
    </ScreenFrame>
  )
}

export default function App() {
  const [activeScreen, setActiveScreen] = useState<Screen>('overview')
  const [selectedFloor, setSelectedFloor] = useState('B2')
  const [selectedZone, setSelectedZone] = useState('C')
  const [selectedSlot, setSelectedSlot] = useState('C4')
  const [ticketIssued, setTicketIssued] = useState(false)
  const [positionChecked, setPositionChecked] = useState(false)
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>('tap_card')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('qr')

  const handleSelectFloor = (floor: string) => {
    setSelectedFloor(floor)
    setActiveScreen('floormap')
  }

  const handleSelectSlot = (zone: string, slot: string) => {
    setSelectedZone(zone)
    setSelectedSlot(slot)
    setActiveScreen('checkposition')
  }

  const handleIssueTicket = () => {
    setTicketIssued(true)
    setActiveScreen('floormap')
  }

  const resetFlow = () => {
    setTicketIssued(false)
    setPositionChecked(false)
    setCheckoutStep('tap_card')
    setPaymentMethod('qr')
    setSelectedFloor('B2')
    setSelectedZone('C')
    setSelectedSlot('C4')
    setActiveScreen('overview')
  }

  const screenMap: Record<Screen, JSX.Element> = {
    overview: <OverviewScreen />,
    ticket: <TicketScreen ticketIssued={ticketIssued} onIssueTicket={handleIssueTicket} onResetTicket={() => setTicketIssued(false)} />,
    floormap: <FloorMapScreen selectedFloor={selectedFloor} selectedZone={selectedZone} selectedSlot={selectedSlot} onSelectSlot={handleSelectSlot} onBack={() => setActiveScreen('overview')} onCheckPosition={() => setActiveScreen('checkposition')} />,
    checkposition: <CheckPositionScreen positionChecked={positionChecked} selectedFloor={selectedFloor} selectedZone={selectedZone} selectedSlot={selectedSlot} onCheck={() => setPositionChecked(true)} onBackToMap={() => setActiveScreen('floormap')} onGoToPayment={() => setActiveScreen('payment')} />,
    payment: <PaymentScreen checkoutStep={checkoutStep} paymentMethod={paymentMethod} selectedFloor={selectedFloor} selectedZone={selectedZone} selectedSlot={selectedSlot} onSetStep={setCheckoutStep} onSetMethod={setPaymentMethod} onFinish={resetFlow} />,
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_10%_10%,#ecfdf5_0%,#f0fdf4_36%,#f8fafc_70%)] text-slate-900" style={{ fontFamily: '"IBM Plex Sans", sans-serif' }}>
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-700">Parking Kiosk HCI System</p>
            <h1 className="text-sm font-bold text-slate-900 sm:text-base" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
              Hệ thống Gửi xe Thông minh - Prototype tương tác
            </h1>
          </div>
          <span className="rounded-full border border-emerald-300 bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
            Interactive Prototype v2.0
          </span>
        </div>
      </header>

      <nav className="border-b border-slate-200/80 bg-white/60 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-6xl gap-2 overflow-x-auto px-4 py-3 sm:px-6">
          {SCREENS.map((screen) => {
            const active = screen.id === activeScreen
            return (
              <button
                key={screen.id}
                type="button"
                onClick={() => setActiveScreen(screen.id)}
                className={`min-w-fit rounded-xl px-3.5 py-2.5 text-left transition ${active ? 'bg-emerald-600 text-white shadow-md' : 'border border-slate-200 bg-white text-slate-700 hover:bg-emerald-50 hover:text-emerald-900'}`}
              >
                <p className="text-xs font-bold">{screen.label}</p>
                <p className={`text-[10px] ${active ? 'text-emerald-100' : 'text-slate-400'}`}>{screen.sub}</p>
              </button>
            )
          })}
        </div>
      </nav>

      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">{screenMap[activeScreen]}</main>

      <footer className="border-t border-slate-200 bg-white/60 py-4 text-center text-xs font-medium text-slate-500">
        Bản Prototype HCI chuẩn hóa theo yêu cầu • Nhấn các tab menu để tương tác các màn hình.
      </footer>
    </div>
  )
}