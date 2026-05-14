import React, { useState, useMemo } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { HiChevronLeft, HiPlay } from 'react-icons/hi'
import { useTheme } from 'next-themes'
import detailStyles from '../../styles/SongDetail.module.css'
import BiliPlayerModal from '../../components/BiliPlayerModal.component'

export async function getStaticPaths() {
  const fs = require('fs')
  const path = require('path')
  const musicList = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'public', 'music_list.json'), 'utf-8')
  )
  const paths = musicList.map(song => ({
    params: { id: String(song.index) }
  }))
  return { paths, fallback: false }
}

export async function getStaticProps(context) {
  const fs = require('fs')
  const path = require('path')
  const musicList = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'public', 'music_list.json'), 'utf-8')
  )
  const id = parseInt(context.params.id, 10)
  const song = musicList.find(s => s.index === id) || null
  if (!song) return { notFound: true }

  const dates = (song.date_list || '')
    .split(/，/g)
    .map(d => d.trim())
    .filter(d => /^\d{4}\/\d{1,2}\/\d{1,2}$/.test(d))

  const bvids = (song.BVID || '')
    .split(/，/g)
    .map(b => b.trim())
    .filter(Boolean)

  const tags = (song.tag || '')
    .split(/，/g)
    .map(t => t.trim())
    .filter(Boolean)

  return {
    props: {
      song: {
        ...song,
        dates,
        bvids,
        tags,
      }
    }
  }
}

function formatDate(dateStr) {
  const parts = dateStr.split('/')
  return `${parts[0]}年${parseInt(parts[1])}月${parseInt(parts[2])}日`
}

export default function SongDetail({ song }) {
  const { theme } = useTheme()

  const [visible, setVisible] = useState(false)
  const [title, setTitle] = useState('')
  const [bvid, setBvid] = useState('')
  const [bvidList, setBvidList] = useState([])
  const [selectedBvid, setSelectedBvid] = useState('')
  const [audioOnly, setAudioOnly] = useState(false)

  const stubEffThis = useMemo(() => ({
    get modalPlayerShow() { return [visible, setVisible] },
    get modalPlayerSongName() { return [title, setTitle] },
    get BVID() { return [bvid, setBvid] },
    get bvid_list() { return [bvidList, setBvidList] },
    get bvid_selected() { return [selectedBvid, setSelectedBvid] },
    get bili_player_audio_only() { return [audioOnly, setAudioOnly] },
    hide_bili_player: () => setVisible(false),
    current_album: [],
  }), [visible, title, bvid, bvidList, selectedBvid, audioOnly])

  function showPlayer(songTitle, bvidStr) {
    setTitle(songTitle)
    setVisible(true)
    setBvid(bvidStr)
    const list = bvidStr.split(/，/g).filter(Boolean)
    setBvidList(list)
    setSelectedBvid(list[0] || '')
    setAudioOnly(false)
  }

  const dates = song.dates || []
  const firstDate = dates[0] || ''
  const lastDate = dates[dates.length - 1] || ''
  const bvids = song.bvids || []
  const tags = song.tags || []

  const stagger = { visible: { opacity: 1, x: 0 } }

  return (
    <div data-theme={theme}>
      <div className="fixed inset-0 transition-colors duration-300 bg-main-page-background" style={{ zIndex: -1 }} />

      <Head>
        <title>{`${song.song_name} - 三理Mit3uri 歌单`}</title>
        <meta name="description" content={`${song.song_name} - ${song.artist || '未知原唱'}，共演唱 ${song.song_count} 次`} />
        <link rel="icon" type="image/x-icon" href="/favicon.webp" />
      </Head>

      <div className="min-h-screen max-w-[1100px] mx-auto px-4 pb-16">
        {/* Back navigation */}
        <nav className="pt-6 pb-4">
          <Link href="/" className={`${detailStyles.backLink} text-secondary-label`}>
            <HiChevronLeft className="text-lg" />
            <span>返回歌单</span>
          </Link>
        </nav>

        {/* Hero section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-title font-bold text-label mb-2">{song.song_name}</h1>
          {song.song_translated_name && (
            <p className="text-subtitle text-secondary-label mb-2">{song.song_translated_name}</p>
          )}
          <p className="text-base text-secondary-label">
            {song.artist || '未知原唱'}
          </p>
        </motion.div>

        {/* Info grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8"
        >
          <div className="bg-secondary-background/60 backdrop-blur-sm rounded-2xl p-4">
            <div className="text-xs text-secondary-label mb-1">语言</div>
            <div className="text-base text-label font-medium">{song.language || '未知'}</div>
          </div>
          <div className="bg-secondary-background/60 backdrop-blur-sm rounded-2xl p-4">
            <div className="text-xs text-secondary-label mb-1">演唱次数</div>
            <div className="text-base text-label font-medium">{song.song_count} 次</div>
          </div>
          <div className="bg-secondary-background/60 backdrop-blur-sm rounded-2xl p-4">
            <div className="text-xs text-secondary-label mb-1">首次演唱</div>
            <div className="text-sm text-label font-medium">{firstDate ? formatDate(firstDate) : '-'}</div>
          </div>
          <div className="bg-secondary-background/60 backdrop-blur-sm rounded-2xl p-4">
            <div className="text-xs text-secondary-label mb-1">最近演唱</div>
            <div className="text-sm text-label font-medium">{lastDate ? formatDate(lastDate) : '-'}</div>
          </div>
        </motion.div>

        {/* Tags */}
        {tags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mb-8"
          >
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <span
                  key={tag}
                  className={`${detailStyles.tagPill} bg-accent/10 text-accent-fg`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Performance timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-subtitle font-bold text-label mb-4">
            演出历史
            <span className="text-sm text-secondary-label font-normal ml-2">共 {dates.length} 场</span>
          </h2>
          {dates.length > 0 ? (
            <div className={`${detailStyles.timeline} text-secondary-label`}>
              {dates.map((date, i) => (
                <motion.div
                  key={date}
                  className={detailStyles.timelineItem}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.25 + i * 0.02 }}
                >
                  {formatDate(date)}
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-secondary-label text-sm">暂无演出记录</p>
          )}
        </motion.div>

        {/* BVID clips */}
        {bvids.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="mb-8"
          >
            <h2 className="text-subtitle font-bold text-label mb-4">
              歌切记录
              <span className="text-sm text-secondary-label font-normal ml-2">{bvids.length} 条</span>
            </h2>
            <div className="flex flex-wrap gap-2">
              {bvids.map(bv => (
                <button
                  key={bv}
                  type="button"
                  className={`${detailStyles.bvidChip} bg-accent/10 text-accent-fg`}
                  onClick={() => showPlayer(song.song_name, bv)}
                >
                  <HiPlay className="text-xs mr-1" />
                  {bv}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Remarks */}
        {song.remarks && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-8"
          >
            <h2 className="text-subtitle font-bold text-label mb-3">备注</h2>
            <div className="bg-secondary-background/60 backdrop-blur-sm rounded-2xl p-4">
              <p className="text-base text-label">{song.remarks}</p>
            </div>
          </motion.div>
        )}

        {/* Bottom back link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center pt-4"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-1 bg-accent-bg rounded-full px-4 py-2 hover:scale-105 transition-transform text-accent-fg"
          >
            <HiChevronLeft />
            <span>返回歌单</span>
          </Link>
        </motion.div>
      </div>

      <BiliPlayerModal
        props={[
          title,
          visible,
          bvidList,
          selectedBvid,
          audioOnly,
          stubEffThis,
        ]}
      />
    </div>
  )
}
