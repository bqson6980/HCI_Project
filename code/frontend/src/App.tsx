import { useState, useEffect, useMemo, useCallback } from 'react'
import parkingAPI from './services/api'

type Screen = 'overview' | 'ticket' | 'floormap' | 'saveposition' | 'checkposition' | 'payment'

const SCREENS: { id: Screen; label: string; sub: string }[] = [
  { id: 'overview', label: '1. Tổng quan', sub: 'Công suất & Chỗ trống B1-B6' },
  { id: 'ticket', label: '2. Nhận thẻ', sub: 'Vào bãi & Cấp thẻ tự động' },
  { id: 'floormap', label: '3. Sơ đồ tầng', sub: 'Sơ đồ trực quan A-B-C-D' },
  { id: 'saveposition', label: '4. Lưu vị trí xe', sub: 'Ghi nhận Block đỗ xe' },
  { id: 'checkposition', label: '5. Tra cứu vị trí', sub: 'Tìm xe bằng thẻ gửi' },
  { id: 'payment', label: '6. Thanh toán', sub: 'Thanh toán & Mở barie' },
]

type FloorId = 'B1' | 'B2' | 'B3' | 'B4' | 'B5' | 'B6'
type ZoneId = 'A' | 'B' | 'C' | 'D'

interface Block {
  id: string
  index: number
  name: string
  available: number
  capacity: number
}

interface Zone {
  id: ZoneId
  name: string
  blocks: Block[]
}

interface FloorDetail {
  id: FloorId
  name: string
  type: string
  zones: Zone[]
}

interface ActiveTicket {
  id: string
  licensePlate: string
  carModel: string
  entryTime: Date
  floorId: FloorId
  zoneId?: ZoneId
  blockId?: string
  fee: number
  status: 'PARKED' | 'PAID'
}

interface MockCar {
  licensePlate: string
  carModel: string
  color: string
  camId: string
}

const MOCK_INCOMING_CARS: MockCar[] = [
  { licensePlate: '52-F1 888.88', carModel: 'Honda SH 150i', color: 'Đỏ Candy', camId: 'CAM-GATE-01' },
  { licensePlate: '59-P2 777.77', carModel: 'Vespa Sprint 125', color: 'Trắng Sứ', camId: 'CAM-GATE-02' },
  { licensePlate: '60-B9 666.66', carModel: 'Honda Winner X', color: 'Đen Nhám', camId: 'CAM-GATE-01' },
  { licensePlate: '51-K3 999.99', carModel: 'Honda Air Blade 160', color: 'Xám Xi Măng', camId: 'CAM-GATE-03' },
  { licensePlate: '43-D1 555.55', carModel: 'Honda Vision 110', color: 'Xanh Navy', camId: 'CAM-GATE-01' },
  { licensePlate: '29-S1 234.56', carModel: 'Yamaha Grande Hybrid', color: 'Hồng Pastel', camId: 'CAM-GATE-02' },
]

function createInitialFloorDetails(): FloorDetail[] {
  const floorIds: FloorId[] = ['B1', 'B2', 'B3', 'B4', 'B5', 'B6']
  const zoneIds: ZoneId[] = ['A', 'B', 'C', 'D']

  const initialBlockCounts: Record<ZoneId, number[]> = {
    A: [5, 2, 3, 4, 1, 5],
    B: [2, 3, 5, 4, 1, 2],
    C: [1, 0, 3, 2, 4, 1],
    D: [2, 1, 4, 6, 3, 2],
  }

  return floorIds.map((fId) => ({
    id: fId,
    name: `Tầng ${fId}`,
    type: 'Xe máy',
    zones: zoneIds.map((zId) => ({
      id: zId,
      name: `Khu ${zId}`,
      blocks: Array.from({ length: 6 }, (_, bIdx) => {
        const blockIndex = bIdx + 1
        const blockId = `${zId}${blockIndex}`
        let freeCount = initialBlockCounts[zId][bIdx]

        if (fId === 'B4') {
          freeCount = 0
        } else if (fId === 'B3' || fId === 'B6') {
          freeCount = 16
        }

        return {
          id: blockId,
          index: blockIndex,
          name: `Block ${blockId}`,
          available: freeCount,
          capacity: 20,
        }
      }),
    })),
  }))
}

const INITIAL_TICKETS: ActiveTicket[] = [
  {
    id: '#P-8821',
    licensePlate: '52-F1 888.88',
    carModel: 'Honda SH 150i',
    entryTime: new Date(Date.now() - 3 * 3600000 - 25 * 60000),
    floorId: 'B2',
    zoneId: 'C',
    blockId: 'C4',
    fee: 4000,
    status: 'PARKED',
  },
  {
    id: '#P-8822',
    licensePlate: '59-P2 777.77',
    carModel: 'Vespa Sprint 125',
    entryTime: new Date(Date.now() - 1 * 3600000 - 10 * 60000),
    floorId: 'B1',
    zoneId: 'A',
    blockId: 'A1',
    fee: 4000,
    status: 'PARKED',
  },
]

function statusBadge(percent: number, free: number) {
  if (free === 0 || percent >= 95) return { label: 'ĐẦY', bg: 'bg-rose-500 text-white border-rose-600' }
  if (percent >= 80) return { label: 'GẦN ĐẦY', bg: 'bg-amber-400 text-amber-950 border-amber-500' }
  return { label: 'CÒN TRỐNG', bg: 'bg-emerald-500 text-white border-emerald-600' }
}

function statusBarBg(percent: number, free: number) {
  if (free === 0 || percent >= 95) return 'bg-rose-500'
  if (percent >= 80) return 'bg-amber-400'
  return 'bg-emerald-500'
}

function ScreenFrame({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl sm:p-7">
      <div className="mb-6 border-b border-slate-200 pb-4">
        {subtitle && (
          <span className="inline-block rounded-md bg-emerald-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-800">
            {subtitle}
          </span>
        )}
        <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          {title}
        </h2>
      </div>
      {children}
    </section>
  )
}

