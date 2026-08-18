import { useState } from 'react'
import type { MouseEventHandler } from 'react'

type Screen =
  | 'overview'
  | 'ticket'
  | 'floormap'
  | 'cameraview'
  | 'payment'

const SCREENS: { id: Screen; label: string }[] = [
  { id: 'overview', label: '1. Tổng quan' },
  { id: 'ticket', label: '2. Nhận thẻ' },
  { id: 'floormap', label: '3. Sơ đồ tầng' },
  { id: 'cameraview', label: '4. Camera rời xe' },
  { id: 'payment', label: '5. Thanh toán' },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Box({
  className = '',
  children,
  onClick,
}: {
  className?: string
  children?: React.ReactNode
  onClick?: MouseEventHandler<HTMLDivElement>
}) {
  return (
    <div className={`border-2 border-gray-400 bg-gray-100 ${className}`} onClick={onClick}>
      {children}
    </div>
  )
}

function Label({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <span className={`text-xs text-gray-500 uppercase tracking-wide ${className}`}>{children}</span>
}

function ScreenTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-b-2 border-gray-800 pb-1 mb-4">
      <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-0.5">Màn hình</p>
      <h2 className="text-sm font-bold text-gray-800">{children}</h2>
    </div>
  )
}

function PlaceholderImg({ label, className = '' }: { label?: string; className?: string }) {
  return (
    <div className={`border-2 border-dashed border-gray-400 bg-gray-50 flex items-center justify-center ${className}`}>
      <span className="text-[10px] text-gray-400">{label ?? '[ảnh]'}</span>
    </div>
  )
}

function WfButton({ children, variant = 'default', className = '', onClick }: {
  children: React.ReactNode
  variant?: 'default' | 'primary' | 'success'
  className?: string
  onClick?: MouseEventHandler<HTMLButtonElement>
}) {
  const base = 'border-2 px-4 py-1.5 text-xs font-semibold text-center'
  const styles = {
    default: 'border-gray-600 bg-white text-gray-800',
    primary: 'border-gray-800 bg-gray-800 text-white',
    success: 'border-gray-700 bg-gray-700 text-white',
  }
  return (
    <button type="button" onClick={onClick} className={`${base} ${styles[variant]} ${className}`}>
      {children}
    </button>
  )
}

// ─── Screen 1: Tổng quan ──────────────────────────────────────────────────────

const floors = [
  { id: 'B1', used: 300, total: 300, status: 'full' },
  { id: 'B2', used: 245, total: 300, status: 'warn' },
  { id: 'B3', used: 49, total: 300, status: 'ok' },
  { id: 'B4', used: 300, total: 300, status: 'full' },
  { id: 'B5', used: 102, total: 300, status: 'ok' },
  { id: 'B6', used: 80, total: 300, status: 'ok' },
]

function OverviewScreen() {
  const statusStyle = (s: string) => {
    if (s === 'full') return 'bg-gray-700 text-white'
    if (s === 'warn') return 'bg-gray-300 text-gray-800'
    return 'bg-gray-100 text-gray-800'
  }
  const statusHatch = (s: string) => {
    if (s === 'full') return '████'
    if (s === 'warn') return '▒▒▒▒'
    return '░░░░'
  }

  return (
    <div>
      <ScreenTitle>Tổng quan — Điểm đầu gửi xe</ScreenTitle>

      <Box className="p-0 overflow-hidden">
        <div className="bg-gray-800 text-white text-center py-1.5 text-xs font-bold tracking-wider">
          CHỖ TRỐNG GỬI XE
        </div>
        {floors.map((f) => (
          <div key={f.id} className={`flex items-center justify-between px-4 py-2 border-t border-gray-300 ${statusStyle(f.status)}`}>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] opacity-50">{statusHatch(f.status)}</span>
              <span className="text-sm font-bold">{f.id}</span>
            </div>
            <span className="text-sm font-mono">{f.used} / {f.total}</span>
          </div>
        ))}
      </Box>

      <div className="mt-3 flex gap-4 text-[10px] text-gray-500">
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 bg-gray-700"></span> Đầy</span>
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 bg-gray-300 border border-gray-400"></span> Gần đầy</span>
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 bg-gray-100 border border-gray-400"></span> Còn trống</span>
      </div>
    </div>
  )
}

// ─── Screen 2: Nhận thẻ ───────────────────────────────────────────────────────

