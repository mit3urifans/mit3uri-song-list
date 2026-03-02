import React, { useState, useMemo, useEffect, useRef } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { motion } from 'framer-motion'
import { HiChevronUp, HiChevronLeft } from 'react-icons/hi'
import { BsBarChartFill } from 'react-icons/bs'
import styles from '../styles/Home.module.css'

// Fixed colors for language chart (theme-independent, semantically clear)
const LANG_COLORS = {
  '华语': '#4EADD8',
  '粤语': '#E08B4A',
  '日语': '#E06B8C',
  '英语': '#58BE8A',
  '韩语': '#9B72E0',
}
const LANG_ORDER = ['华语', '粤语', '日语', '英语', '韩语']
const DOW_LABELS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']

// ─── Background: solid color + slow floating blobs ─────────────────────────
function Background() {
  return (
    <div
      className="fixed inset-0 transition-colors duration-300 bg-main-page-background overflow-hidden"
      style={{ zIndex: -1 }}
    >
      <motion.div
        className="absolute rounded-full blur-3xl bg-accent/8"
        style={{ width: '28rem', height: '28rem', top: '5%', left: '10%' }}
        animate={{ x: [0, 80, 0], y: [0, 40, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute rounded-full blur-3xl bg-accent-oen-2/8"
        style={{ width: '22rem', height: '22rem', bottom: '15%', right: '8%' }}
        animate={{ x: [0, -60, 0], y: [0, 50, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
      />
      <motion.div
        className="absolute rounded-full blur-3xl bg-accent-2/8"
        style={{ width: '18rem', height: '18rem', top: '45%', right: '25%' }}
        animate={{ x: [0, 40, -20, 0], y: [0, -30, 20, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut', delay: 9 }}
      />
    </div>
  )
}

// ─── Animated number: rolls from old value to new when value prop changes ───
function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState(value)
  const prevRef = useRef(value)

  useEffect(() => {
    const from = prevRef.current
    const to = value
    prevRef.current = to
    if (from === to) return

    const duration = 700
    const startTime = Date.now()
    const timer = setInterval(() => {
      const t = Math.min((Date.now() - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplay(Math.round(from + (to - from) * eased))
      if (t >= 1) { setDisplay(to); clearInterval(timer) }
    }, 16)
    return () => clearInterval(timer)
  }, [value])

  return <>{display}</>
}

// ─── Section card: fades + rises into view on scroll ──────────────────────
function Section({ title, subtitle, children }) {
  return (
    <motion.div
      className="bg-secondary-background/60 backdrop-blur-sm rounded-2xl p-4 mb-6"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <h2 className="text-subtitle font-bold text-label mb-1">{title}</h2>
      {subtitle && <p className="text-sm text-secondary-label mb-3">{subtitle}</p>}
      {children}
    </motion.div>
  )
}

// ─── Horizontal bar with whileInView + hover tooltip ──────────────────────
function HBar({ label, sublabel, value, maxValue, rank, accentClass, totalPerfs, delay = 0 }) {
  const [hovered, setHovered] = useState(false)
  const pct = maxValue > 0 ? (value / maxValue) * 100 : 0
  const pctOfTotal = totalPerfs > 0 ? ((value / totalPerfs) * 100).toFixed(1) : '0.0'

  return (
    <div
      className="relative flex items-start space-x-2 py-1.5 cursor-default"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span className="text-xs text-secondary-label w-5 text-right shrink-0 mt-0.5">{rank}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-sm text-label truncate mr-2">{label}</span>
          <span className="text-xs text-secondary-label shrink-0">{value} 次</span>
        </div>
        {sublabel && <p className="text-xs text-secondary-label truncate mb-0.5">{sublabel}</p>}
        <div className="h-2 bg-placeholder/30 rounded-full overflow-hidden">
          <motion.div
            className={`h-full ${accentClass} rounded-full`}
            initial={{ width: 0 }}
            whileInView={{ width: `${pct}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: 'easeOut', delay }}
          />
        </div>
      </div>

      {hovered && (
        <motion.div
          className="absolute right-0 -top-8 bg-secondary-background border border-placeholder/20 rounded-lg px-2.5 py-1 text-xs shadow-lg z-20 whitespace-nowrap pointer-events-none"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.12 }}
        >
          <span className="font-semibold text-accent-fg">{value} 次</span>
          <span className="text-secondary-label"> · 占比 </span>
          <span className="font-semibold text-accent-fg">{pctOfTotal}%</span>
        </motion.div>
      )}
    </div>
  )
}

// ─── Month card: staggered entrance + hover lift ────────────────────────────
function MonthCard({ year, month, topSong, count, delay = 0 }) {
  return (
    <motion.div
      className="bg-accent-bg/40 rounded-xl p-3 cursor-default"
      initial={{ opacity: 0, y: 12, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ y: -3, scale: 1.03, transition: { duration: 0.15 } }}
      transition={{ duration: 0.35, delay, ease: 'easeOut' }}
    >
      <div className="text-xs text-secondary-label mb-1">{year}/{month}月</div>
      {topSong ? (
        <>
          <div className="text-sm font-semibold text-label truncate">{topSong}</div>
          <div className="text-xs text-secondary-label mt-1">{count} 次</div>
        </>
      ) : (
        <div className="text-sm text-secondary-label">暂无数据</div>
      )}
    </motion.div>
  )
}

// ─── Vertical bar chart (Chart 4) ──────────────────────────────────────────
function VerticalBars({ data }) {
  const maxCount = Math.max(...data.map(d => d.count), 1)
  const chartHeight = 144

  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex items-end gap-1.5" style={{ minWidth: `${data.length * 2.5}rem` }}>
        {data.map(({ year, month, count }, i) => {
          const barPx = count > 0 ? Math.max(Math.round((count / maxCount) * chartHeight), 4) : 0
          return (
            <div
              key={`${year}-${month}`}
              className="flex flex-col items-center flex-1"
              style={{ minWidth: '2rem' }}
            >
              <div
                className="flex flex-col items-center justify-end"
                style={{ height: `${chartHeight}px` }}
              >
                {count > 0 && (
                  <motion.span
                    className="text-xs text-secondary-label mb-0.5"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + i * 0.025 }}
                  >
                    {count}
                  </motion.span>
                )}
                <motion.div
                  className="bg-accent rounded-t w-full"
                  style={{ minHeight: 0 }}
                  initial={{ height: 0 }}
                  whileInView={{ height: barPx }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, ease: 'easeOut', delay: i * 0.035 }}
                />
              </div>
              <span className="text-xs text-secondary-label mt-1">{month}月</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Language distribution stacked bar (Chart 5) ───────────────────────────
function LanguageChart({ data }) {
  const total = Object.values(data).reduce((s, v) => s + v, 0)
  if (total === 0) return <p className="text-sm text-secondary-label">暂无数据</p>

  const entries = [
    ...LANG_ORDER.filter(l => data[l]).map(l => ({
      label: l, count: data[l], color: LANG_COLORS[l],
    })),
    ...Object.entries(data)
      .filter(([l]) => !LANG_ORDER.includes(l))
      .map(([l, c]) => ({ label: l, count: c, color: '#888' })),
  ]

  return (
    <div>
      {/* Stacked bar */}
      <div className="rounded-full overflow-hidden h-6 flex mb-4">
        {entries.map(({ label, count, color }, i) => {
          const pct = (count / total) * 100
          return (
            <motion.div
              key={label}
              className="h-full relative"
              title={`${label}: ${count}次 (${pct.toFixed(1)}%)`}
              style={{ backgroundColor: color }}
              initial={{ width: 0 }}
              whileInView={{ width: `${pct}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: i * 0.06 }}
            />
          )
        })}
      </div>
      {/* Legend */}
      <div className="flex flex-wrap gap-x-5 gap-y-2">
        {entries.map(({ label, count, color }) => (
          <div key={label} className="flex items-center space-x-1.5">
            <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: color }} />
            <span className="text-xs text-label font-medium">{label}</span>
            <span className="text-xs text-secondary-label">{count}次</span>
            <span className="text-xs text-secondary-label">
              ({((count / total) * 100).toFixed(1)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Day-of-week chart (Chart 6) ────────────────────────────────────────────
function DayChart({ data }) {
  const max = Math.max(...data, 1)
  return (
    <div className="space-y-2">
      {data.map((count, i) => {
        const pct = (count / max) * 100
        return (
          <div key={i} className="flex items-center space-x-2">
            <span className="text-xs text-secondary-label w-8 text-right shrink-0">
              {DOW_LABELS[i]}
            </span>
            <div className="flex-1 h-5 bg-placeholder/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-accent-oen-2"
                initial={{ width: 0 }}
                whileInView={{ width: `${pct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, ease: 'easeOut', delay: i * 0.06 }}
              />
            </div>
            <span className="text-xs text-secondary-label w-10 shrink-0 text-right">
              {count} 次
            </span>
          </div>
        )
      })}
    </div>
  )
}

// ─── Themed select pill ─────────────────────────────────────────────────────
function SelectPill({ value, onChange, children }) {
  return (
    <select
      value={value}
      onChange={e => onChange(Number(e.target.value))}
      className="bg-accent-bg text-accent-fg text-xs rounded-full px-2 py-1 border-none outline-none cursor-pointer"
    >
      {children}
    </select>
  )
}

// ─── Scroll-to-top button ───────────────────────────────────────────────────
function ScrollToTop() {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const h = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])
  if (!visible) return null
  return (
    <div className="fixed right-4 bottom-20 z-50">
      <button
        className="flex items-center rounded-full px-3 py-1 space-x-1 backdrop-blur-xl bg-accent/10 h-8"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <HiChevronUp className="text-accent-fg" />
        <span className="text-sm text-accent-fg">返回顶部</span>
      </button>
    </div>
  )
}

// ─── Main page ──────────────────────────────────────────────────────────────
export default function StatsPage({ songs, availableYears }) {
  const { theme } = useTheme()

  const [startYear, setStartYear] = useState(2025)
  const [startMonth, setStartMonth] = useState(3)
  const [endYear, setEndYear] = useState(2026)
  const [endMonth, setEndMonth] = useState(2)

  // Clamp: end must not be before start
  const effectiveEndYear = endYear < startYear ? startYear : endYear
  const effectiveEndMonth =
    effectiveEndYear === startYear && endMonth < startMonth ? startMonth : endMonth

  const monthsInRange = useMemo(() => {
    const months = []
    let y = startYear, m = startMonth, s = 0
    while (
      (y < effectiveEndYear || (y === effectiveEndYear && m <= effectiveEndMonth)) &&
      s < 200
    ) {
      months.push({ year: y, month: m })
      if (++m > 12) { m = 1; y++ }
      s++
    }
    return months
  }, [startYear, startMonth, effectiveEndYear, effectiveEndMonth])

  const stats = useMemo(() => {
    const startDate = new Date(startYear, startMonth - 1, 1)
    const endDate = new Date(effectiveEndYear, effectiveEndMonth, 0)

    const songPerfs = {}, artistPerfs = {}, monthlyPerfs = {}, monthlyUnique = {}, nameArtistMap = {}
    const langPerfs = {}
    const dowPerfs = new Array(7).fill(0)  // index 0 = Mon … 6 = Sun
    const uniqueDateSet = new Set()
    const dateSongCount = {}

    songs.forEach(song => {
      nameArtistMap[song.song_name] = song.artist
      const langs = (song.language || '').split('，').map(s => s.trim()).filter(Boolean)

      song.dates.forEach(dateStr => {
        const [y, mo, d] = dateStr.split('/').map(Number)
        if (!y || !mo || !d) return
        const date = new Date(y, mo - 1, d)
        if (date < startDate || date > endDate) return

        const monthKey = `${y}/${mo}`
        const dayKey = `${y}/${mo}/${d}` // normalized

        songPerfs[song.song_name] = (songPerfs[song.song_name] || 0) + 1
        if (song.artist) artistPerfs[song.artist] = (artistPerfs[song.artist] || 0) + 1

        if (!monthlyPerfs[monthKey]) monthlyPerfs[monthKey] = {}
        monthlyPerfs[monthKey][song.song_name] = (monthlyPerfs[monthKey][song.song_name] || 0) + 1

        if (!monthlyUnique[monthKey]) monthlyUnique[monthKey] = new Set()
        monthlyUnique[monthKey].add(song.song_name)

        langs.forEach(lang => { langPerfs[lang] = (langPerfs[lang] || 0) + 1 })

        // Day of week: JS getDay() 0=Sun → remap to Mon=0…Sun=6
        const jsDay = date.getDay()
        dowPerfs[jsDay === 0 ? 6 : jsDay - 1]++

        uniqueDateSet.add(dayKey)
        dateSongCount[dayKey] = (dateSongCount[dayKey] || 0) + 1
      })
    })

    const top15 = Object.entries(songPerfs).sort(([, a], [, b]) => b - a).slice(0, 15)
      .map(([name, count], i) => ({ name, count, rank: i + 1, artist: nameArtistMap[name] || '' }))

    const topArtists = Object.entries(artistPerfs).sort(([, a], [, b]) => b - a).slice(0, 15)
      .map(([name, count], i) => ({ name, count, rank: i + 1 }))

    const monthlyTop = monthsInRange.map(({ year, month }) => {
      const e = Object.entries(monthlyPerfs[`${year}/${month}`] || {}).sort(([, a], [, b]) => b - a)
      return { year, month, topSong: e[0]?.[0] || null, count: e[0]?.[1] || 0 }
    })

    const monthlySongCount = monthsInRange.map(({ year, month }) => ({
      year, month, count: monthlyUnique[`${year}/${month}`]?.size || 0,
    }))

    const totalPerformances = Object.values(songPerfs).reduce((a, b) => a + b, 0)
    // Count by array index so same-name songs with different artists are counted separately
    const totalUniqueSongs = songs.filter(song =>
      song.dates.some(dateStr => {
        const [y, mo, d] = dateStr.split('/').map(Number)
        if (!y || !mo || !d) return false
        const date = new Date(y, mo - 1, d)
        return date >= startDate && date <= endDate
      })
    ).length
    const uniqueSessions = uniqueDateSet.size
    const sessionCounts = Object.values(dateSongCount)
    const maxInSession = sessionCounts.length ? Math.max(...sessionCounts) : 0
    const avgPerSession = uniqueSessions ? totalPerformances / uniqueSessions : 0

    return {
      top15, monthlyTop, topArtists, monthlySongCount,
      totalPerformances, totalUniqueSongs, langPerfs, dowPerfs,
      uniqueSessions, maxInSession, avgPerSession,
    }
  }, [songs, startYear, startMonth, effectiveEndYear, effectiveEndMonth, monthsInRange])

  const setPreset = (sy, sm, ey, em) => {
    setStartYear(sy); setStartMonth(sm); setEndYear(ey); setEndMonth(em)
  }
  const isDefaultPreset =
    startYear === 2025 && startMonth === 3 &&
    effectiveEndYear === 2026 && effectiveEndMonth === 2

  const top15Max = stats.top15[0]?.count || 1
  const artistMax = stats.topArtists[0]?.count || 1
  const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1)

  const summaryPills = [
    { label: '不重复歌曲', value: stats.totalUniqueSongs, unit: '首' },
    { label: '总演唱次数', value: stats.totalPerformances, unit: '次' },
    { label: '统计月份', value: monthsInRange.length, unit: '个月' },
    { label: '演唱场次', value: stats.uniqueSessions, unit: '场' },
    { label: '日均演唱', raw: stats.avgPerSession.toFixed(1), unit: '首' },
    { label: '单日最多', value: stats.maxInSession, unit: '首' },
  ]

  return (
    <div data-theme={theme}>
      <Background />
      <Head>
        <title>数据统计</title>
        <link rel="icon" type="image/x-icon" href="/favicon.webp" />
      </Head>

      <div className="relative z-10 max-w-[1100px] mx-auto px-4 py-8">

        {/* Page header */}
        <motion.div
          className="flex items-center justify-between mb-6"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div className="flex items-center space-x-2">
            <BsBarChartFill className="text-accent text-xl" />
            <h1 className="text-title font-bold text-label">数据统计</h1>
          </div>
          <Link
            href="/"
            className="flex items-center space-x-1 bg-accent-bg rounded-full px-3 py-1.5 hover:scale-105 transition-transform"
          >
            <HiChevronLeft className="text-accent-fg" />
            <span className="text-sm text-accent-fg">返回歌单</span>
          </Link>
        </motion.div>

        {/* Date range filter */}
        <motion.div
          className="bg-secondary-background/60 backdrop-blur-sm rounded-2xl p-4 mb-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
        >
          <p className="text-sm text-secondary-label mb-3">时间范围</p>

          {/* Preset buttons */}
          <div className="flex flex-wrap gap-2 mb-3">
            <button
              className={`text-xs px-3 py-1 rounded-full transition-all ${
                isDefaultPreset ? 'bg-accent text-white' : 'bg-accent-bg text-accent-fg hover:scale-105'
              }`}
              onClick={() => setPreset(2025, 3, 2026, 2)}
            >
              25/3–26/2
            </button>
            {availableYears.map(year => {
              const active =
                startYear === year && startMonth === 1 &&
                effectiveEndYear === year && effectiveEndMonth === 12
              return (
                <button
                  key={year}
                  className={`text-xs px-3 py-1 rounded-full transition-all ${
                    active ? 'bg-accent text-white' : 'bg-accent-bg text-accent-fg hover:scale-105'
                  }`}
                  onClick={() => setPreset(year, 1, year, 12)}
                >
                  {year}年全年
                </button>
              )
            })}
          </div>

          {/* Custom selects */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-secondary-label">从</span>
            <SelectPill value={startYear} onChange={setStartYear}>
              {availableYears.map(y => <option key={y} value={y}>{y}年</option>)}
            </SelectPill>
            <SelectPill value={startMonth} onChange={setStartMonth}>
              {monthOptions.map(m => <option key={m} value={m}>{m}月</option>)}
            </SelectPill>
            <span className="text-xs text-secondary-label">到</span>
            <SelectPill value={effectiveEndYear} onChange={setEndYear}>
              {availableYears.map(y => <option key={y} value={y}>{y}年</option>)}
            </SelectPill>
            <SelectPill value={effectiveEndMonth} onChange={setEndMonth}>
              {monthOptions.map(m => <option key={m} value={m}>{m}月</option>)}
            </SelectPill>
            {!isDefaultPreset && (
              <button
                className="text-xs px-3 py-1 rounded-full bg-accent-oen-2/15 text-accent-oen-2 hover:bg-accent-oen-2/25 transition-all"
                onClick={() => setPreset(2025, 3, 2026, 2)}
              >
                重置
              </button>
            )}
          </div>
        </motion.div>

        {/* Summary pills */}
        <motion.div
          className="flex flex-wrap gap-2 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          {summaryPills.map(({ label, value, raw, unit }) => (
            <div key={label} className="bg-accent-bg rounded-full px-4 py-1.5">
              <span className="text-xs text-secondary-label">{label} </span>
              <span className="text-sm font-bold text-accent-fg">
                {raw !== undefined ? raw : <AnimatedNumber value={value} />}
              </span>
              <span className="text-xs text-secondary-label"> {unit}</span>
            </div>
          ))}
        </motion.div>

        {/* Chart 1: Top 15 songs */}
        <Section title="演唱次数 Top 15" subtitle="统计区间内演唱次数最多的歌曲">
          {stats.top15.length > 0
            ? stats.top15.map((s, i) => (
                <HBar
                  key={s.rank}
                  label={s.name}
                  sublabel={s.artist}
                  value={s.count}
                  maxValue={top15Max}
                  rank={s.rank}
                  accentClass="bg-accent"
                  totalPerfs={stats.totalPerformances}
                  delay={i * 0.04}
                />
              ))
            : <p className="text-sm text-secondary-label">暂无数据</p>}
        </Section>

        {/* Chart 2: Monthly top song */}
        <Section title="每月最受欢迎的歌曲" subtitle="各月演唱次数最多的歌曲">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {stats.monthlyTop.map((m, i) => (
              <MonthCard
                key={`${m.year}-${m.month}`}
                {...m}
                delay={Math.min(i * 0.03, 0.45)}
              />
            ))}
          </div>
        </Section>

        {/* Chart 3: Top 15 artists */}
        <Section title="最受欢迎的原唱 Top 15" subtitle="统计区间内演唱次数最多的原唱艺术家">
          {stats.topArtists.length > 0
            ? stats.topArtists.map((a, i) => (
                <HBar
                  key={a.rank}
                  label={a.name}
                  value={a.count}
                  maxValue={artistMax}
                  rank={a.rank}
                  accentClass="bg-accent-oen-2"
                  totalPerfs={stats.totalPerformances}
                  delay={i * 0.04}
                />
              ))
            : <p className="text-sm text-secondary-label">暂无数据</p>}
        </Section>

        {/* Chart 4: Monthly unique song count */}
        <Section title="每月不重复歌曲数" subtitle="各月演唱的不重复歌曲数量">
          <VerticalBars data={stats.monthlySongCount} />
        </Section>

        {/* Chart 5: Language distribution */}
        <Section title="语言分布" subtitle="按演唱次数统计各语言占比">
          <LanguageChart data={stats.langPerfs} />
        </Section>

        {/* Chart 6: Day of week */}
        <Section title="周几最爱唱歌" subtitle="按星期统计演唱次数分布">
          <DayChart data={stats.dowPerfs} />
        </Section>

      </div>

      <ScrollToTop />
    </div>
  )
}

// ─── CSV parser: handles quoted fields with commas ──────────────────────────
function parseCSVLine(line) {
  const fields = []
  let current = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { current += '"'; i++ }
      else inQuotes = !inQuotes
    } else if (ch === ',' && !inQuotes) {
      fields.push(current); current = ''
    } else {
      current += ch
    }
  }
  fields.push(current)
  return fields
}

// ─── Static props: parse CSV at build time ──────────────────────────────────
export async function getStaticProps() {
  const fs = require('fs')
  const path = require('path')

  const csvPath = path.join(process.cwd(), 'scripts', 'music_data.csv')
  const csvContent = fs.readFileSync(csvPath, 'utf-8')

  const dateRegex = /^\d{4}\/\d{1,2}\/\d{1,2}$/

  const songs = csvContent
    .split('\n')
    .slice(1) // skip header
    .map(l => l.trim().replace(/\r$/, ''))
    .filter(l => l)
    .map(line => {
      const f = parseCSVLine(line)
      const song_name = (f[1] || '').trim()
      const artist = (f[3] || '').trim()
      const datesStr = (f[4] || '').trim()
      const language = (f[6] || '').trim()
      const dates = datesStr.split('，').map(d => d.trim()).filter(d => dateRegex.test(d))
      return { song_name, artist, dates, language }
    })
    .filter(s => s.song_name)

  const yearSet = new Set()
  songs.forEach(s => s.dates.forEach(d => {
    const y = parseInt(d.split('/')[0])
    if (!isNaN(y)) yearSet.add(y)
  }))

  return { props: { songs, availableYears: [...yearSet].sort((a, b) => a - b) } }
}
