import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'
import { SITE } from '@/lib/site'

export const alt = `${SITE.name} – Bringing Grantham Together`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OpenGraphImage() {
  const badge = await readFile(join(process.cwd(), 'public', SITE.badge))
  const badgeSrc = `data:image/png;base64,${badge.toString('base64')}`

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 56,
          padding: '0 80px',
          background: '#111111',
          color: '#ffffff',
          borderBottom: '16px solid #f5b800',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={badgeSrc} width={380} height={380} alt="" />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 40, fontWeight: 700, color: '#f5b800', letterSpacing: 4 }}>
            {`${SITE.frequency} · ${SITE.town}`.toUpperCase()}
          </div>
          <div style={{ fontSize: 104, fontWeight: 800, lineHeight: 1.05, marginTop: 12 }}>Hive FM</div>
          <div style={{ fontSize: 44, marginTop: 20, opacity: 0.9 }}>Bringing Grantham Together</div>
          <div style={{ fontSize: 30, marginTop: 36, color: '#f5b800' }}>Community radio from the BHive</div>
        </div>
      </div>
    ),
    size,
  )
}