function TicketScreen() {
  return (
    <div>
      <ScreenTitle>Nhận thẻ — Lúc gửi xe</ScreenTitle>

      <Box className="p-3">
        <div className="grid grid-cols-2 gap-3">
          {/* Left: vehicle info + camera */}
          <div>
            <p className="text-xs font-semibold text-gray-700 mb-0.5">Biển số xe:</p>
            <p className="text-sm font-bold text-gray-900 mb-1">52 - XXX - XXX</p>
            <p className="text-xs text-gray-600 mb-2">Thời gian vào: <span className="font-mono font-semibold">19:45:23</span></p>
            <PlaceholderImg label="camera nhận diện xe" className="h-20" />
          </div>

          {/* Right: pricing table */}
          <div>
            <p className="text-[10px] font-bold text-gray-700 mb-1 uppercase tracking-wide">Bảng giá gửi xe</p>
            <Box className="p-0 overflow-hidden">
              {[
                { range: '0 – 4h', price: '4.000 vnđ' },
                { range: '4 – 12h', price: '8.000 vnđ' },
                { range: '> 12h', price: '15.000 vnđ' },
                { range: 'Không giới hạn', price: '...' },
              ].map((r) => (
                <div key={r.range} className="flex justify-between px-2 py-1 border-b border-gray-300 last:border-b-0">
                  <span className="text-[10px] text-gray-600">{r.range}</span>
                  <span className="text-[10px] font-mono text-gray-800">{r.price}</span>
                </div>
              ))}
            </Box>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-4 flex justify-center">
          <WfButton variant="primary" className="px-8 py-2 text-sm">
            NHẬN THẺ
          </WfButton>
        </div>

        <p className="text-right text-[10px] text-gray-400 mt-3">Ngày: 16-08-2026</p>
      </Box>
    </div>
  )
}

// ─── Screen 3: Sơ đồ tầng ────────────────────────────────────────────────────

function ParkingGrid({ section, available, total }: { section: string; available: number; total: number }) {
  const occupied = total - available
  const spots = Array.from({ length: total }, (_, i) => i < occupied ? 'occ' : 'free')
  const cols = total <= 4 ? total : Math.ceil(total / 2)

  return (
    <div className="border-2 border-gray-500 p-2">
      <p className="text-[10px] font-bold text-gray-700 mb-1">{section}</p>
      <div className="grid gap-0.5 mb-1" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}>
        {spots.map((s, i) => (
          <div
            key={i}
            className={`h-4 border ${s === 'occ' ? 'bg-gray-700 border-gray-800' : 'bg-white border-gray-400'}`}
          />
        ))}
      </div>
      <p className="text-[9px] text-gray-500 font-mono">{available}/{total}</p>
    </div>
  )
}

function FloorMapScreen() {
  return (
    <div>
      <ScreenTitle>Sơ đồ chỗ trống — Tầng B2</ScreenTitle>

      <Box className="p-3">
        <div className="text-center font-bold text-sm text-gray-800 mb-3 tracking-widest border-b border-gray-300 pb-1">
          TẦNG B2
        </div>

        <div className="grid grid-cols-2 gap-3">
          <ParkingGrid section="A" available={5} total={20} />
          <ParkingGrid section="B" available={4} total={10} />
          <ParkingGrid section="C" available={4} total={20} />
          <ParkingGrid section="D" available={5} total={16} />
        </div>

        {/* Legend */}
        <div className="mt-3 flex items-center gap-4 text-[10px] text-gray-500 border-t border-gray-300 pt-2">
          <span className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 bg-gray-700 border border-gray-800"></span> Đã đỗ
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 bg-white border border-gray-400"></span> Còn trống
          </span>
          <span className="flex items-center gap-2 ml-auto text-gray-400 border border-gray-300 px-1.5 py-0.5">
            ↑ Lối ra / vào
          </span>
        </div>
      </Box>
    </div>
  )
}

// ─── Screen 4: Camera rời xe ──────────────────────────────────────────────────

