import { useState, useEffect } from 'react'
import parkingAPI from './services/api'

type Screen = 'overview' | 'ticket' | 'floormap' | 'saveposition' | 'checkposition' | 'payment'

const SCREENS: { id: Screen; label: string; sub: string }[] = [
  { id: 'overview', label: '1. Tổng quan', sub: 'Công suất & Chỗ trống B1-B6' },
  { id: 'ticket', label: '2. Nhận thẻ', sub: 'Vào bãi & Ghi nhận xe' },
  { id: 'floormap', label: '3. Sơ đồ tầng B2', sub: 'Trực quan chỗ trống & Lối vào/ra' },
  { id: 'saveposition', label: '4. Lưu vị trí xe', sub: 'Chọn ô đỗ xe' },
  { id: 'checkposition', label: '5. Tra cứu vị trí', sub: 'Check-position bằng thẻ' },
  { id: 'payment', label: '6. Thanh toán', sub: 'Luồng trả thẻ & Mở barie' },
]

type FloorStatus = 'full' | 'warn' | 'ok'

interface FloorDisplay {
  id: string
  name: string
  type: string
  used: number
  total: number
  status: FloorStatus
}

const ZONES_DATA = [
  { id: 'A', name: 'A' },
  { id: 'B', name: 'B' },
  { id: 'C', name: 'C' },
  { id: 'D', name: 'D' },
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

function getFloorStatus(occupancyPercent: number): FloorStatus {
  if (occupancyPercent >= 90) return 'full'
  if (occupancyPercent >= 70) return 'warn'
  return 'ok'
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
        <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl font-grotesk">
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
function OverviewScreen({ floors }: { floors: FloorDisplay[] }) {
  const totalSlots = floors.reduce((acc, f) => acc + f.total, 0)
  const totalUsed = floors.reduce((acc, f) => acc + f.used, 0)
  const totalFree = totalSlots - totalUsed

  return (
    <ScreenFrame title="Tổng quan chỗ trống gửi xe (Hầm B1 - B6)">
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

      <div className="flex flex-col gap-3">
        {floors.map((f) => {
          const percent = Math.round((f.used / f.total) * 100)
          const available = f.total - f.used
          const badge = statusBadge(f.status)

          return (
            <div
              key={f.id}
              className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-3.5 min-w-[140px]">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-lg font-black text-white sm:h-14 sm:w-14 sm:text-xl">
                  {f.id}
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{f.name}</h3>
                  <p className="text-xs text-slate-500">{f.type}</p>
                </div>
              </div>

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

              <div className="flex items-center sm:justify-end min-w-[100px]">
                <span className={`rounded-full border px-3.5 py-1 text-xs font-extrabold ${badge.bg}`}>
                  {badge.label}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-6 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-semibold text-slate-700">
        <span className="flex items-center gap-2">
          <span className="h-3.5 w-3.5 rounded-full bg-emerald-500" /> Còn trống (Available)
        </span>
        <span className="flex items-center gap-2">
          <span className="h-3.5 w-3.5 rounded-full bg-amber-400" /> Gần đầy (&gt;70%)
        </span>
        <span className="flex items-center gap-2">
          <span className="h-3.5 w-3.5 rounded-full bg-rose-500" /> Đầy hẳn (≥90%)
        </span>
      </div>
    </ScreenFrame>
  )
}

/* =========================================================================
   2. NHẬN THẺ KHI GỬI XE (TICKET SCREEN)
   ========================================================================= */
function TicketScreen() {
  const [licensePlate, setLicensePlate] = useState('52-F1 888.88')
  const [ticketIssued, setTicketIssued] = useState(false)
  const [ticketId, setTicketId] = useState('')

  // Tạo ticket ID dựa trên biển số (hash đơn giản)
  const generateTicketId = (plate: string) => {
    const sanitized = plate.replace(/[^A-Z0-9]/g, '')
    const hash = sanitized.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
    return `P-${(hash % 10000).toString().padStart(4, '0')}`
  }

  const handleReceiveTicket = async () => {
    try {
      const car = await parkingAPI.checkInCar(licensePlate)
      const ticket = await parkingAPI.generateTicket(car.id, 'B1', 'A1')
      setTicketId(ticket.id)
      setTicketIssued(true)
    } catch (error) {
      console.error('Error:', error)
      // Fallback: sinh ticket ID dựa trên biển số
      setTicketId(generateTicketId(licensePlate))
      setTicketIssued(true)
    }
  }

  return (
    <ScreenFrame title="Nhận thẻ khi gửi xe vào bãi" subtitle="Cổng vào / ANPR Camera tự động">
      <div className="space-y-6">
        {/* Phần 1: Input + Bảng giá (2 cột) */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Khung nhập biển số */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Nhập biển số hoặc Nhận diện tự động</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Camera Active
              </span>
            </div>

            <div className="rounded-xl border border-slate-300 bg-white p-4 text-center shadow-inner">
              <input
                type="text"
                value={licensePlate}
                onChange={(e) => setLicensePlate(e.target.value.toUpperCase())}
                placeholder="52-F1 888.88"
                className="w-full text-center text-3xl font-extrabold tracking-wider text-slate-900 border-0 outline-0 font-mono"
                style={{ background: 'transparent' }}
              />
              <p className="mt-2 text-xs font-medium text-slate-600">
                Thời gian vào: <span className="font-mono font-bold text-slate-900">{new Date().toLocaleTimeString('vi-VN')} - {new Date().toLocaleDateString('vi-VN')}</span>
              </p>
            </div>
          </div>

          {/* Bảng giá + Nút lấy thẻ */}
          <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5">
            <div>
              <h3 className="text-base font-bold text-slate-900">Bảng giá gửi xe theo khung giờ</h3>
              <p className="text-xs text-slate-500">Áp dụng cho xe máy & ô tô vãng lai</p>

              <div className="mt-4 divide-y divide-slate-100 rounded-xl border border-slate-200 bg-slate-50/50">
                {[
                  ['Khung 0 - 4 giờ', '5.000 VNĐ'],
                  ['Khung 4 - 12 giờ', '10.000 VNĐ'],
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
                  onClick={handleReceiveTicket}
                  className="w-full rounded-2xl bg-emerald-600 py-4 text-base font-extrabold text-white shadow-lg transition hover:bg-emerald-700 active:scale-95"
                >
                  PRESS TO RECEIVE CARD / NHẤN NÚT LẤY THẺ
                </button>
              ) : (
                <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-center">
                  <p className="text-base font-bold text-emerald-900">✅ THẺ ĐÃ PHÁT THÀNH CÔNG!</p>
                  <p className="mt-1 text-xs text-emerald-700">Mã thẻ: <strong className="font-mono">{ticketId}</strong> | Vui lòng giữ thẻ cẩn thận & Mở cổng Barie.</p>
                  <button
                    type="button"
                    onClick={() => { setTicketIssued(false); setLicensePlate('52-F1 888.88') }}
                    className="mt-3 rounded-lg border border-emerald-600 px-3 py-1 text-xs font-bold text-emerald-800 hover:bg-emerald-100"
                  >
                    Lấy thẻ mới (Reset demo)
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Phần 2: Khung Camera ANPR (Full width) */}
        <div className="rounded-2xl border border-slate-200 bg-slate-800 p-6 shadow-lg">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">
              CAM-ENTRY-GATE-01 • LIVE 1080P
            </span>
            <span className="text-xs font-bold text-emerald-400">ANPR DETECTION ACTIVE</span>
          </div>

          {/* Màn hình camera giả lập */}
          <div className="relative rounded-xl border-2 border-slate-600 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 p-6 min-h-[300px] flex flex-col items-center justify-center overflow-hidden">
            {/* Hiệu ứng scan line */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 opacity-5 bg-repeat-y" style={{
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,.03) 2px, rgba(255,255,255,.03) 4px)'
              }} />
            </div>

            {/* Nội dung camera */}
            <div className="relative z-10 text-center">
              <p className="text-sm font-bold text-emerald-300 mb-4 tracking-wider">BIỂN SỐ ĐƯỢC PHÁT HIỆN</p>
              
              {/* Hiển thị biển số (read-only, tự động cập nhật) */}
              <div className="rounded-lg border-3 border-emerald-400 bg-black/60 px-8 py-6 backdrop-blur mb-6">
                <p className="text-5xl font-extrabold font-mono text-white tracking-wider drop-shadow-lg">
                  {licensePlate}
                </p>
              </div>

              {/* Thông tin ANPR */}
              <div className="space-y-2">
                <p className="text-xs font-mono text-emerald-300">
                  ANPR MATCH CONFIDENCE: <span className="font-bold text-emerald-400">99.2%</span>
                </p>
                <p className="text-xs font-mono text-emerald-300">
                  DETECTED TIME: <span className="font-bold text-emerald-400">{new Date().toLocaleTimeString('vi-VN')}</span>
                </p>
              </div>
            </div>

            {/* Góc camera indicator */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <span className="text-[10px] font-mono text-emerald-400">REC</span>
            </div>
          </div>

          {/* Info bar dưới camera */}
          <div className="mt-3 rounded-lg bg-slate-700/50 px-4 py-2 flex items-center justify-end text-xs">
            <span className="text-emerald-400 font-mono">● REC</span>
          </div>
        </div>
      </div>
    </ScreenFrame>
  )
}

/* =========================================================================
   3. SƠ ĐỒ CHỖ TRỐNG TẦNG B2 (FLOOR MAP SCREEN)
   ========================================================================= */
function ZoneCard({ name }: { name: string }) {
  return (
    <div className="rounded-3xl border-2 border-slate-300 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-center text-3xl font-black text-slate-900">{name}</h3>
      <div className="grid gap-3">
        {Array.from({ length: 2 }).map((_, rIdx) => (
          <div key={rIdx} className="grid grid-cols-3 gap-3">
            {Array.from({ length: 3 }).map((_, cIdx) => (
              <div
                key={cIdx}
                className={`flex h-16 sm:h-20 items-center justify-center rounded-2xl font-extrabold text-lg sm:text-xl shadow-xs transition ${
                  (rIdx + cIdx) % 2 === 0 ? 'bg-emerald-500 text-white font-mono' : 'bg-rose-500'
                }`}
              >
                {(rIdx + cIdx) % 2 === 0 && '5/20'}
              </div>
            ))}
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
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl font-grotesk">
            TẦNG B2
          </h2>
          <p className="mt-1 text-xs text-slate-500 font-medium">Sơ đồ tổng quan phân khu A - B - C - D</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
          {ZONES_DATA.map((z) => (
            <ZoneCard key={z.id} name={z.name} />
          ))}
        </div>

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
   4. LƯU VỊ TRÍ XE - CHỌN Ô ĐỖ XE (SAVE POSITION SCREEN)
   ========================================================================= */
function SavePositionScreen() {
  const [ticketId, setTicketId] = useState('')
  const [selectedZone, setSelectedZone] = useState<string | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [confirmed, setConfirmed] = useState(false)

  // 6 cụm cho mỗi khu: A1-A6, B1-B6, C1-C6, D1-D6
  const zones = ['A', 'B', 'C', 'D']
  const slotsPerZone = 6

  const handleConfirm = () => {
    if (selectedZone && selectedSlot) {
      setConfirmed(true)
    }
  }

  const handleReset = () => {
    setTicketId('')
    setSelectedZone(null)
    setSelectedSlot(null)
    setConfirmed(false)
  }

  return (
    <ScreenFrame title="Lưu vị trí xe - Chọn ô đỗ xe" subtitle="Khách hàng chọn vị trí đỗ xe của mình">
      {!confirmed ? (
        <div className="space-y-6">
          {/* Nhập mã thẻ xe */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Nhập mã thẻ xe</label>
            <input
              type="text"
              value={ticketId}
              onChange={(e) => setTicketId(e.target.value.toUpperCase())}
              placeholder="P-1234"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg text-center text-lg font-mono font-bold text-slate-900"
            />
          </div>

          {/* Chọn cụm hoặc chi tiết ô */}
          {!selectedZone ? (
            <>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">Chọn khu vực:</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {zones.map((zone) => (
                    <button
                      key={zone}
                      type="button"
                      onClick={() => setSelectedZone(zone)}
                      className="rounded-2xl border-2 border-slate-300 bg-white p-6 text-center hover:border-emerald-500 hover:bg-emerald-50 transition shadow-sm"
                    >
                      <p className="text-3xl font-extrabold text-slate-900 font-grotesk">KHU {zone}</p>
                      <p className="mt-2 text-xs text-slate-600">Chọn để xem chi tiết cụm</p>
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">Chọn cụm trong khu {selectedZone} (mỗi cụm 20 chỗ):</h3>
                <div className="grid gap-3 md:grid-cols-6">
                  {Array.from({ length: slotsPerZone }).map((_, i) => {
                    const cluster = `${selectedZone}${i + 1}`
                    return (
                      <button
                        key={cluster}
                        type="button"
                        onClick={() => setSelectedSlot(cluster)}
                        className={`rounded-xl py-3 px-3 font-bold text-center transition ${
                          selectedSlot === cluster
                            ? 'bg-emerald-600 text-white border-2 border-emerald-700 shadow-lg'
                            : 'bg-white border-2 border-slate-300 text-slate-900 hover:border-emerald-400'
                        }`}
                      >
                        {cluster}
                      </button>
                    )
                  })}
                </div>
              </div>

              {selectedSlot && (
                <div className="rounded-2xl border-2 border-emerald-400 bg-emerald-50 p-5">
                  <p className="text-sm font-bold text-emerald-800">📍 Bạn đã chọn cụm <strong>{selectedSlot}</strong></p>
                  <p className="text-xs text-emerald-700 mt-2">Cụm này có 20 chỗ đỗ (sắp xếp 4 hàng × 5 ô)</p>

                  {/* Hiển thị chi tiết 20 ô trong cụm */}
                  <div className="mt-4 grid gap-2" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
                    {Array.from({ length: 20 }).map((_, i) => (
                      <div key={i} className="flex items-center justify-center rounded-lg bg-white border-2 border-emerald-400 py-2 text-xs font-bold text-emerald-800">
                        {selectedSlot}.{i + 1}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                if (selectedSlot) {
                  setSelectedSlot(null)
                } else if (selectedZone) {
                  setSelectedZone(null)
                } else {
                  handleReset()
                }
              }}
              className="rounded-2xl border border-slate-300 bg-white px-4 py-3.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
            >
              ← Quay lại
            </button>
            {selectedSlot && (
              <button
                type="button"
                onClick={handleConfirm}
                className="flex-1 rounded-2xl bg-emerald-600 px-4 py-3.5 text-sm font-bold text-white hover:bg-emerald-700 active:scale-95"
              >
                ✔ Xác nhận chọn {selectedSlot}
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border-2 border-emerald-400 bg-emerald-50 p-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600 text-2xl text-white shadow-lg mx-auto">
            ✓
          </div>
          <h3 className="mt-4 text-xl font-extrabold text-emerald-950">XÁC NHẬN VỊ TRÍ THÀNH CÔNG!</h3>
          <p className="mt-2 text-sm text-emerald-800">Thẻ: <strong>{ticketId}</strong> | Vị trí: <strong>{selectedSlot}</strong></p>
          <button
            type="button"
            onClick={handleReset}
            className="mt-4 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700"
          >
            Tiếp tục
          </button>
        </div>
      )}
    </ScreenFrame>
  )
}

/* =========================================================================
   5. TRA CỨU VỊ TRÍ XE (CHECK-POSITION SCREEN)
   ========================================================================= */
function CheckPositionScreen() {
  const [cardScanned, setCardScanned] = useState(false)
  const [ticketId, setTicketId] = useState('#P-8821')
  const [carPosition, setCarPosition] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleScanCard = async () => {
    setLoading(true)
    try {
      const response = await parkingAPI.getPositionByTicket(ticketId)
      setCarPosition(response)
      setCardScanned(true)
    } catch (error) {
      console.error('Error fetching position:', error)
      // Fallback: generate position based on ticket ID
      const hash = ticketId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
      const zones = ['A', 'B', 'C', 'D']
      const zone = zones[hash % 4]
      const cluster = (hash % 6) + 1
      const slot = (hash % 20) + 1
      
      setCarPosition({
        floor: 'B2',
        zone: zone,
        cluster: `${zone}${cluster}`,
        slot: `${zone}${cluster}.${slot}`,
        licensePlate: '52-F1 888.88',
        entryTime: new Date().toLocaleTimeString('vi-VN')
      })
      setCardScanned(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScreenFrame title="Tra cứu vị trí xe đỗ bằng Thẻ (Check-Position)" subtitle="Kiosk tìm xe / Quẹt thẻ để hiện vị trí">
      {!cardScanned ? (
        <div className="my-8 flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-emerald-300 bg-emerald-50/40 p-8 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-600 text-3xl text-white shadow-lg">
            💳
          </div>
          <h3 className="mt-4 text-xl font-extrabold text-slate-900">VUI LÒNG QUẸT THẺ GỬI XE VÀO MÁY KIOSK</h3>
          <p className="mt-1 max-w-md text-sm text-slate-600">
            Đưa thẻ gửi xe lại gần vùng cảm biến hoặc nhập mã thẻ & bấm nút bên dưới để hệ thống định vị vị trí xe đỗ của bạn.
          </p>
          <input
            type="text"
            value={ticketId}
            onChange={(e) => setTicketId(e.target.value.toUpperCase())}
            placeholder="#P-8821"
            className="mt-4 px-4 py-2 border border-slate-300 rounded-lg text-center font-mono text-sm w-32"
          />
          <button
            type="button"
            onClick={handleScanCard}
            disabled={loading}
            className="mt-6 rounded-2xl bg-emerald-600 px-6 py-3.5 text-sm font-extrabold text-white shadow-lg transition hover:bg-emerald-700 active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Đang tìm kiếm...' : 'QUẸT THẺ (GIẢ LẬP TRA CỨU)'}
          </button>
        </div>
      ) : (
        <div>
          <div className="mb-6 rounded-2xl border border-emerald-400 bg-emerald-500 p-4 text-white shadow-md">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-100">KẾT QUẢ TRA CỨU THẺ {ticketId}</p>
                <h3 className="text-lg font-extrabold">### Xe của bạn đang đỗ tại: TẦNG {carPosition?.floor || 'B2'} - KHU {carPosition?.zone || 'A'} - Cụm VỊ TRÍ {carPosition?.cluster || 'A1'} - Ô VỊ TRÍ {carPosition?.slot || 'A1.1'}</h3>
                <p className="text-xs text-emerald-100 mt-0.5">Biển số: <strong>{carPosition?.licensePlate || '52-F1 888.88'}</strong> | Thời gian gửi: {carPosition?.entryTime || '16:20:10'}</p>
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

          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Sơ đồ các khu vực (6 cụm/khu):</h3>
            <div className="grid gap-4 md:grid-cols-4">
              {['A', 'B', 'C', 'D'].map((zone) => (
                <div key={zone}>
                  <p className="text-sm font-bold text-slate-700 mb-2">Khu {zone}</p>
                  <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                    {Array.from({ length: 6 }).map((_, i) => {
                      const cluster = `${zone}${i + 1}`
                      const hasCarCluster = cluster === carPosition?.cluster
                      return (
                        <div
                          key={cluster}
                          className={`flex items-center justify-center rounded-lg py-3 px-2 text-xs font-bold transition ${
                            hasCarCluster
                              ? 'bg-emerald-600 text-white border-2 border-emerald-700 ring-2 ring-emerald-300'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          {hasCarCluster && <span className="mr-1">🚗</span>}
                          {cluster}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border-2 border-emerald-500 bg-white p-5 shadow-lg">
            <div className="mb-4 flex items-center justify-between border-b border-emerald-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-xs font-bold text-white">{carPosition?.zone || 'A'}</span>
                <h4 className="text-base font-extrabold text-emerald-900">KHU {carPosition?.zone || 'A'} - CHI TIẾT CỤM {carPosition?.cluster || 'A1'}</h4>
              </div>
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                Xe ở: {carPosition?.slot || 'A1.1'}
              </span>
            </div>

            <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
              {Array.from({ length: 20 }).map((_, i) => {
                const slotNum = `${carPosition?.cluster || 'A1'}.${i + 1}`
                const isCarSpot = slotNum === carPosition?.slot
                
                if (isCarSpot) {
                  return (
                    <div
                      key={slotNum}
                      className="flex flex-col items-center justify-center rounded-lg bg-emerald-600 p-2 text-white shadow-md ring-4 ring-emerald-300 animate-bounce"
                    >
                      <span className="text-lg">🚗</span>
                      <span className="text-xs font-extrabold">{slotNum}</span>
                    </div>
                  )
                }

                return (
                  <div
                    key={slotNum}
                    className="flex items-center justify-center rounded-lg bg-slate-100 p-2 text-xs font-bold text-slate-600 border border-slate-200"
                  >
                    {slotNum}
                  </div>
                )
              })}
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">📍 VỊ TRÍ HIỆN TẠI</p>
            <p className="text-base font-bold text-slate-900">Kiosk Tra cứu Lối vào Tầng {carPosition?.floor || 'B2'} (Kiosk #01)</p>
            <p className="mt-1 text-xs text-slate-600">
              <strong>Hướng dẫn:</strong> Từ Kiosk đi thẳng 15m → Rẽ phải vào Khu {carPosition?.zone || 'A'} → Ô đỗ {carPosition?.slot || 'A1.1'} bên tay trái (~25m).
            </p>
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
      <div className="mb-6 grid grid-cols-3 gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2 text-center text-xs font-bold">
        {[
          ['1. Quẹt thẻ', 'tap_card'],
          ['2. Thanh toán', 'pay'],
          ['3. Mở Barie', 'success'],
        ].map(([label, sId], idx) => {
          const isCurrent = step === sId
          const stepOrder: CheckoutStep[] = ['tap_card', 'pay', 'success']
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
            QUẸT THẺ (#P-8821) →
          </button>
        </div>
      )}

      {step === 'pay' && (
        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-5 flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div>
                <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Thông tin phiếu gửi xe</h3>
                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-slate-500">Mã thẻ:</span><span className="font-mono font-bold text-slate-900">#P-8821</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Biển số:</span><span className="font-mono font-bold text-emerald-700">52-F1 888.88</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Vị trí:</span><span className="font-semibold text-slate-800">Tầng B2 - Khu C (C4)</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Vào lúc:</span><span className="font-mono text-slate-700">16:20</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Ra lúc:</span><span className="font-mono text-slate-700">19:45</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Thời lượng:</span><span className="font-semibold text-slate-800">3h 25m</span></div>
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-center">
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">Tổng tiền</p>
                <p className="mt-1 text-3xl font-black text-emerald-700 font-mono">4.000 VNĐ</p>
              </div>
            </div>

            <div className="lg:col-span-7 rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="mb-5 flex rounded-xl bg-slate-200/70 p-1 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setMethod('qr')}
                    className={`flex-1 rounded-lg py-2.5 transition ${
                      method === 'qr' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                    }`}
                  >
                    📱 QR Code
                  </button>
                  <button
                    type="button"
                    onClick={() => setMethod('card')}
                    className={`flex-1 rounded-lg py-2.5 transition ${
                      method === 'card' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                    }`}
                  >
                    💳 Thẻ POS
                  </button>
                </div>

                {method === 'qr' && (
                  <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-5 border border-slate-200 text-center">
                    <p className="text-sm font-extrabold text-slate-900">Mở App quét mã này</p>
                    <div className="my-3 flex items-center justify-center rounded-2xl border-2 border-dashed border-emerald-400 bg-emerald-50/50 p-4">
                      <div className="w-44 rounded-xl border border-slate-300 bg-white p-3">
                        <div className="grid grid-cols-8 gap-1">
                          {Array.from({ length: 64 }).map((_, i) => (
                            <div key={i} className={`h-2.5 rounded-[1px] ${i % 3 === 0 ? 'bg-slate-900' : 'bg-slate-100'}`} />
                          ))}
                        </div>
                        <p className="mt-2 font-mono text-[9px] font-bold text-slate-600">PARKING-4K</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500">Số tiền: <strong>4.000 VNĐ</strong></p>
                  </div>
                )}

                {method === 'card' && (
                  <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-8 border border-slate-200 text-center">
                    <div className="text-4xl">💳</div>
                    <p className="mt-3 text-base font-bold text-slate-900">CHẠM THẺ POS</p>
                    <p className="mt-1 text-xs text-slate-500">Chạm thẻ Visa/ATM vào thiết bị POS</p>
                  </div>
                )}
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep('tap_card')}
                  className="rounded-2xl border border-slate-300 bg-white px-4 py-3.5 text-xs font-bold text-slate-700"
                >
                  ← Quẹt khác
                </button>
                <button
                  type="button"
                  onClick={() => setStep('success')}
                  className="flex-1 rounded-2xl bg-emerald-600 py-3.5 text-sm font-black text-white hover:bg-emerald-700"
                >
                  XÁC NHẬN & MỞ BARIE ✔
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 'success' && (
        <div className="rounded-3xl border border-emerald-300 bg-emerald-50 p-6 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-600 text-4xl text-white shadow-lg">
            ✓
          </div>
          <h3 className="mt-4 text-2xl font-extrabold text-emerald-950">THANH TOÁN THÀNH CÔNG!</h3>
          <p className="mt-1 text-sm text-emerald-800">Số tiền: <strong>4.000 VNĐ</strong> | Mã GD: TX-2026-00431</p>

          <div className="my-6 rounded-2xl border-2 border-emerald-500 bg-emerald-600 p-4 text-white shadow-lg animate-pulse">
            <p className="text-xl font-extrabold tracking-wide">🚧 CỔNG BARIE ĐÃ MỞ!</p>
          </div>

          <button
            type="button"
            onClick={() => setStep('tap_card')}
            className="rounded-xl bg-slate-900 px-6 py-3 text-xs font-bold text-white hover:bg-black"
          >
            Quay về
          </button>
        </div>
      )}
    </ScreenFrame>
  )
}

/* =========================================================================
   MAIN APP
   ========================================================================= */
export default function App() {
  const [activeScreen, setActiveScreen] = useState<Screen>('overview')
  const [floors, setFloors] = useState<FloorDisplay[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadFloors = async () => {
      try {
        const data = await parkingAPI.getFloors()
        const displayFloors: FloorDisplay[] = data.map((f) => ({
          id: f.id,
          name: f.name,
          type: 'Xe máy',
          used: f.occupied,
          total: 120, // 120 chỗ/tầng (thay vì capacity từ backend)
          status: getFloorStatus((f.occupied / 120) * 100),
        }))
        setFloors(displayFloors)
      } catch (error) {
        console.error('Error loading floors:', error)
        setFloors([
          { id: 'B1', name: 'Tầng B1', type: 'Xe máy', used: 45, total: 120, status: 'ok' },
          { id: 'B2', name: 'Tầng B2', type: 'Xe máy', used: 32, total: 120, status: 'ok' },
          { id: 'B3', name: 'Tầng B3', type: 'Xe máy', used: 100, total: 120, status: 'warn' },
          { id: 'B4', name: 'Tầng B4', type: 'Xe máy', used: 25, total: 120, status: 'ok' },
          { id: 'B5', name: 'Tầng B5', type: 'Xe máy', used: 95, total: 120, status: 'warn' },
          { id: 'B6', name: 'Tầng B6', type: 'Xe máy', used: 110, total: 120, status: 'full' },
        ])
      } finally {
        setLoading(false)
      }
    }
    loadFloors()
  }, [])

  const screenMap: Record<Screen, React.ReactNode> = {
    overview: <OverviewScreen floors={floors} />,
    ticket: <TicketScreen />,
    floormap: <FloorMapScreen />,
    saveposition: <SavePositionScreen />,
    checkposition: <CheckPositionScreen />,
    payment: <PaymentScreen />,
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_10%_10%,#ecfdf5_0%,#f0fdf4_36%,#f8fafc_70%)] text-slate-900 font-sans">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-700">Parking Kiosk HCI System</p>
            <h1 className="text-sm font-bold text-slate-900 sm:text-base font-grotesk">
              Hệ thống Gửi xe Thông minh - Prototype v1.0
            </h1>
          </div>
          <span className="rounded-full border border-emerald-300 bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
            🚀 Live
          </span>
        </div>
      </header>

      <nav className="border-b border-slate-200/80 bg-white/60 backdrop-blur-sm overflow-x-auto">
        <div className="mx-auto flex w-full max-w-6xl gap-2 px-4 py-3 sm:px-6">
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
                    : 'bg-white text-slate-700 hover:bg-emerald-50 border border-slate-200'
                }`}
              >
                <p className="text-xs font-bold">{s.label}</p>
                <p className={`text-[10px] ${active ? 'text-emerald-100' : 'text-slate-400'}`}>{s.sub}</p>
              </button>
            )
          })}
        </div>
      </nav>

      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block text-4xl">⏳ Đang tải...</div>
          </div>
        ) : (
          screenMap[activeScreen]
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white/60 py-4 text-center text-xs font-medium text-slate-500">
        Bản Prototype HCI Chuẩn hóa • Nhấn các Tab menu để tương tác các màn hình
      </footer>
    </div>
  )
}
