import React, { memo, useCallback, useEffect, useState, useRef, useSyncExternalStore } from 'react'

import Head from 'next/head'
import Link from 'next/link'
import Image from "next/legacy/image"

import styles from '../styles/Home.module.css'
import 'react-toastify/dist/ReactToastify.css'

import { Col, Container, Form } from 'react-bootstrap'

import Title from '../components/Title.component'
import SongList from '../components/SongList.component'
import BiliPlayerModal from '../components/BiliPlayerModal.component'
import SongListFilter from '../components/SongListFilter.component'
import MusicPlayerView from '../components/MusicPlayerView.component'
import HeaderView from '../components/HeaderView.component'
import FeaturedSongList from '../components/FeaturedSongList.component'

import imageLoader from '../utils/ImageLoader'

import config, { theme } from '../config/constants'

import { 
  eff_get, 
  eff_set, 
  get_theme, 
  is_favorite_song, 
  set_theme, 
  favorite_date,
  migrate_localstorage,
  upgrade_app
} from '../config/controllers'

import styled, { css } from "styled-components";

import { song_list } from '../config/song_list'

import headerImage from '../public/assets/images/theme/header.png'
import headerImageShining from '../public/assets/images/theme/header.png'
import headerImageShiningFront from '../public/assets/images/theme/header.png'

import {
  BsPalette2
} from 'react-icons/bs'
import {
  HiChevronUp
} from 'react-icons/hi'

import { useTheme } from 'next-themes'

const BackgroundView = () => {
  return (
    <div
      className={`${styles.outerContainer} transition-all duration-300 bg-main-page-background`}
      style={{ cursor: theme.cursor.normal }}
    />
  );
};

function subscribe(callback) {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

function getSnapshot() {
  return (window.localStorage.getItem('theme') || 'shining');
}

export function useThemeName() {
  return useSyncExternalStore(subscribe, getSnapshot, () => []);
}

function ActivityImage(props) {
  const INACTIVE_TIMEOUT = 3 * 1000;

  const [isActive, setIsActive] = useState(false);
  const [initActive, setInitActive] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setInitActive(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleActivity = () => {
      setIsActive(true);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = window.setTimeout(() => {
        setIsActive(false);
      }, INACTIVE_TIMEOUT);
    };

    const events = [
      'mousedown',
      'mousemove',
      'keydown',
      'scroll',
      'touchstart',
    ];

    events.forEach((ev) => window.addEventListener(ev, handleActivity));

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      events.forEach((ev) => window.removeEventListener(ev, handleActivity));
    };
  }, []);

  const themeName = useThemeName();

  return (
    <div className="absolute right-0 top-0 w-full sm:w-[85%] 3xl:w-[75%] 4xl:w-[70%] 5xl:w-[65%]">
      <Image
        src={props.selectTheme(themeName)}
        className={`header-image-front transition-opacity duration-500 header-image-front ${!isActive ? 'z-[100] opacity-100' : 'opacity-0 pointer-events-none}'}`}
        alt="header"
        unoptimized
        layout="responsive"
        loader={({ src }) => src}
        onLoad={() => {
          setIsActive(false);
        }}
      />
    </div>
  );
}