function CameraViewScreen() {
  return (
    <div>
      <ScreenTitle>Thông báo rời xe đỗ — Camera</ScreenTitle>

      <Box className="p-3">
        <div className="grid grid-cols-2 gap-3">
          {/* A */}
          <div>
            <Label className="mb-1 block">Khu A</Label>
            <PlaceholderImg label="camera A" className="h-20" />
          </div>

          {/* B */}
          <div>
            <Label className="mb-1 block">Khu B</Label>
            <PlaceholderImg label="camera B" className="h-20" />
          </div>

          {/* C — highlighted / active */}
          <div>
            <Label className="mb-1 block">Khu C</Label>
            <div className="border-2 border-gray-700 bg-gray-50 p-1.5 h-24">
              <p className="text-[9px] text-gray-400 mb-1">[feed C]</p>
              <div className="grid grid-cols-3 gap-0.5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-5 border text-[8px] flex items-center justify-center
                      ${i === 3 ? 'bg-gray-700 border-gray-800 text-white' : 'bg-gray-100 border-gray-300'}`}
                  >
                    {i === 3 ? 'X' : ''}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* D */}
          <div>
            <Label className="mb-1 block">Khu D</Label>
            <PlaceholderImg label="camera D" className="h-24" />
          </div>
        </div>

        {/* Exit action */}
        <div className="mt-3 flex items-center justify-end gap-2 border-t border-gray-300 pt-2">
          <span className="text-[10px] text-gray-500">← Rời xe</span>
          <div className="border-2 border-gray-600 w-8 h-8 flex items-center justify-center text-gray-700">
            <span className="text-base">| |</span>
          </div>
        </div>
      </Box>
    </div>
  )
}

// ─── Screen 5: Thanh toán ─────────────────────────────────────────────────────

function PaymentScreen() {
  const [modal, setModal] = useState<null | 'qr' | 'success'>(null)

  return (
    <div>
      <ScreenTitle>Thanh toán</ScreenTitle>

      <Box className="p-3 mb-3">
        {/* Info */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 mb-3 text-xs text-gray-700">
          <div><span className="text-gray-400">Biển số xe:</span> <span className="font-bold">52-XXX-XXX</span></div>
          <div><span className="text-gray-400">Thời gian vào:</span> <span className="font-mono">19:45:23</span></div>
          <div><span className="text-gray-400">Thời gian ra:</span> <span className="font-mono">19:53:44</span></div>
          <div><span className="text-gray-400">Tạm tính:</span> <span className="font-bold">4.000 vnđ</span></div>
        </div>

        <div className="border-t border-gray-300 pt-2 pb-2">
          <p className="text-xs text-center text-gray-700">
            Thanh toán số tiền: <span className="font-bold">4.000 vnđ</span> bằng
          </p>
        </div>

        {/* Payment methods */}
        <div className="grid grid-cols-2 gap-3 mt-1">
          <Box className="p-2 flex flex-col items-center gap-1 cursor-pointer hover:bg-gray-200">
            <span className="text-[10px] font-semibold text-gray-700 mb-1">Thẻ</span>
            <div className="flex gap-1 flex-wrap justify-center">
              {['VPay', 'Vnpay', 'Visa', 'MC'].map((b) => (
                <span key={b} className="border border-gray-400 px-1 py-0.5 text-[8px] text-gray-600">{b}</span>
              ))}
            </div>
          </Box>

          <Box
            className="p-2 flex flex-col items-center gap-1 cursor-pointer hover:bg-gray-200"
            onClick={() => setModal('qr')}
          >
            <span className="text-[10px] font-semibold text-gray-700">QR Code</span>
            <PlaceholderImg label="[QR]" className="w-14 h-14" />
          </Box>
        </div>

        <p className="text-right text-[10px] text-gray-400 mt-3">Ngày: 16-08-2026</p>
      </Box>

      {/* QR Modal */}
      {modal === 'qr' && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <Box className="p-4 w-64 relative bg-white">
            <button
              className="absolute top-1 right-1 border border-gray-400 w-5 h-5 text-xs text-gray-600 flex items-center justify-center"
              onClick={() => setModal(null)}
            >
              X
            </button>
            <p className="text-[10px] text-gray-500 text-center mb-2">Quét mã để thanh toán</p>
            <PlaceholderImg label="QR CODE" className="w-full h-36 mx-auto" />
            <p className="text-[9px] text-gray-400 text-center mt-1">[mã QR thanh toán]</p>
            <div className="mt-3 flex justify-center">
              <WfButton variant="primary" className="px-6" onClick={() => setModal('success')}>
                Xác nhận
              </WfButton>
            </div>
          </Box>
        </div>
      )}

      {/* Success Modal */}
      {modal === 'success' && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <Box className="p-6 w-64 text-center bg-white">
            <div className="border-2 border-gray-700 rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-3 text-gray-700 font-bold text-lg">OK</div>
            <p className="text-sm font-bold text-gray-800 mb-4">Thanh toán thành công!</p>
            <WfButton variant="primary" className="px-8 cursor-pointer" onClick={() => setModal(null)}>
              Đóng
            </WfButton>
          </Box>
        </div>
      )}
    </div>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [active, setActive] = useState<Screen>('overview')

  const screenMap: Record<Screen, React.ReactNode> = {
    overview: <OverviewScreen />,
    ticket: <TicketScreen />,
    floormap: <FloorMapScreen />,
    cameraview: <CameraViewScreen />,
    payment: <PaymentScreen />,
  }

  return (
    <div className="min-h-screen bg-gray-200 font-mono">
      {/* Top bar — wireframe label */}
      <div className="bg-white border-b-2 border-gray-800 px-4 py-2 flex items-center gap-3">
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 border border-gray-300 px-2 py-0.5">
          WIREFRAME · LOW-FI
        </span>
        <span className="text-xs font-semibold text-gray-700">Hệ thống gửi xe — Chỗ trống gửi xe</span>
      </div>

      {/* Nav */}
      <div className="bg-white border-b border-gray-300 px-4 flex gap-0 overflow-x-auto">
        {SCREENS.map((s) => (
          <button
            key={s.id}
            onClick={() => setActive(s.id)}
            className={`text-[10px] px-3 py-2 border-r border-gray-200 whitespace-nowrap font-semibold transition-colors
              ${active === s.id
                ? 'bg-gray-800 text-white'
                : 'text-gray-500 hover:bg-gray-100'
              }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Screen area */}
      <div className="flex justify-center py-8 px-4">
        <div className="w-full max-w-sm bg-white border-2 border-gray-800 p-4 shadow-[4px_4px_0_#374151]">
          {screenMap[active]}
        </div>
      </div>

      {/* Footer note */}
      <div className="text-center text-[9px] text-gray-400 pb-6 tracking-wide">
        ← Điều hướng qua các tab để xem từng màn hình wireframe →
      </div>
    </div>
  )
}
