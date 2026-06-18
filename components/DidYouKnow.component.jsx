import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiLightBulb, HiRefresh } from 'react-icons/hi'
import { song_list } from '../config/song_list'

function parseDates(dateListStr) {
  return (dateListStr || '')
    .split(/，/g)
    .map(d => d.trim())
    .filter(d => /^\d{4}\/\d{1,2}\/\d{1,2}$/.test(d))
    .map(d => {
      // 归一化为 YYYY/MM/DD 格式，避免 "2026/1/23" 和 "2026/01/23" 被当成不同 key
      const parts = d.split('/')
      return `${parts[0]}/${parts[1].padStart(2, '0')}/${parts[2].padStart(2, '0')}`
    })
}

function daysSince(dateStr) {
  const d = new Date(dateStr.replace(/\//g, '-'))
  return Math.floor((Date.now() - d.getTime()) / 86400000)
}

export default function DidYouKnow() {
  const facts = useMemo(() => {
    const results = []

    // Day-counts (used by multiple facts)
    const dayCount = {}
    song_list.forEach(s => {
      const dates = parseDates(s.date_list)
      dates.forEach(d => { dayCount[d] = (dayCount[d] || 0) + 1 })
    })

    // 1. Most performed song overall
    const topSong = [...song_list].sort((a, b) =>
      parseInt(b.song_count) - parseInt(a.song_count)
    )[0]
    if (topSong && parseInt(topSong.song_count) > 0) {
      results.push({
        id: 'most-performed',
        text: `唱得最多的歌是《${topSong.song_name}》，共演唱了 ${topSong.song_count} 次！`,
      })
    }

    // 2. Most performed song per language
    const langGroups = {}
    song_list.forEach(s => {
      const langs = (s.language || '').split(/，/g).map(l => l.trim()).filter(Boolean)
      langs.forEach(lang => {
        if (!langGroups[lang]) langGroups[lang] = []
        langGroups[lang].push(s)
      })
    })
    Object.entries(langGroups).forEach(([lang, songs]) => {
      const top = songs.sort((a, b) => parseInt(b.song_count) - parseInt(a.song_count))[0]
      if (top && parseInt(top.song_count) > 0) {
        results.push({
          id: `most-performed-${lang}`,
          text: `唱得最多的${lang}歌是《${top.song_name}》，共演唱了 ${top.song_count} 次！`,
        })
      }
    })

    // 3. Total performances this year
    const thisYear = new Date().getFullYear()
    let thisYearPerfs = 0
    song_list.forEach(s => {
      const dates = parseDates(s.date_list)
      dates.forEach(d => {
        if (parseInt(d.split('/')[0]) === thisYear) thisYearPerfs++
      })
    })
    if (thisYearPerfs > 0) {
      results.push({
        id: 'this-year',
        text: `今年（${thisYear}年）已经演唱了 ${thisYearPerfs} 次！`,
      })
    }

    // 4. Longest song name
    const longestName = [...song_list].sort((a, b) => b.song_name.length - a.song_name.length)[0]
    if (longestName) {
      results.push({
        id: 'longest-name',
        text: `名字最长的歌是《${longestName.song_name}》，足足 ${longestName.song_name.length} 个字！`,
      })
    }

    // 5. Earliest performed song
    let earliestSong = null
    let earliestDate = Infinity
    song_list.forEach(s => {
      parseDates(s.date_list).forEach(d => {
        const t = new Date(d.replace(/\//g, '-')).getTime()
        if (t < earliestDate) { earliestDate = t; earliestSong = s }
      })
    })
    if (earliestSong) {
      const d = new Date(earliestDate)
      results.push({
        id: 'earliest',
        text: `最早演唱的歌曲是《南风过隙》，首次演唱于2025年3月1日`,
      })
    }

    // 6. Busiest day
    const busiestDay = Object.entries(dayCount).sort((a, b) => b[1] - a[1])[0]
    if (busiestDay && busiestDay[1] > 1) {
      results.push({
        id: 'busiest-day',
        text: `最忙碌的一天是 ${busiestDay[0].split('/')[0]}年${parseInt(busiestDay[0].split('/')[1])}月${parseInt(busiestDay[0].split('/')[2])}日，那天唱了 ${busiestDay[1]} 首歌！`,
      })
    }

    // 7. Song with longest gap between performances
    let maxGapSong = null
    let maxGapDays = 0
    song_list.forEach(s => {
      const dates = parseDates(s.date_list).map(d => new Date(d.replace(/\//g, '-'))).sort((a, b) => a - b)
      for (let i = 1; i < dates.length; i++) {
        const gap = Math.floor((dates[i] - dates[i - 1]) / 86400000)
        if (gap > maxGapDays) { maxGapDays = gap; maxGapSong = s }
      }
    })
    if (maxGapSong && maxGapDays > 0) {
      results.push({
        id: 'longest-gap',
        text: `《${maxGapSong.song_name}》两次演唱间隔最长达 ${maxGapDays} 天！`,
      })
    }

    // 8. Total unique artists
    const artistSet = new Set(song_list.map(s => s.artist).filter(Boolean))
    if (artistSet.size > 0) {
      results.push({
        id: 'unique-artists',
        text: `歌单里共收录了 ${artistSet.size} 位不同原唱的歌！`,
      })
    }

    // 9. Language distribution
    const langCount = {}
    song_list.forEach(s => {
      const langs = (s.language || '').split(/，/g).map(l => l.trim()).filter(Boolean)
      langs.forEach(l => { langCount[l] = (langCount[l] || 0) + 1 })
    })
    const sortedLangs = Object.entries(langCount).sort((a, b) => b[1] - a[1])
    if (sortedLangs.length > 0) {
      const langSummary = sortedLangs.map(([l, c]) => `${l}${c}首`).join('，')
      results.push({
        id: 'lang-dist',
        text: `歌曲语言分布：${langSummary}`,
      })
    }


    // 10. Average songs per performance day
    const uniqueDays = Object.keys(dayCount).length
    const totalPerfs = Object.values(dayCount).reduce((a, b) => a + b, 0)
    if (uniqueDays > 0) {
      const avg = (totalPerfs / uniqueDays).toFixed(1)
      results.push({
        id: 'avg-per-day',
        text: `平均每次直播唱 ${avg} 首歌（共 ${uniqueDays} 个直播日）`,
      })
    }

    // 11. Song not performed recently
    const songsWithLastDate = song_list.map(s => {
      const dates = parseDates(s.date_list)
      if (dates.length === 0) return null
      dates.sort()
      const lastDate = dates[dates.length - 1]
      return { song: s, lastDate, daysSince: daysSince(lastDate) }
    }).filter(Boolean)
    songsWithLastDate.sort((a, b) => b.daysSince - a.daysSince)
    const mostStale = songsWithLastDate[0]
    if (mostStale && mostStale.daysSince > 0) {
      results.push({
        id: 'not-recent',
        text: `《${mostStale.song.song_name}》已经 ${mostStale.daysSince} 天没唱过了！`,
      })
    }

    // 12. Most-covered artist (split / for collaborations)
    const artistSongCount = {}
    song_list.forEach(s => {
      const artists = (s.artist || '未知').split('/').map(a => a.trim()).filter(Boolean)
      artists.forEach(artist => {
        artistSongCount[artist] = (artistSongCount[artist] || 0) + 1
      })
    })
    const topArtist = Object.entries(artistSongCount).sort((a, b) => b[1] - a[1])[0]
    if (topArtist && topArtist[1] > 0) {
      results.push({
        id: 'most-artist',
        text: `歌单里「${topArtist[0]}」的歌最多，共 ${topArtist[1]} 首！`,
      })
    }

    return results
  }, [])

  const getRandomFact = useCallback((excludeId) => {
    const pool = excludeId ? facts.filter(f => f.id !== excludeId) : facts
    if (pool.length === 0) return facts[0]
    return pool[Math.floor(Math.random() * pool.length)]
  }, [facts])

  const [currentFact, setCurrentFact] = useState(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (facts.length > 0) {
      setCurrentFact(getRandomFact(null))
      setIsVisible(true)
    }
  }, [facts, getRandomFact])

  const nextFact = useCallback(() => {
    setIsVisible(false)
    setTimeout(() => {
      setCurrentFact(prev => getRandomFact(prev?.id))
      setIsVisible(true)
    }, 300)
  }, [getRandomFact])

  if (!currentFact) return null

  return (
    <div className="px-4">
      <div className="bg-secondary-background/60 backdrop-blur-sm rounded-2xl p-4 mb-2 max-w-[1100px] mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <HiLightBulb className="text-accent-fg text-subtitle" />
            <h2 className="text-subtitle font-bold text-label">你知道吗？</h2>
          </div>
          <button
            onClick={nextFact}
            type="button"
            className="flex items-center space-x-1 bg-accent-bg rounded-full px-3 py-1.5 hover:scale-105 transition-transform"
          >
            <HiRefresh className="text-accent-fg" />
            <span className="text-sm text-accent-fg">换一个</span>
          </button>
        </div>
        <AnimatePresence mode="wait">
          {isVisible && (
            <motion.p
              key={currentFact.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-base text-label mt-3"
            >
              {currentFact.text}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