export default function Home() {
  // EffThis
  const [ EffThis ] = useState({
    set_current_album: (album) => {
      EffThis.current_album = album;
    }
  });

  // state variables
  const [ bili_player_visibility ] = EffThis.modalPlayerShow     = useState(false);

  const [ bili_player_title      ] = EffThis.modalPlayerSongName = useState('');

                                     EffThis.BVID                = useState('');

  const [ bvid_list              ] = EffThis.bvid_list           = useState([]);

  const [ bvid_selected          ] = EffThis.bvid_selected       = useState('');

  const [ currently_playing ] = EffThis.currently_playing = useState(-1);

  const {theme, setTheme} = useTheme();

  useEffect(() => {
    migrate_localstorage(song_list);
  }, []);

  // EffThis.functions
  useEffect(() => {
    EffThis.show_bili_player = ({title, bvid, url}) => {
      if (bvid) {
        eff_set(EffThis, 'modalPlayerShow', true);
        eff_set(EffThis, 'modalPlayerSongName', title);
        eff_set(EffThis,'BVID', bvid);
        const list = bvid.split(/，/g);
        const selected = list[0];
        if (selected && eff_get(EffThis, 'bvid_selected') !== selected) {
          eff_set(EffThis, 'bvid_selected', selected);
          eff_set(EffThis, 'bvid_list', list);
        }
      } else if (url) {  // netease url
        window.open('https://music.163.com/#/dj?id=' + url)
      }
    };
    EffThis.hide_bili_player = () => eff_set(EffThis, 'modalPlayerShow', false);
    
    EffThis.play_music_at = (idx) => {
      eff_set(EffThis, 'currently_playing', idx);
    }
    EffThis.play_music_for_name = (name) => { 
      console.error("find name: "+name)
      const idx = EffThis.current_album.findIndex(song => song.song_name === name);
      if (idx !== -1) {
        eff_set(EffThis, 'currently_playing', idx);
      }
    }
    EffThis.set_theme = (theme) => {
      setTheme(theme);
    }
    EffThis.current_theme = () => theme;
  }, [ EffThis, theme ]);

  // state variables
  const [filter_state] = EffThis.filter_state = useState({
    lang: "",
    initial: "",
    paid: false,
    remark: "",
    sorting_method: "default",
    is_local: false,
  });

  const [searchBox, setSearchBox] = EffThis.searchBox = useState('');

  // EffThis.functions
  useEffect(() => {
    //语言过滤
    EffThis.do_filter_lang = (lang) => eff_set(EffThis, 'filter_state', {
      ...eff_get(EffThis, 'filter_state'),
      lang: lang,
      initial: "",
      paid: false,
      remark: ""
    });

    //首字母过滤
    EffThis.do_filter_initial = (initial) => eff_set(EffThis, 'filter_state', {
      ...eff_get(EffThis, 'filter_state'),
      lang: "华语",
      initial: initial,
      paid: false,
      remark: "",
    });

    EffThis.do_sort = (method) => eff_set(EffThis, 'filter_state', {
      ...eff_get(EffThis, 'filter_state'),
      sorting_method: method
    });

    EffThis.do_filter_local = (is_local) => eff_set(EffThis, 'filter_state', {
      ...eff_get(EffThis, 'filter_state'),
      is_local: is_local
    });

    EffThis.do_set_search = (search) => eff_set(EffThis, 'searchBox', search);

  }, [EffThis]);

  const [dynamicTheme, setDynamicTheme] = useState(false);
  const videoRef = React.useRef(null);
  useEffect(() => {
    setDynamicTheme(config.theme[theme].dynamic);
    upgrade_app('2.0.6', () => {
      EffThis.set_theme('shining');
      setDynamicTheme(false);
    })
  }, [theme]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current
        .play()
        .then(() => { })
        .catch((e) => {
          setDynamicTheme(false);
          return e;
        });
    }
  }, [theme]);
  
  const themeName = useThemeName();

  const title = `${config.Name}的歌单`;
  return (
    <div data-theme={theme}>
      <BackgroundView />
      <Head>
        <title>{title}</title>
        <meta
          name="keywords"
          content={`B站,bilibili,哔哩哔哩,vtuber,虚拟主播,电台唱见,歌单,${config.Name}`}
        />
        <meta name="description" content={`${config.Name}的歌单`} />
        <link rel="icon" type="image/x-icon" href="/favicon.png"></link>
        {/* <link
          rel="preload"
          href="/assets/images/emoticon_love.webp"
          as="image"
        />
        <link
          rel="preload"
          href="/assets/images/emoticon_stars_in_your_eyes.webp"
          as="image"
        />
        <link
          rel="preload"
          href="/assets/images/emoticon_bgs1314baobaomuamualovelove.webp"
          as="image"
        />
        <link
          rel="preload"
          href="/assets/images/bgs1314baobaomuamualovelove.gif"
          as="image"
          type="image/gif"
        /> */}
        {/* <link
          rel="preload"
          href="/assets/images/question_mark.gif"
          as="image"
          type="image/gif"
        />
        <link
          rel="preload"
          href='/api/v2/avatar'
          as="image"
          type='image/webp'
        /> */}
        {/* <link
          rel="preload"
          href='/assets/images/theme/header_shining_front.png'
          as="image"
          type='image/png'
        /> */}
      </Head>

      <div
        className="z-[100] bg-gradient-to-b 
        from-transparent to-[30rem] w-screen"
      >
        <div className="absolute right-0 top-0 w-full sm:w-[85%] 3xl:w-[75%] 4xl:w-[70%] 5xl:w-[65%]">
          { !dynamicTheme ?
            <Image
              src={(() => {
                switch (theme) {
                  case 'shining': return headerImage;
                  default: return headerImage;
                }
              })()}
              className="header-image"
              alt="header"
              unoptimized
              layout="responsive"
              loader={({ src }) => src}
            />
            : <video
                autoPlay
                ref={videoRef}
                loop
                muted
                playsInline
                disablePictureInPicture={true}
                className="header-image relative right-0 top-0"
                width="100%"
              >
                {(
                  () => {
                    switch (themeName) {
                      case 'brisk':
                        return (
                          <>
                            <source src="/api/v2/theme/dynamic?theme=brisk.mp4" type="video/mp4" />
                            <source src="/api/v2/theme/dynamic?theme=brisk.webm" type="video/webm" />
                          </>
                        )
                      case 'idol':
                        return (
                          <>
                            <source src="/api/v2/theme/dynamic?theme=idol.mp4" type="video/mp4" />
                            <source src="/api/v2/theme/dynamic?theme=idol.webm" type="video/webm" />
                          </>
                        )
                  
                    }    
                  }
                )()}
              </video>
          }
        </div>
        {
          themeName === 'shining' &&
          <ActivityImage selectTheme={(themeName) => {
            switch (themeName) {
              case 'shining':
                return headerImageShiningFront;
              default:
                return headerImageShining;
            }
          }}/>
        }
        <section className={"main-section"}>
          <HeaderView props={[EffThis]}/>
          {/* <FeaturedSongList effthis={EffThis} datasrc={
            async (song_list) => {
              let list = null;
              await fetch("/api/v2/featured")
                .then((res) => res.json())
                .then((data) => {
                  list = data;
                });
              return list;
            }
          } title="听啥呢饼" /> */}
          <FeaturedSongList effthis={EffThis} datasrc={
              async (list) => {
                list.sort((a, b) => {
                  const a_date = a.date_list
                    .split(/，/g)
                    .map((a) => Date.parse(a))
                    .filter((a) => !isNaN(a))
                    .sort();
                  const b_date = b.date_list
                    .split(/，/g)
                    .map((a) => Date.parse(a))
                    .filter((a) => !isNaN(a))
                    .sort();
                  return b_date[b_date.length - 1] - a_date[a_date.length - 1];
                });
                return list;
            }
          } title="最近更新"/>
          <SongListFilter props={[filter_state, searchBox, EffThis]} />
          <FilteredList props={[filter_state, searchBox, EffThis]} />
          {/* <MusicPlayerView props={[currently_playing, EffThis]} /> */}
        </section>

        <FixedTool />

        <Link href={config.Repository} passHref>
          <footer className={styles.footer}>
            <Image
              loader={imageLoader}
              alt=""
              width={32}
              height={32}
              src="assets/images/github.png"
            />
            {/* <a>{ config.Footer }</a> */}
          </footer>
        </Link>
        <BiliPlayerModal
          props={[
            bili_player_title,
            bili_player_visibility,
            bvid_list,
            bvid_selected,
            EffThis,
          ]}
        />
      </div>
    </div>
  );
}