function OverviewScreen({
  floors,
  onSelectFloor,
  onNavigate,
}: {
  floors: FloorDetail[]
  onSelectFloor: (fId: FloorId) => void
  onNavigate: (s: Screen) => void
}) {
  const floorStats = useMemo(() => {
    return floors.map((f) => {
      let total = 0
      let free = 0
      f.zones.forEach((z) => {
        z.blocks.forEach((b) => {
          total += b.capacity
          free += b.available
        })
      })
      const used = total - free
      const percent = total > 0 ? Math.round((used / total) * 100) : 0
      return { ...f, total, used, free, percent }
    })
  }, [floors])

  const totalSlots = floorStats.reduce((acc, f) => acc + f.total, 0)
  const totalUsed = floorStats.reduce((acc, f) => acc + f.used, 0)
  const totalFree = totalSlots - totalUsed
  const overallPercent = totalSlots > 0 ? Math.round((totalUsed / totalSlots) * 100) : 0

  return (
    <ScreenFrame title="Tổng quan chỗ trống gửi xe (Hầm B1 - B6)" subtitle="Cập nhật theo thời gian thực">
      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Tổng sức chứa</p>
          <p className="mt-1 text-2xl font-extrabold text-slate-900">
            {totalSlots.toLocaleString()} <span className="text-sm font-normal text-slate-500">chỗ</span>
          </p>
        </div>
        <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-rose-700">Đã sử dụng</p>
          <p className="mt-1 text-2xl font-extrabold text-rose-700">
            {totalUsed.toLocaleString()}{' '}
            <span className="text-sm font-normal text-rose-600">chỗ ({overallPercent}%)</span>
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
        {floorStats.map((f) => {
          const badge = statusBadge(f.percent, f.free)

          return (
            <div
              key={f.id}
              onClick={() => {
                onSelectFloor(f.id)
                onNavigate('floormap')
              }}
              className="group flex cursor-pointer flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-emerald-500 hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-3.5 min-w-[140px]">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-lg font-black text-white group-hover:bg-emerald-600 transition sm:h-14 sm:w-14 sm:text-xl">
                  {f.id}
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700">{f.name}</h3>
                  <p className="text-xs text-slate-500">{f.type} (4 Khu • 24 Block) →</p>
                </div>
              </div>

              <div className="flex-1 max-w-lg">
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">
                    Còn trống: <strong className="text-slate-900 font-bold">{f.free}</strong> / {f.total} chỗ
                  </span>
                  <span className="text-slate-500 font-medium">{f.percent}% đã dùng</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 border border-slate-200">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${statusBarBg(f.percent, f.free)}`}
                    style={{ width: `${f.percent}%` }}
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

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-semibold text-slate-700">
        <div className="flex flex-wrap items-center gap-6">
          <span className="flex items-center gap-2">
            <span className="h-3.5 w-3.5 rounded-full bg-emerald-500" /> Còn trống
          </span>
          <span className="flex items-center gap-2">
            <span className="h-3.5 w-3.5 rounded-full bg-amber-400" /> Gần đầy
          </span>
          <span className="flex items-center gap-2">
            <span className="h-3.5 w-3.5 rounded-full bg-rose-500" /> Đã đầy
          </span>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('ticket')}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-emerald-700"
        >
          Gửi xe vào bãi →
        </button>
      </div>
    </ScreenFrame>
  )
}

function TicketScreen({
  floors,
  onIssueTicket,
  onNavigateToFloorMap,
  onNavigateToSavePosition,
}: {
  floors: FloorDetail[]
  onIssueTicket: (vehicle: MockCar, floorId: FloorId) => Promise<ActiveTicket>
  onNavigateToFloorMap: (floorId: FloorId, ticket: ActiveTicket) => void
  onNavigateToSavePosition: (floorId: FloorId, ticket: ActiveTicket) => void
}) {
  const [currentVehicle, setCurrentVehicle] = useState<MockCar | null>(null)
  const [issuedTicket, setIssuedTicket] = useState<ActiveTicket | null>(null)
  const [showFloorModal, setShowFloorModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const floorAvailabilities = useMemo(() => {
    return floors.map((f) => {
      let total = 0
      let free = 0
      f.zones.forEach((z) => {
        z.blocks.forEach((b) => {
          total += b.capacity
          free += b.available
        })
      })
      return { id: f.id, name: f.name, free, total }
    })
  }, [floors])

  const handleOpenReceiveCardModal = () => {
    const randomCar = MOCK_INCOMING_CARS[Math.floor(Math.random() * MOCK_INCOMING_CARS.length)]
    setCurrentVehicle(randomCar)
    setIssuedTicket(null)
    setShowFloorModal(true)
  }

  const handleSelectFloor = async (floorId: FloorId) => {
    if (isSubmitting || !currentVehicle) return
    setIsSubmitting(true)
    try {
      const ticket = await onIssueTicket(currentVehicle, floorId)
      setIssuedTicket(ticket)
      setShowFloorModal(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResetForNextCar = () => {
    setCurrentVehicle(null)
    setIssuedTicket(null)
  }

  return (
    <ScreenFrame title="Nhận thẻ khi gửi xe vào bãi" subtitle="Cổng vào / Nhận diện phương tiện tự động">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Nhận diện phương tiện (ANPR)</span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Camera Active
            </span>
          </div>

          {currentVehicle ? (
            <div className="rounded-xl border border-emerald-300 bg-emerald-50/70 p-4 text-center shadow-inner">
              <p className="text-xs font-semibold text-emerald-800">Biển số phát hiện tại làn quét:</p>
              <p className="mt-1 text-3xl font-extrabold tracking-wider text-slate-900 font-mono">
                {currentVehicle.licensePlate}
              </p>
              <p className="mt-1 text-xs text-slate-600">
                Dòng xe: <strong className="text-slate-900">{currentVehicle.carModel}</strong> ({currentVehicle.color})
              </p>
              <p className="mt-1 text-xs font-medium text-slate-600">
                Thời gian vào: <span className="font-mono font-bold text-slate-900">{new Date().toLocaleTimeString('vi-VN')}</span>
              </p>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center shadow-inner">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-2xl">
                📷
              </div>
              <p className="mt-2 text-sm font-bold text-slate-700">LÀN QUÉT XE ĐANG CHỜ</p>
              <p className="mt-1 text-xs text-slate-500">
                Vui lòng nhấn nút <strong>"NHẤN NÚT LẤY THẺ"</strong> để quét xe và nhận thẻ vào bãi.
              </p>
            </div>
          )}

          <div className="mt-4 overflow-hidden rounded-xl border border-slate-800 bg-slate-950 text-slate-200">
            <div className="flex items-center justify-between border-b border-slate-800 px-3 py-2 text-[11px] font-mono text-emerald-400">
              <span>{currentVehicle ? currentVehicle.camId : 'CAM-GATE-01'}</span>
              <span>LIVE 1080P</span>
            </div>
            <div className="relative flex h-40 items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 p-4">
              {currentVehicle ? (
                <div className="rounded-lg border-2 border-emerald-400/80 bg-black/70 px-5 py-3 text-center backdrop-blur">
                  <p className="text-xs font-mono text-emerald-300">ANPR MATCH 99.8%</p>
                  <p className="text-2xl font-bold font-mono text-white tracking-wider">{currentVehicle.licensePlate}</p>
                  <p className="text-[11px] text-slate-300 font-mono mt-0.5">{currentVehicle.carModel}</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="h-10 w-10 rounded-full border-2 border-emerald-500/40 border-t-emerald-400 animate-spin mb-2" />
                  <p className="text-xs font-mono text-slate-400">CHỜ PHƯƠNG TIỆN TIẾN VÀO LÀN...</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5">
          <div>
            <h3 className="text-base font-bold text-slate-900">Bảng giá gửi xe theo khung giờ</h3>
            <p className="text-xs text-slate-500">Áp dụng cho xe máy & ô tô vãng lai</p>

            <div className="mt-3 divide-y divide-slate-100 rounded-xl border border-slate-200 bg-slate-50/50">
              {[
                ['Khung 0 - 4 giờ', '4.000 VNĐ'],
                ['Khung 4 - 12 giờ', '8.000 VNĐ'],
                ['Qua đêm (> 12 giờ)', '15.000 VNĐ'],
                ['Vé tháng cư dân', '120.000 VNĐ / tháng'],
              ].map(([time, fee]) => (
                <div key={time} className="flex items-center justify-between px-3.5 py-2.5 text-xs">
                  <span className="font-medium text-slate-700">{time}</span>
                  <span className="font-mono font-bold text-emerald-700">{fee}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50/40 p-3 text-xs text-emerald-900">
              💡 <strong>Hướng dẫn:</strong> Nhấn nút bên dưới để chọn tầng gửi xe. Thẻ phát ra sẽ được gắn với tầng bạn đã chọn.
            </div>
          </div>

          <div className="mt-5">
            {!issuedTicket ? (
              <button
                type="button"
                onClick={handleOpenReceiveCardModal}
                className="w-full rounded-2xl bg-emerald-600 py-4 text-base font-extrabold text-white shadow-lg transition hover:bg-emerald-700 active:scale-95"
              >
                PRESS TO RECEIVE CARD / NHẤN NÚT LẤY THẺ
              </button>
            ) : (
              <div className="rounded-2xl border-2 border-emerald-500 bg-emerald-50 p-4 text-center shadow-md">
                <p className="text-base font-black text-emerald-900">✅ THẺ ĐÃ PHÁT THÀNH CÔNG!</p>
                <div className="my-2 rounded-xl bg-white p-3 border border-emerald-200 text-xs">
                  <p>Mã thẻ: <strong className="font-mono text-lg text-emerald-700">{issuedTicket.id}</strong></p>
                  <p className="mt-0.5">Biển số: <strong>{issuedTicket.licensePlate}</strong> | Tầng đăng ký: <strong className="text-slate-900 font-black text-sm">{issuedTicket.floorId}</strong></p>
                  <p className="text-[11px] text-slate-500 mt-1">Barie cổng vào đã mở. Chúc quý khách gửi xe an toàn.</p>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  <button
                    type="button"
                    onClick={() => onNavigateToSavePosition(issuedTicket.floorId, issuedTicket)}
                    className="flex-1 rounded-xl bg-emerald-600 py-3 text-xs font-black text-white shadow hover:bg-emerald-700 active:scale-95"
                  >
                    Lưu vị trí đỗ xe tại Tầng {issuedTicket.floorId} →
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigateToFloorMap(issuedTicket.floorId, issuedTicket)}
                    className="rounded-xl border border-emerald-400 bg-emerald-50 px-3 py-3 text-xs font-bold text-emerald-800 hover:bg-emerald-100"
                  >
                    Sơ đồ {issuedTicket.floorId}
                  </button>
                  <button
                    type="button"
                    onClick={handleResetForNextCar}
                    className="rounded-xl border border-slate-300 bg-white px-3 py-3 text-xs font-bold text-slate-700 hover:bg-slate-100"
                  >
                    Lượt tiếp ↺
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showFloorModal && currentVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-lg font-black text-slate-900">CHỌN TẦNG GỬI XE</h3>
                <p className="text-xs text-slate-500">
                  Biển số: <strong className="text-slate-900 font-mono">{currentVehicle.licensePlate}</strong> ({currentVehicle.carModel})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowFloorModal(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 my-4">
              Vui lòng chọn tầng còn chỗ bên dưới để nhận thẻ:
            </p>

            <div className="grid grid-cols-3 gap-3">
              {floorAvailabilities.map((fa) => {
                const isFull = fa.free === 0
                return (
                  <button
                    key={fa.id}
                    type="button"
                    disabled={isFull || isSubmitting}
                    onClick={() => handleSelectFloor(fa.id as FloorId)}
                    className={`flex flex-col items-center justify-center rounded-2xl p-4 text-center transition border shadow-xs ${
                      isFull
                        ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                        : 'bg-emerald-50/60 border-emerald-300 text-slate-900 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 active:scale-95'
                    }`}
                  >
                    <span className="text-lg font-black">{fa.id}</span>
                    <span className="text-[11px] font-semibold mt-1">
                      {isFull ? 'HẾT CHỖ' : `Còn ${fa.free} chỗ`}
                    </span>
                  </button>
                )
              })}
            </div>

            <div className="mt-5 text-right">
              <button
                type="button"
                onClick={() => setShowFloorModal(false)}
                className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100"
              >
                Hủy bỏ
              </button>
            </div>
          </div>
        </div>
      )}
    </ScreenFrame>
  )
}

function FloorMapScreen({
  floors,
  currentFloorId,
  onNavigateToOverview,
  onNavigateToSavePosition,
  onNavigateToCheckPosition,
}: {
  floors: FloorDetail[]
  currentFloorId: FloorId
  onNavigateToOverview: () => void
  onNavigateToSavePosition: () => void
  onNavigateToCheckPosition: () => void
}) {
  const currentFloor = floors.find((f) => f.id === currentFloorId) || floors[1]

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl sm:p-7">
      <div className="mb-6 border-b border-slate-200 pb-4">
        <span className="inline-block rounded-md bg-emerald-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-800">
          BÃI XE / KHU VỰC VÀ CHỖ TRỐNG
        </span>
        <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Sơ đồ chi tiết tầng
        </h2>
      </div>

      <div className="rounded-3xl border border-slate-200/80 bg-slate-50/40 p-6 shadow-inner">
        <div className="text-center mb-6">
          <h3 className="text-3xl font-extrabold tracking-tight text-slate-900">
            {currentFloor.name.toUpperCase()}
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Sơ đồ chi tiết khu vực A - B - C - D
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {currentFloor.zones.map((zone) => (
            <div
              key={zone.id}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs"
            >
              <h4 className="text-xl font-extrabold text-slate-900 text-center mb-4">
                {zone.id}
              </h4>

              <div className="grid grid-cols-3 gap-3">
                {zone.blocks.map((block) => {
                  const isFull = block.available === 0

                  return (
                    <div
                      key={block.id}
                      onClick={onNavigateToSavePosition}
                      className={`flex h-14 cursor-pointer flex-col items-center justify-center rounded-2xl text-xs font-extrabold transition shadow-xs hover:scale-105 ${
                        isFull
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : 'bg-emerald-100 text-emerald-900 border border-emerald-200 hover:bg-emerald-200/80'
                      }`}
                    >
                      <span>{block.available}/{block.capacity}</span>
                      <span className="text-[9px] font-medium opacity-80">{block.id}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-3.5 text-center text-xs font-bold text-slate-700 shadow-xs flex items-center justify-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-xs">
            ℹ
          </span>
          <span>YOU ARE HERE (Vị trí của bạn)</span>
        </div>

        <div className="mt-4 flex items-center justify-center gap-6 text-xs font-semibold text-slate-600">
          <span className="flex items-center gap-2">
            <span className="h-3 w-4 rounded-md bg-emerald-200 border border-emerald-300" /> Còn trống
          </span>
          <span className="flex items-center gap-2">
            <span className="h-3 w-4 rounded-md bg-rose-200 border border-rose-300" /> Đã đầy
          </span>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={onNavigateToOverview}
            className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-100"
          >
            ← Quay về tổng quan
          </button>
          <button
            type="button"
            onClick={onNavigateToSavePosition}
            className="rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-emerald-700"
          >
            Lưu vị trí xe →
          </button>
          <button
            type="button"
            onClick={onNavigateToCheckPosition}
            className="rounded-xl border border-emerald-500 bg-white px-5 py-2.5 text-xs font-bold text-emerald-800 shadow-xs hover:bg-emerald-50"
          >
            Tra cứu vị trí
          </button>
        </div>
      </div>
    </section>
  )
}

function SavePositionScreen({
  floors,
  currentFloorId,
  activeTicket,
  onSaveBlock,
  onNavigateToCheckPosition,
}: {
  floors: FloorDetail[]
  currentFloorId: FloorId
  activeTicket: ActiveTicket | null
  onSaveBlock: (ticketId: string, floorId: FloorId, zoneId: ZoneId, blockId: string) => Promise<void>
  onNavigateToCheckPosition: () => void
}) {
  const currentFloor = floors.find((f) => f.id === currentFloorId) || floors[0]
  const [selectedZoneId, setSelectedZoneId] = useState<ZoneId>('C')
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(activeTicket?.blockId || null)
  const [isSaving, setIsSaving] = useState(false)

  const isAlreadySaved = Boolean(activeTicket?.blockId)
  const activeZone = currentFloor.zones.find((z) => z.id === selectedZoneId) || currentFloor.zones[0]

  const handleSelectBlock = (block: Block) => {
    if (isAlreadySaved) return
    if (block.available === 0) return
    setSelectedBlockId(block.id)
  }

  const handleConfirmSaveBlock = async () => {
    if (!selectedBlockId || isSaving || isAlreadySaved) return
    setIsSaving(true)
    try {
      const ticketToUse = activeTicket || INITIAL_TICKETS[0]
      await onSaveBlock(ticketToUse.id, currentFloor.id, selectedZoneId, selectedBlockId)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <ScreenFrame title={`Lưu vị trí đỗ xe — ${currentFloor.name}`} subtitle="Chọn Phân khu & Block để ghi nhận vị trí đỗ">
      {activeTicket && (
        <div className={`mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-4 text-xs font-bold ${
          isAlreadySaved
            ? 'border-emerald-400 bg-emerald-50 text-emerald-950 shadow-sm'
            : 'border-emerald-300 bg-emerald-50/70 text-emerald-900'
        }`}>
          <div>
            <p className="text-sm font-black">
              Xe đang gửi: {activeTicket.licensePlate} ({activeTicket.carModel})
            </p>
            <p className="mt-0.5 text-emerald-700 font-medium">
              Mã vé: <strong className="font-mono">{activeTicket.id}</strong> | Tầng đăng ký: <strong className="text-slate-900">{activeTicket.floorId}</strong>
            </p>
          </div>
          {isAlreadySaved ? (
            <span className="rounded-full bg-emerald-600 px-3.5 py-1.5 text-white font-black text-xs shadow-xs">
              ✓ ĐÃ LƯU TẠI BLOCK {activeTicket.blockId}
            </span>
          ) : (
            <span className="rounded-full bg-emerald-200 px-3 py-1 text-emerald-950 font-bold">
              Vui lòng chọn Block bên dưới và bấm xác nhận
            </span>
          )}
        </div>
      )}

      {isAlreadySaved && (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 border-emerald-500 bg-emerald-100/70 p-4 text-xs font-bold text-emerald-950">
          <span>
            🔒 <strong>VỊ TRÍ ĐÃ ĐƯỢC GHI NHẬN:</strong> Vé {activeTicket?.id} ({activeTicket?.licensePlate}) đã lưu tại <strong>{currentFloor.name} • Block {activeTicket?.blockId}</strong>. Mỗi xe lưu 1 vị trí.
          </span>
          <button
            type="button"
            onClick={onNavigateToCheckPosition}
            className="rounded-xl bg-emerald-700 px-4 py-2 text-white hover:bg-emerald-800 shadow"
          >
            Tra cứu vị trí xe →
          </button>
        </div>
      )}

      <div className="mb-5">
        <p className="text-xs font-black uppercase tracking-wider text-slate-600 mb-2">
          Bước 1: Chọn Phân khu:
        </p>
        <div className="grid grid-cols-4 gap-3">
          {(['A', 'B', 'C', 'D'] as ZoneId[]).map((zId) => {
            const isSelected = zId === selectedZoneId
            const zone = currentFloor.zones.find((z) => z.id === zId)
            let freeInZone = 0
            zone?.blocks.forEach((b) => {
              freeInZone += b.available
            })

            return (
              <button
                key={zId}
                type="button"
                disabled={isAlreadySaved}
                onClick={() => {
                  setSelectedZoneId(zId)
                  setSelectedBlockId(null)
                }}
                className={`flex flex-col items-center justify-center rounded-2xl p-3.5 text-center transition border shadow-xs ${
                  isAlreadySaved
                    ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                    : isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-4 ring-slate-200'
                    : 'bg-white text-slate-900 border-slate-200 hover:border-slate-400'
                }`}
              >
                <span className="text-lg font-black">Khu {zId}</span>
                <span className={`text-[11px] font-semibold mt-0.5 ${isSelected && !isAlreadySaved ? 'text-emerald-300' : 'text-slate-500'}`}>
                  Còn {freeInZone}/120 chỗ
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="rounded-3xl border-2 border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
          <div>
            <h3 className="text-base font-black text-slate-900">
              Bước 2: Chọn Block đỗ xe trong Phân khu {selectedZoneId}
            </h3>
            <p className="text-xs text-slate-500">
              {isAlreadySaved
                ? '(Vị trí đã được lưu và khóa cố định)'
                : 'Click vào một Block màu xanh để xác nhận vị trí'}
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-bold text-slate-600">
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-xs bg-emerald-500" /> Còn chỗ
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-xs bg-rose-500" /> Đã đầy
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {activeZone.blocks.map((block) => {
            const isFull = block.available === 0
            const isChosen = (activeTicket?.blockId || selectedBlockId) === block.id

            return (
              <button
                key={block.id}
                type="button"
                disabled={isFull || isAlreadySaved}
                onClick={() => handleSelectBlock(block)}
                className={`flex h-24 flex-col items-center justify-center rounded-2xl p-4 text-center transition border shadow-xs ${
                  isAlreadySaved && isChosen
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-md ring-4 ring-emerald-200'
                    : isAlreadySaved
                    ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed opacity-60'
                    : isFull
                    ? 'bg-rose-50 border-rose-300 text-rose-700 cursor-not-allowed'
                    : isChosen
                    ? 'bg-emerald-600 border-2 border-slate-900 text-white shadow-lg scale-102 ring-4 ring-emerald-200'
                    : 'bg-emerald-50/60 border-emerald-300 text-slate-900 hover:bg-emerald-500 hover:text-white'
                }`}
              >
                <span className="text-xl font-black">{block.name}</span>
                <span className={`text-xs font-bold mt-1 ${isChosen ? 'text-emerald-100' : isFull ? 'text-rose-600' : 'text-emerald-700'}`}>
                  {isFull ? 'ĐÃ ĐẦY' : `Còn ${block.available}/${block.capacity} chỗ`}
                </span>
                <span className="text-[10px] mt-0.5 opacity-80">
                  {isAlreadySaved && isChosen
                    ? '✓ Xe đỗ tại đây'
                    : isChosen
                    ? '✓ Đang chọn'
                    : isFull
                    ? 'Hết chỗ'
                    : 'Nhấn để chọn'}
                </span>
              </button>
            )
          })}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-slate-50 border border-slate-200 p-4">
          <div>
            <p className="text-xs text-slate-500 font-medium">Vị trí Block:</p>
            <p className="text-base font-black text-slate-900">
              {activeTicket?.blockId ? (
                <span className="text-emerald-700 font-mono text-lg">
                  {currentFloor.name} • Khu {activeTicket.zoneId || selectedZoneId} • Block {activeTicket.blockId} (Đã lưu ✔)
                </span>
              ) : selectedBlockId ? (
                <span className="text-emerald-700 font-mono text-lg">
                  {currentFloor.name} • Khu {selectedZoneId} • Block {selectedBlockId}
                </span>
              ) : (
                <span className="text-slate-400 font-normal text-sm">Chưa chọn block nào</span>
              )}
            </p>
          </div>

          <button
            type="button"
            disabled={!selectedBlockId || isSaving || isAlreadySaved}
            onClick={handleConfirmSaveBlock}
            className={`rounded-2xl px-6 py-3.5 text-sm font-black shadow-lg transition ${
              isAlreadySaved
                ? 'bg-slate-300 text-slate-600 cursor-not-allowed'
                : selectedBlockId && !isSaving
                ? 'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {isAlreadySaved
              ? `✓ ĐÃ LƯU VỊ TRÍ (BLOCK ${activeTicket?.blockId})`
              : isSaving
              ? 'Đang lưu...'
              : 'LƯU VỊ TRÍ BLOCK NÀY ✔'}
          </button>
        </div>
      </div>
    </ScreenFrame>
  )
}

function CheckPositionScreen({
  tickets,
  onNavigateToPayment,
}: {
  tickets: ActiveTicket[]
  onNavigateToPayment: (ticket: ActiveTicket) => void
}) {
  const [selectedTicketId, setSelectedTicketId] = useState<string>(tickets[0]?.id || '#P-8821')
  const [cardScanned, setCardScanned] = useState(true)

  const activeTicket = tickets.find((t) => t.id === selectedTicketId) || tickets[0]
  const targetZone = activeTicket?.zoneId || 'A'
  const targetBlock = activeTicket?.blockId || 'A1'

  // Helper tính toán đường đi nét đứt thông minh (Aisle-based Smart Wayfinding) qua hành lang chính
  const getNavigationPath = (zone: ZoneId, block: string) => {
    const colXLeft: Record<number, number> = {
      0: 100, // Cột 1 (A1/A4, C1/C4)
      1: 245, // Cột 2 (A2/A5, C2/C5)
      2: 390, // Cột 3 (A3/A6, C3/C6)
    }
    const colXRight: Record<number, number> = {
      0: 610, // Cột 1 (B1/B4, D1/D4)
      1: 755, // Cột 2 (B2/B5, D2/D5)
      2: 900, // Cột 3 (B3/B6, D3/D6)
    }

    const blockNum = parseInt(block.replace(/\D/g, ''), 10) || 1
    const isRow1 = blockNum <= 3
    const colIndex = (blockNum - 1) % 3

    if (zone === 'A') {
      const targetX = colXLeft[colIndex] || 100
      if (isRow1) {
        // Đi theo hành lang trung tâm -> rẽ lên trục giữa -> rẽ trái vào hàng 1
        return `M 980 300 L 515 300 Q 490 300 490 275 L 490 120 Q 490 100 465 100 L ${targetX} 100`
      } else {
        // Hàng 2: Đi thẳng hành lang giữa -> rẽ lên thẳng ô xe đỗ
        return `M 980 300 L ${targetX + 35} 300 Q ${targetX} 300 ${targetX} 275 L ${targetX} 210`
      }
    } else if (zone === 'B') {
      const targetX = colXRight[colIndex] || 610
      if (isRow1) {
        // Đi thẳng hành lang giữa -> rẽ lên hành lang phải -> rẽ trái vào hàng 1
        return `M 980 300 L 935 300 Q 910 300 910 275 L 910 120 Q 910 100 885 100 L ${targetX} 100`
      } else {
        // Hàng 2: Rẽ lên từ hành lang giữa
        return `M 980 300 L ${targetX + 35} 300 Q ${targetX} 300 ${targetX} 275 L ${targetX} 210`
      }
    } else if (zone === 'C') {
      const targetX = colXLeft[colIndex] || 100
      if (isRow1) {
        // Hàng 1 khu C: Đi hành lang giữa -> rẽ xuống ô
        return `M 980 300 L ${targetX + 35} 300 Q ${targetX} 300 ${targetX} 325 L ${targetX} 390`
      } else {
        // Hàng 2 khu C: Đi hành lang giữa -> rẽ xuống trục giữa -> rẽ trái vào hàng 2
        return `M 980 300 L 515 300 Q 490 300 490 325 L 490 480 Q 490 500 465 500 L ${targetX} 500`
      }
    } else {
      // Khu D
      const targetX = colXRight[colIndex] || 610
      if (isRow1) {
        return `M 980 300 L ${targetX + 35} 300 Q ${targetX} 300 ${targetX} 325 L ${targetX} 390`
      } else {
        return `M 980 300 L 935 300 Q 910 300 910 325 L 910 480 Q 910 500 885 500 L ${targetX} 500`
      }
    }
  }

  const navRoutePath = getNavigationPath(targetZone as ZoneId, targetBlock)

  const handleScan = (tId: string) => {
    setSelectedTicketId(tId)
    setCardScanned(true)
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl sm:p-7">
      <div className="mb-6 border-b border-slate-200 pb-4">
        <span className="inline-block rounded-md bg-emerald-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-800">
          KIOSK TÌM XE / QUẸT THẺ ĐỂ HIỆN VỊ TRÍ
        </span>
        <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Tra cứu vị trí xe đỗ bằng Thẻ (Check-Position)
        </h2>
      </div>

      {!cardScanned ? (
        <div className="my-8 flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-emerald-300 bg-emerald-50/40 p-8 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-600 text-3xl text-white shadow-lg">
            💳
          </div>
          <h3 className="mt-4 text-xl font-extrabold text-slate-900">VUI LÒNG QUẸT THẺ GỬI XE VÀO ĐẦU ĐỌC KIOSK</h3>
          <p className="mt-1 max-w-md text-sm text-slate-600">
            Chọn một trong các thẻ đang có trong hệ thống để tra cứu vị trí:
          </p>

          <div className="mt-5 flex flex-wrap justify-center gap-2 max-w-lg">
            {tickets.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => handleScan(t.id)}
                className="flex items-center gap-2 rounded-xl border border-emerald-400 bg-white px-4 py-2.5 text-xs font-bold text-emerald-900 shadow-sm hover:bg-emerald-600 hover:text-white transition active:scale-95"
              >
                <span>💳 {t.id}</span>
                <span className="font-mono font-normal">({t.licensePlate} • {t.floorId} • Block {t.blockId || 'A1'})</span>
              </button>
            ))}
          </div>
        </div>
      ) : activeTicket ? (
        <div className="space-y-6">
          {/* TOP GREEN BANNER */}
          <div className="rounded-2xl bg-emerald-500 p-5 text-white shadow-md">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-100">
                  KẾT QUẢ TRA CỨU THẺ {activeTicket.id}
                </p>
                <h3 className="mt-1 text-xl font-extrabold sm:text-2xl">
                  Xe của bạn đang đỗ tại: {activeTicket.floorId} - KHU {targetZone} - Cụm VỊ TRÍ {targetBlock}
                </h3>
                <p className="mt-1 text-xs text-emerald-100">
                  Biển số: <strong className="text-white font-mono">{activeTicket.licensePlate}</strong> | Thời gian gửi: {new Date(activeTicket.entryTime).toLocaleTimeString('vi-VN')}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCardScanned(false)}
                  className="rounded-xl border border-white/40 bg-white/20 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-white/30 transition"
                >
                  Quẹt thẻ khác ↺
                </button>
                <button
                  type="button"
                  onClick={() => onNavigateToPayment(activeTicket)}
                  className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-black text-white shadow hover:bg-black transition"
                >
                  Thanh toán & rời bãi →
                </button>
              </div>
            </div>
          </div>

          {/* MAIN FLOOR MAP WITH VISUAL NAVIGATION ROUTE */}
          <div className="relative rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 text-center">
              <h3 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
                {activeTicket.floorId === 'B2' ? 'TẦNG B2' : `TẦNG ${activeTicket.floorId}`}
              </h3>
              <p className="mt-1 text-xs font-medium text-slate-500">
                Sơ đồ tổng quan phân khu A - B - C - D
              </p>
            </div>

            {/* 2x2 Grid of Zones (A, B, C, D) Container */}
            <div className="relative mx-auto max-w-4xl">
              <div className="grid gap-6 md:grid-cols-2">
                {/* ZONE A */}
                <div className={`rounded-3xl border-2 p-5 transition ${targetZone === 'A' ? 'border-slate-300 bg-white shadow-sm' : 'border-slate-200 bg-white'}`}>
                  <h4 className="mb-4 text-center text-2xl font-black text-slate-900">A</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {['A1', 'A2', 'A3', 'A4', 'A5', 'A6'].map((bId) => {
                      const isCarBlock = targetZone === 'A' && targetBlock === bId
                      return (
                        <div
                          key={bId}
                          className={`flex h-16 flex-col items-center justify-center rounded-2xl text-xs font-extrabold transition shadow-xs sm:h-20 ${
                            isCarBlock
                              ? 'bg-slate-950 text-white ring-4 ring-amber-400 scale-105 z-10 animate-pulse'
                              : 'bg-emerald-500 text-white'
                          }`}
                        >
                          {isCarBlock ? (
                            <>
                              <span className="text-base">🚗</span>
                              <span className="font-mono text-sm font-black">{bId}</span>
                            </>
                          ) : (
                            <span className="text-sm font-bold">5/20</span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* ZONE B */}
                <div className={`rounded-3xl border-2 p-5 transition ${targetZone === 'B' ? 'border-slate-300 bg-white shadow-sm' : 'border-slate-200 bg-white'}`}>
                  <h4 className="mb-4 text-center text-2xl font-black text-slate-900">B</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {['B1', 'B2', 'B3', 'B4', 'B5', 'B6'].map((bId) => {
                      const isCarBlock = targetZone === 'B' && targetBlock === bId
                      return (
                        <div
                          key={bId}
                          className={`flex h-16 flex-col items-center justify-center rounded-2xl text-xs font-extrabold transition shadow-xs sm:h-20 ${
                            isCarBlock
                              ? 'bg-slate-950 text-white ring-4 ring-amber-400 scale-105 z-10 animate-pulse'
                              : 'bg-rose-500 text-white'
                          }`}
                        >
                          {isCarBlock ? (
                            <>
                              <span className="text-base">🚗</span>
                              <span className="font-mono text-sm font-black">{bId}</span>
                            </>
                          ) : (
                            <span className="text-sm font-bold">0/20</span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* ZONE C */}
                <div className={`rounded-3xl border-2 p-5 transition ${targetZone === 'C' ? 'border-slate-300 bg-white shadow-sm' : 'border-slate-200 bg-white'}`}>
                  <h4 className="mb-4 text-center text-2xl font-black text-slate-900">C</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {['C1', 'C2', 'C3', 'C4', 'C5', 'C6'].map((bId) => {
                      const isCarBlock = targetZone === 'C' && targetBlock === bId
                      return (
                        <div
                          key={bId}
                          className={`flex h-16 flex-col items-center justify-center rounded-2xl text-xs font-extrabold transition shadow-xs sm:h-20 ${
                            isCarBlock
                              ? 'bg-slate-950 text-white ring-4 ring-amber-400 scale-105 z-10 animate-pulse'
                              : 'bg-emerald-500 text-white'
                          }`}
                        >
                          {isCarBlock ? (
                            <>
                              <span className="text-base">🚗</span>
                              <span className="font-mono text-sm font-black">{bId}</span>
                            </>
                          ) : (
                            <span className="text-sm font-bold">5/20</span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* ZONE D */}
                <div className={`rounded-3xl border-2 p-5 transition ${targetZone === 'D' ? 'border-slate-300 bg-white shadow-sm' : 'border-slate-200 bg-white'}`}>
                  <h4 className="mb-4 text-center text-2xl font-black text-slate-900">D</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {['D1', 'D2', 'D3', 'D4', 'D5', 'D6'].map((bId) => {
                      const isCarBlock = targetZone === 'D' && targetBlock === bId
                      return (
                        <div
                          key={bId}
                          className={`flex h-16 flex-col items-center justify-center rounded-2xl text-xs font-extrabold transition shadow-xs sm:h-20 ${
                            isCarBlock
                              ? 'bg-slate-950 text-white ring-4 ring-amber-400 scale-105 z-10 animate-pulse'
                              : 'bg-rose-500 text-white'
                          }`}
                        >
                          {isCarBlock ? (
                            <>
                              <span className="text-base">🚗</span>
                              <span className="font-mono text-sm font-black">{bId}</span>
                            </>
                          ) : (
                            <span className="text-sm font-bold">0/20</span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* VISUAL NAVIGATION PATH (SMART AISLE-BASED DUAL-LAYER GPS LINE) */}
              <svg
                viewBox="0 0 1000 600"
                preserveAspectRatio="none"
                className="pointer-events-none absolute inset-0 h-full w-full overflow-visible z-20"
                style={{ filter: 'drop-shadow(0 2px 4px rgba(244,63,94,0.3))' }}
              >
                <defs>
                  <marker
                    id="route-arrow"
                    viewBox="0 0 10 10"
                    refX="1.5"
                    refY="5"
                    markerWidth="6.5"
                    markerHeight="6.5"
                    orient="auto-start-reverse"
                  >
                    <path d="M 10 1 L 1 5 L 10 9 Z" fill="#f43f5e" />
                  </marker>
                </defs>
                <style>{`
                  @keyframes navFlow {
                    to {
                      stroke-dashoffset: -26;
                    }
                  }
                  .animated-nav-dash {
                    animation: navFlow 0.9s linear infinite;
                  }
                `}</style>
                {/* 1. Sleek Red Ribbon Base Body */}
                <path
                  d={navRoutePath}
                  fill="none"
                  stroke="#f43f5e"
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  markerEnd="url(#route-arrow)"
                />
                {/* 2. Inner White Dashed Highway GPS Line */}
                <path
                  d={navRoutePath}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeDasharray="10 5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="animated-nav-dash"
                />
              </svg>

              {/* YOU ARE HERE / STARTING POINT BADGE */}
              <div className="absolute -right-3 top-1/2 -translate-y-1/2 translate-x-2 flex flex-col items-center z-30 sm:translate-x-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 text-white shadow-lg ring-4 ring-white">
                  <span className="text-lg">🚶</span>
                </div>
                <span className="mt-1 rounded-full bg-slate-900 px-2.5 py-0.5 text-[10px] font-black tracking-wider text-white shadow-md whitespace-nowrap">
                  BẮT ĐẦU / LỐI RA
                </span>
              </div>
            </div>

            {/* LEGEND */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-bold text-slate-700">
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 rounded-md bg-emerald-500 shadow-xs" /> Cụm còn chỗ
              </span>
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 rounded-md bg-rose-500 shadow-xs" /> Cụm đã đầy
              </span>
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 rounded-md bg-slate-950 ring-2 ring-amber-400 shadow-xs" /> Vị trí xe
              </span>
            </div>
          </div>

          {/* BOTTOM INSTRUCTION CARD */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
            <p className="text-xs font-bold uppercase tracking-wider text-rose-600">📍 VỊ TRÍ HIỆN TẠI</p>
            <h4 className="mt-1 text-base font-extrabold text-slate-900">
              Điểm bắt đầu / lối ra tầng {activeTicket.floorId} — giữa khu B và khu D
            </h4>
            <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
              <strong>Hướng dẫn:</strong> Bắt đầu từ ký hiệu 🚶 giữa khu B và D → đi tới khu {targetZone} → cụm {targetBlock}.
            </p>
          </div>
        </div>
      ) : null}
    </section>
  )
}

type CheckoutStep = 'tap_card' | 'pay' | 'success'

function PaymentScreen({
  tickets,
  onCheckoutAndRelease,
  onNavigateToOverview,
}: {
  tickets: ActiveTicket[]
  onCheckoutAndRelease: (ticketId: string, method: 'QR' | 'POS') => Promise<void>
  onNavigateToOverview: () => void
}) {
  const [step, setStep] = useState<CheckoutStep>('tap_card')
  const [selectedTicketId, setSelectedTicketId] = useState<string>(tickets[0]?.id || '#P-8821')
  const [method, setMethod] = useState<'qr' | 'card'>('qr')
  const [paidTicketInfo, setPaidTicketInfo] = useState<ActiveTicket | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const activeTicket = tickets.find((t) => t.id === selectedTicketId) || tickets[0]

  const handleSelectTicketToPay = (tId: string) => {
    setSelectedTicketId(tId)
    setStep('pay')
  }

  const handleConfirmPayment = async () => {
    if (!activeTicket || isProcessing) return
    setIsProcessing(true)
    try {
      setPaidTicketInfo(activeTicket)
      await onCheckoutAndRelease(activeTicket.id, method === 'qr' ? 'QR' : 'POS')
      setStep('success')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <ScreenFrame title="Thanh toán & Rời bãi xe" subtitle="Cổng ra / Trả thẻ & Thanh toán phí">
      <div className="mb-6 grid grid-cols-3 gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2 text-center text-xs font-bold">
        {[
          ['1. Quẹt thẻ gửi xe', 'tap_card'],
          ['2. Thanh toán phí', 'pay'],
          ['3. Mở Barie', 'success'],
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

      {step === 'tap_card' && (
        <div className="my-6 flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-900 text-3xl text-white shadow-lg">
            💳
          </div>
          <h3 className="mt-4 text-xl font-extrabold text-slate-900">QUẸT THẺ GỬI XE TẠI ĐẦU ĐỌC CỔNG RA</h3>
          <p className="mt-1 max-w-md text-sm text-slate-600">
            Chọn thẻ cần thanh toán để hệ thống tính phí và mở barie:
          </p>

          <div className="mt-5 flex flex-wrap justify-center gap-2 max-w-lg">
            {tickets.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => handleSelectTicketToPay(t.id)}
                className="flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3.5 text-sm font-extrabold text-white shadow-lg transition hover:bg-emerald-700 active:scale-95"
              >
                <span>QUẸT THẺ {t.id}</span>
                <span className="font-mono font-normal">({t.licensePlate} • {t.floorId} • Block {t.blockId || 'C4'})</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 'pay' && activeTicket && (
        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-5 flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div>
                <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Thông tin phiếu gửi xe</h3>
                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Mã thẻ:</span>
                    <span className="font-mono font-bold text-slate-900">{activeTicket.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Biển số xe:</span>
                    <span className="font-mono font-bold text-emerald-700">{activeTicket.licensePlate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Phương tiện:</span>
                    <span className="font-medium text-slate-800">{activeTicket.carModel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Vị trí đỗ:</span>
                    <span className="font-semibold text-slate-800">
                      {activeTicket.floorId} - Khu {activeTicket.zoneId || 'C'} (Block {activeTicket.blockId || 'C4'})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Thời gian vào:</span>
                    <span className="font-mono text-slate-700">{new Date(activeTicket.entryTime).toLocaleTimeString('vi-VN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Thời gian ra:</span>
                    <span className="font-mono text-slate-700">{new Date().toLocaleTimeString('vi-VN')}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-center">
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">Tổng tiền thanh toán</p>
                <p className="mt-1 text-3xl font-black text-emerald-700 font-mono">{activeTicket.fee.toLocaleString()} VNĐ</p>
              </div>
            </div>

            <div className="lg:col-span-7 rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm flex flex-col justify-between">
              <div>
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

                {method === 'qr' && (
                  <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-5 border border-slate-200 text-center">
                    <p className="text-sm font-extrabold text-slate-900">Quét mã QR để thanh toán</p>
                    <div className="my-3 flex items-center justify-center rounded-2xl border-2 border-dashed border-emerald-400 bg-emerald-50/50 p-4">
                      <div className="w-44 rounded-xl border border-slate-300 bg-white p-3 text-center shadow-sm">
                        <div className="grid grid-cols-8 gap-1">
                          {Array.from({ length: 64 }).map((_, i) => (
                            <div key={i} className={`h-2.5 rounded-[1px] ${i % 3 === 0 || i % 5 === 0 ? 'bg-slate-900' : 'bg-slate-100'}`} />
                          ))}
                        </div>
                        <p className="mt-2 font-mono text-[9px] font-bold text-slate-600">PARKING-PAY</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">Số tiền: <strong>{activeTicket.fee.toLocaleString()} VNĐ</strong></p>
                  </div>
                )}

                {method === 'card' && (
                  <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-8 border border-slate-200 text-center">
                    <div className="text-4xl">💳</div>
                    <p className="mt-3 text-base font-bold text-slate-900">CHẠM THẺ NGÂN HÀNG (POS)</p>
                    <p className="mt-1 text-xs text-slate-500 max-w-xs">Chạm thẻ thanh toán vào đầu đọc POS bên cạnh màn hình.</p>
                  </div>
                )}
              </div>

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
                  disabled={isProcessing}
                  onClick={handleConfirmPayment}
                  className={`flex-1 rounded-2xl py-3.5 text-sm font-black text-white shadow-lg transition active:scale-95 ${
                    isProcessing ? 'bg-slate-400' : 'bg-emerald-600 hover:bg-emerald-700'
                  }`}
                >
                  {isProcessing ? 'Đang xử lý...' : 'XÁC NHẬN THANH TOÁN & MỞ BARIE ✔'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 'success' && paidTicketInfo && (
        <div className="rounded-3xl border border-emerald-300 bg-emerald-50 p-6 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-600 text-3xl text-white shadow-lg">
            ✓
          </div>
          <h3 className="mt-4 text-2xl font-extrabold text-emerald-950">THANH TOÁN THÀNH CÔNG!</h3>
          <p className="mt-1 text-sm text-emerald-800">
            Số tiền: <strong className="font-mono text-base">{paidTicketInfo.fee.toLocaleString()} VNĐ</strong> | Mã GD: TX-2026-{Math.floor(1000 + Math.random() * 9000)}
          </p>

          <div className="my-6 rounded-2xl border-2 border-emerald-500 bg-emerald-600 p-4 text-white shadow-lg animate-pulse">
            <p className="text-xl font-extrabold tracking-wide">🚧 CỔNG BARIE ĐÃ MỞ - CHÚC QUÝ KHÁCH THƯỢNG LỘ BÌNH AN!</p>
          </div>

          <div className="flex justify-center gap-3">
            <button
              type="button"
              onClick={onNavigateToOverview}
              className="rounded-xl bg-emerald-600 px-6 py-3 text-xs font-black text-white shadow hover:bg-emerald-700"
            >
              Xem tổng quan chỗ trống →
            </button>
            <button
              type="button"
              onClick={() => setStep('tap_card')}
              className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-xs font-bold text-slate-700 shadow hover:bg-slate-100"
            >
              Thanh toán lượt khác
            </button>
          </div>
        </div>
      )}
    </ScreenFrame>
  )
}

export default function App() {
  const [activeScreen, setActiveScreen] = useState<Screen>('overview')
  const [floors, setFloors] = useState<FloorDetail[]>(createInitialFloorDetails)
  const [tickets, setTickets] = useState<ActiveTicket[]>(INITIAL_TICKETS)
  const [currentFloorId, setCurrentFloorId] = useState<FloorId>('B2')
  const [activeTicket, setActiveTicket] = useState<ActiveTicket | null>(null)

  const syncWithBackend = useCallback(async () => {
    try {
      await parkingAPI.health()
    } catch {
      // Offline fallback
    }
  }, [])

  useEffect(() => {
    syncWithBackend()
  }, [syncWithBackend])

  const handleIssueTicket = async (vehicle: MockCar, floorId: FloorId): Promise<ActiveTicket> => {
    let generatedTicketId = `#P-${Math.floor(1000 + Math.random() * 9000)}`

    try {
      const car = await parkingAPI.checkInCar(vehicle.licensePlate)
      if (car && car.id) {
        const apiTicket = await parkingAPI.generateTicket(car.id, floorId)
        if (apiTicket && apiTicket.id) {
          generatedTicketId = apiTicket.id
        }
      }
    } catch {
      // Fallback
    }

    const newTicket: ActiveTicket = {
      id: generatedTicketId,
      licensePlate: vehicle.licensePlate,
      carModel: vehicle.carModel,
      entryTime: new Date(),
      floorId,
      fee: 4000,
      status: 'PARKED',
    }

    setTickets((prev) => [newTicket, ...prev])
    setActiveTicket(newTicket)
    setCurrentFloorId(floorId)
    return newTicket
  }

  const handleSaveBlock = async (
    ticketId: string,
    floorId: FloorId,
    zoneId: ZoneId,
    blockId: string
  ) => {
    try {
      await parkingAPI.reserveParkingSlot({
        zoneId,
        clusterId: blockId,
        slotNumber: 1,
        ticketId,
        floorId,
      })
    } catch {
      // Fallback
    }

    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId ? { ...t, floorId, zoneId, blockId } : t
      )
    )

    setActiveTicket((prev) => (prev && prev.id === ticketId ? { ...prev, floorId, zoneId, blockId } : prev))

    setFloors((prevFloors) =>
      prevFloors.map((floor) => {
        if (floor.id !== floorId) return floor
        return {
          ...floor,
          zones: floor.zones.map((zone) => {
            if (zone.id !== zoneId) return zone
            return {
              ...zone,
              blocks: zone.blocks.map((block) => {
                if (block.id !== blockId) return block
                return {
                  ...block,
                  available: Math.max(0, block.available - 1),
                }
              }),
            }
          }),
        }
      })
    )
  }

  const handleCheckoutAndRelease = async (ticketId: string, method: 'QR' | 'POS') => {
    const ticket = tickets.find((t) => t.id === ticketId)
    if (!ticket) return

    try {
      await parkingAPI.processPayment(ticketId, ticket.fee, method)
    } catch {
      // Fallback
    }

    if (ticket.floorId && ticket.zoneId && ticket.blockId) {
      setFloors((prevFloors) =>
        prevFloors.map((floor) => {
          if (floor.id !== ticket.floorId) return floor
          return {
            ...floor,
            zones: floor.zones.map((zone) => {
              if (zone.id !== ticket.zoneId) return zone
              return {
                ...zone,
                blocks: zone.blocks.map((block) => {
                  if (block.id !== ticket.blockId) return block
                  return {
                    ...block,
                    available: Math.min(block.capacity, block.available + 1),
                  }
                }),
              }
            }),
          }
        })
      )
    }

    setTickets((prev) => prev.filter((t) => t.id !== ticketId))
    if (activeTicket?.id === ticketId) {
      setActiveTicket(null)
    }
  }

  return (
    <div
      className="min-h-screen bg-slate-100 text-slate-900"
      style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
    >
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white shadow-xs">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-700">Parking Management System</p>
            <h1 className="text-sm font-bold text-slate-900 sm:text-base">
              Hệ thống Quản lý & Kiosk Gửi xe Thông minh
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Hệ thống đang hoạt động
            </span>
          </div>
        </div>
      </header>

      <nav className="border-b border-slate-200 bg-white">
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
                    : 'bg-slate-50 text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 border border-slate-200'
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
        {activeScreen === 'overview' && (
          <OverviewScreen
            floors={floors}
            onSelectFloor={setCurrentFloorId}
            onNavigate={setActiveScreen}
          />
        )}

        {activeScreen === 'ticket' && (
          <TicketScreen
            floors={floors}
            onIssueTicket={handleIssueTicket}
            onNavigateToFloorMap={(fId, ticket) => {
              setCurrentFloorId(fId)
              setActiveTicket(ticket)
              setActiveScreen('floormap')
            }}
            onNavigateToSavePosition={(fId, ticket) => {
              setCurrentFloorId(fId)
              setActiveTicket(ticket)
              setActiveScreen('saveposition')
            }}
          />
        )}

        {activeScreen === 'floormap' && (
          <FloorMapScreen
            floors={floors}
            currentFloorId={currentFloorId}
            onNavigateToOverview={() => setActiveScreen('overview')}
            onNavigateToSavePosition={() => setActiveScreen('saveposition')}
            onNavigateToCheckPosition={() => setActiveScreen('checkposition')}
          />
        )}

        {activeScreen === 'saveposition' && (
          <SavePositionScreen
            floors={floors}
            currentFloorId={currentFloorId}
            activeTicket={activeTicket}
            onSaveBlock={handleSaveBlock}
            onNavigateToCheckPosition={() => setActiveScreen('checkposition')}
          />
        )}

        {activeScreen === 'checkposition' && (
          <CheckPositionScreen
            tickets={tickets}
            onNavigateToPayment={(ticket) => {
              setActiveTicket(ticket)
              setActiveScreen('payment')
            }}
          />
        )}

        {activeScreen === 'payment' && (
          <PaymentScreen
            tickets={tickets}
            onCheckoutAndRelease={handleCheckoutAndRelease}
            onNavigateToOverview={() => setActiveScreen('overview')}
          />
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs font-medium text-slate-500">
        Hệ thống Quản lý Bãi xe Thông minh • Giao diện Kiosk Tương tác Trực quan.
      </footer>
    </div>
  )
}