import { content_contains } from '../utils/search_engine'

/** 过滤器控件 */
const FilteredList = memo(function FilteredList({ props: [ filter_state, searchBox, EffThis ] }) {

  //过滤歌单列表
  const filteredSongList = song_list
    .map((song) => {
      if (typeof window !== 'undefined' && is_favorite_song(song.song_name)) {
        song.is_local = true;
      } else {
        song.is_local = false;
      }
      if (searchBox === "bgs1314baobaomuamualovelove" && song.song_name === "One more time, One more chance") {
        song.BVID = "BV1eVnueEEoc";
        song.date_list = "2024-4-23";
        song.song_count = 1;
      }
      return song;
    })
    .filter(
      (song) =>
        //搜索
        content_contains([
          song.language,
          song.song_name,
          song.song_translated_name,
          song.artist,
          song.remark,
        ], searchBox === "bgs1314baobaomuamualovelove" ? "One more time, One more chance" : searchBox)
        //语言
        && (filter_state.lang != ""
            ? song.language?.includes(filter_state.lang)
            : true)
        //首字母
        && (filter_state.initial != ""
            ? song.initial?.includes(filter_state.initial)
            : true)
        //类型
        && (filter_state.remark != ""
            ? song.remarks?.toLowerCase().includes(filter_state.remark)
            : true)
        //付费
        && (filter_state.paid
            ? song.paid == 1
            : true)
        && (filter_state.is_local
            ? song.is_local
            : true))
    .sort((a, b) => {
      if (filter_state.sorting_method === 'not_recently') {
        const a_date = a.date_list.split(/，/g)
          .map(a => Date.parse(a)).filter(a => !isNaN(a))
          .sort();
        const b_date = b.date_list.split(/，/g)
          .map(a => Date.parse(a)).filter(a => !isNaN(a))
          .sort();
        return a_date[a_date.length - 1] - b_date[b_date.length - 1];
      } else if (filter_state.sorting_method === 'infrequently') {
        return a.song_count - b.song_count;
      } else if (filter_state.sorting_method === 'recently' || filter_state.sorting_method === 'default') {
        const a_date = a.date_list.split(/，/g)
          .map(a => Date.parse(a)).filter(a => !isNaN(a))
          .sort();
        const b_date = b.date_list.split(/，/g)
          .map(a => Date.parse(a)).filter(a => !isNaN(a))
          .sort();
        return b_date[b_date.length - 1] - a_date[a_date.length - 1];
      } else if (filter_state.sorting_method === 'frequently') {
        return b.song_count - a.song_count;
      } else if (filter_state.is_local) {
        let a_time = favorite_date(a.song_name);
        let b_time = favorite_date(b.song_name);
        if (a_time && b_time) {
          return b_time - a_time;
        } else {
          return 0;
        }
      } else {
        return 0;
      }
    })
    .map((song, idx) => {
      song.idx = idx;
      return song;
    });

  EffThis.set_current_album(filteredSongList);

  return (
    <>
      <SongListWrapper props = {[ filteredSongList, EffThis ]}/>
    </>
  )
}, (prev, next) => {
  if (Object.is(prev, next)) return true;
  
  const prev_keys = Object.keys(prev);
  const next_keys = Object.keys(next);
  
  if (prev_keys.length !== next_keys.length) return false;

  const skips = { props: 1 };

  // props
  if (Array.isArray(prev.props) && Array.isArray(next.props)) {
    if (prev.props.length !== next.props.length) return false;
    for (const [idx, prop] of Object.entries(prev.props)) {
      if (!Object.is(prop, prev.props[idx])) {
        console.log('not equal when iterating!!!');
      }
      if (!Object.is(prop, next.props[idx])) return false;
    }
  }

  let flags = {};

  for (const key of prev_keys) {
    if (skips[key]) continue;
    if (!Object.is(prev[key], next[key])) return false;
    flags[key] = 1;
  }

  for(const key of next_keys) {
    if (skips[key] || flags[key]) continue;
    if (!Object.is(next[key], prev[key])) return false;
  }

  console.log('result: equal');
  return true;
});

/** 歌单表格 */
function SongListWrapper ({ props: [ List, EffThis ] }) {
  return (
    <Container fluid style = {{ minWidth: 'min-content' }}>
     <div className = { styles.songListMarco }>
        <div className='flex flex-row items-center'>
          <div className='w-[2.5rem] h-[2.5rem] relative mr-1 rounded-full overflow-hidden'>
            <Image src={'/assets/images/emoticon_surprise_low.png'}
              width={0} height={0} sizes='100vw' layout='fill'
              unoptimized objectFit='cover' alt='surprise'
            />
          </div>
          <span className='text-subtitle text-secondary-label font-semibold'>
            全部歌曲
          </span>
        </div>
        <SongList props = {[ List, EffThis ]}/>
     </div>
   </Container>
  );
}

function FixedTool() {
  const [to_top_btn_is_visible, set_to_top_btn_visibility] = useState(false);

  useEffect(() => {
    //检测窗口滚动
    window.addEventListener("scroll", () => {
      if (window.scrollY > 600) {
        set_to_top_btn_visibility(true);
      } else {
        set_to_top_btn_visibility(false);
      }
    });
  }, []);
  
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  
  if (!to_top_btn_is_visible) return (<div></div>);
  
  return (
    <div className='flex flex-col items-start right-[1rem]
      bottom-[5rem] fixed space-y-1 sm:right-[calc(1rem+(100vw-(min(100vw,1100px)))/2)]'>
      <button
        className={`
        flex items-center rounded-full shrink-0 
        px-[0.7em] py-[0.1em] space-x-1
        sm:hover:scale-110 transition-all duration-300 
        backdrop-blur-xl bg-accent/10 text-sm
        h-[2rem]`}
        onClick={scrollToTop}
        title='返回顶部'
      >
        <HiChevronUp className="text-base inline text-accent-fg" />
        <span className="text-sm text-accent-fg">返回顶部</span>
      </button>
    </div>
  )
}
