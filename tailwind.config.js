/** @type {import('tailwindcss').Config} */

const { createThemes } = require('tw-colors');

module.exports = {
  content: [
    "./components/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./config/constants.js",
  ],
  theme: {
    extend: {
      cursor: {
        'main-cursor': "url('/assets/cursor/v2/pointer.png'), pointer",
      },
      screens: {
        'xl': '1100px',
        '3xl': '1600px',
        '4xl': '1920px',
        '5xl': '2560px',
      }
    },
    fontSize: {
      'header': '3rem',
      'title': '2rem',
      'subtitle': '1.2rem',
      'base': '0.9rem',
      'sm': '0.8rem',
      'xs': '0.7rem'
    }
  },
  plugins: [
    createThemes({
      light: {
        'badge-play': '#DA5D77',
        'bilibili': '#00AEEC',
        'music-player-bg': '#DEEFFD',
        'item-hover': '#45BEEA',

        // generated from #87EAFF
        'oen-blue': '#87EAFF',
        'oen-color-1': "#e1fdff",
        'oen-color-2': "#ccf8ff",
        'oen-color-3': "#9ceeff",
        'oen-color-4': "#68e4fe",
        'oen-color-5': "#43dbfd",
        'oen-color-6': "#2fd6fd",
        'oen-color-7': "#1dd4fe",
        'oen-color-8': "#00bbe3",
        'oen-color-9': "#00a7cb",
        'oen-color-10': "#0090b3",

        // generated from #DA5D77
        'oen-red': '#DA5D77',
        'oen-red-2': '#E97365',
        'oen-color-11': "#ffeaf1",
        'oen-color-12': "#fbd6df",
        'oen-color-13': "#efadbb",
        'oen-color-14': "#e38095",
        'oen-color-15': "#da5b75",
        'oen-color-16': "#d44361",
        'oen-color-17': "#d23657",
        'oen-color-18': "#bb2747",
        'oen-color-19': "#a71f3f",
        'oen-color-20': "#941335",

        'pome-bg': '#eaeaff',
        'pome-fg': '#3b37fd',

        'weibo-bg': '#ffe8ec',
        'weibo-fg': '#f44152',

        'bilibili-bg': '#e3faff',
        'bilibili-fg': '#37abe9',

        'vr-bg': '#e5feee',
        'vr-fg': '#53e383',

        'palette-1': '#E7E2E3',
        'palette-2': '#E97365',
        'palette-3': '#99C7F3',
        'palette-4': '#B3D6F6',
        'palette-5': '#F0F8FD',
        'palette-6': '#FEFEFE',
        'palette-7': '#70B9F2',
        'palette-8': '#7C9DB4',
        'palette-9': '#94B4CE',
        'palette-10': '#FBF2C6',

        'label': '#7C9DB4',
        'secondary-label': '#94B4CE',
        'tertiary-label': '#99C7F3',
        'accent': '#70B9F2',
        'accent-bg': '#E4F7FF',
        'accent-fg': '#49a4ed',
        'accent-oen': '#87EAFF',
        'accent-oen-2': '#DA5D77',
        'accent-2': '#FBF2C6',
        'accent-3': '#E97365',
        'placeholder': '#E7E2E3',
        'background': '#B3D6F6',
        'background-2': '#99C7F3',
        'secondary-background': '#F0F8FD',
        'tertiary-background': '#FEFEFE',

        'main-page-background': '#F0F8FD',

        'normal-label': '#FFFFFF',
      },

      dark: {
        // ["34281c","733e2e","fdfded","edc69a","170e0c","3c2b1f","6f474c"]
        'badge-play': '#DA5D77',
        'bilibili': '#00AEEC',
        'music-player-bg': '#6F474C',
        'item-hover': '#45BEEA',

        'pome-bg': '#171A35',
        'pome-fg': '#6866ff',

        'weibo-bg': '#341A1D',
        'weibo-fg': '#F3526F',

        'bilibili-bg': '#1B2932',
        'bilibili-fg': '#37abe9',

        'vr-bg': '#1D3222',
        'vr-fg': '#6BE98C',

        // generated from #87EAFF
        'oen-blue': '#87EAFF',
        'oen-color-1': "#e1fdff",
        'oen-color-2': "#ccf8ff",
        'oen-color-3': "#9ceeff",
        'oen-color-4': "#68e4fe",
        'oen-color-5': "#43dbfd",
        'oen-color-6': "#2fd6fd",
        'oen-color-7': "#1dd4fe",
        'oen-color-8': "#00bbe3",
        'oen-color-9': "#00a7cb",
        'oen-color-10': "#0090b3",

        // generated from #DA5D77
        'oen-red': '#DA5D77',
        'oen-red-2': '#E97365',
        'oen-color-11': "#ffeaf1",
        'oen-color-12': "#fbd6df",
        'oen-color-13': "#efadbb",
        'oen-color-14': "#e38095",
        'oen-color-15': "#da5b75",
        'oen-color-16': "#d44361",
        'oen-color-17': "#d23657",
        'oen-color-18': "#bb2747",
        'oen-color-19': "#a71f3f",
        'oen-color-20': "#941335",

        'label': '#F0D59E',
        'secondary-label': '#EDC69A',
        'tertiary-label': '#733E2E',
        'accent': '#AC2523',
        'accent-bg': '#2F1E1F',
        'accent-fg': '#C43C39',
        'accent-oen': '#87EAFF',
        'accent-oen-2': '#DA5D77',
        'accent-2': '#FBF2C6',
        'accent-3': '#E97365',
        'placeholder': '#34281C',
        'background': '#3C2B1F',
        'background-2': '#6F474C',
        'secondary-background': '#2A1D16',
        'tertiary-background': '#33241B',
        'main-page-background': '#170E0C'

      },
      flower: {
        // ["A282A1", "895F65", "D35B68", "FBF9FC", "F9E7F7", "DEE4F7", "F9CCD7", "312025"]
        'badge-play': '#DA5D77',
        'bilibili': '#00AEEC',
        'music-player-bg': '#F9CCD7',
        'item-hover': '#45BEEA',

        'pome-bg': '#eaeaff',
        'pome-fg': '#3b37fd',

        'weibo-bg': '#ffe8ec',
        'weibo-fg': '#f44152',

        'bilibili-bg': '#e3faff',
        'bilibili-fg': '#37abe9',

        'vr-bg': '#e5feee',
        'vr-fg': '#53e383',
        // generated from #87EAFF
        'oen-blue': '#87EAFF',
        'oen-color-1': "#e1fdff",
        'oen-color-2': "#ccf8ff",
        'oen-color-3': "#9ceeff",
        'oen-color-4': "#68e4fe",
        'oen-color-5': "#43dbfd",
        'oen-color-6': "#2fd6fd",
        'oen-color-7': "#1dd4fe",
        'oen-color-8': "#00bbe3",
        'oen-color-9': "#00a7cb",
        'oen-color-10': "#0090b3",

        // generated from #DA5D77
        'oen-red': '#DA5D77',
        'oen-red-2': '#E97365',
        'oen-color-11': "#ffeaf1",
        'oen-color-12': "#fbd6df",
        'oen-color-13': "#efadbb",
        'oen-color-14': "#e38095",
        'oen-color-15': "#da5b75",
        'oen-color-16': "#d44361",
        'oen-color-17': "#d23657",
        'oen-color-18': "#bb2747",
        'oen-color-19': "#a71f3f",
        'oen-color-20': "#941335",

        'label': '#895F65',
        'secondary-label': '#A282A1',
        'tertiary-label': '#D35B68',
        'accent': '#D35B68',
        'accent-2': '#F9E7F7',
        'accent-3': '#D35B68',
        'accent-oen': '#F9D9E9',
        'accent-oen-2': '#312025',
        'accent-bg': '#fbd8dc',
        'accent-fg': '#b52e3d',
        'background': '#F9E7F7',
        'background-2': '#F9CCD7',
        'main-page-background': '#DEE4F7',
        'secondary-background': '#312025',
        'tertiary-background': '#FBF9FC',
      },

      marvelous: {
        'badge-play': '#DA5D77',
        'bilibili': '#00AEEC',
        'music-player-bg': '#63392C',
        'item-hover': '#45BEEA',

        'pome-bg': '#171A35',
        'pome-fg': '#6866ff',

        'weibo-bg': '#341A1D',
        'weibo-fg': '#F3526F',

        'bilibili-bg': '#1B2932',
        'bilibili-fg': '#37abe9',

        'vr-bg': '#1D3222',
        'vr-fg': '#6BE98C',


        // generated from #87EAFF
        'oen-blue': '#87EAFF',
        'oen-color-1': "#e1fdff",
        'oen-color-2': "#ccf8ff",
        'oen-color-3': "#9ceeff",
        'oen-color-4': "#68e4fe",
        'oen-color-5': "#43dbfd",
        'oen-color-6': "#2fd6fd",
        'oen-color-7': "#1dd4fe",
        'oen-color-8': "#00bbe3",
        'oen-color-9': "#00a7cb",
        'oen-color-10': "#0090b3",

        // generated from #DA5D77
        'oen-red': '#DA5D77',
        'oen-red-2': '#E97365',
        'oen-color-11': "#ffeaf1",
        'oen-color-12': "#fbd6df",
        'oen-color-13': "#efadbb",
        'oen-color-14': "#e38095",
        'oen-color-15': "#da5b75",
        'oen-color-16': "#d44361",
        'oen-color-17': "#d23657",
        'oen-color-18': "#bb2747",
        'oen-color-19': "#a71f3f",
        'oen-color-20': "#941335",

        'label': '#A18FA3',
        'secondary-label': '#9C818E',
        'tertiary-label': '#4A414F',
        'accent': '#812722',
        'accent-bg': '#311016',
        'accent-fg': '#946170',
        'accent-oen': '#87EAFF',
        'accent-oen-2': '#DA5D77',
        'accent-2': '#FBF2C6',
        'accent-3': '#E97365',
        'placeholder': '#34281C',
        'background': '#4A414F',
        'background-2': '#534E54',
        'secondary-background': '#060608',
        'tertiary-background': '#534E54',
        'main-page-background': '#25253a'
      },
      brisk: {
        'badge-play': '#F4D182',
        'bilibili': '#ccf3ff',
        'music-player-bg': '#825843',
        'item-hover': '#45BEEA',

        'pome-bg': '#eaeaff',
        'pome-fg': '#3b37fd',

        'weibo-bg': '#ffe8ec',
        'weibo-fg': '#f44152',

        'bilibili-bg': '#e3faff',
        'bilibili-fg': '#37abe9',

        'vr-bg': '#e5feee',
        'vr-fg': '#53e383',
        
        // generated from #87EAFF
        'oen-blue': '#87EAFF',
        'oen-color-1': "#e1fdff",
        'oen-color-2': "#ccf8ff",
        'oen-color-3': "#9ceeff",
        'oen-color-4': "#68e4fe",
        'oen-color-5': "#43dbfd",
        'oen-color-6': "#2fd6fd",
        'oen-color-7': "#1dd4fe",
        'oen-color-8': "#00bbe3",
        'oen-color-9': "#00a7cb",
        'oen-color-10': "#0090b3",

        // generated from #DA5D77
        'oen-red': '#DA5D77',
        'oen-red-2': '#E97365',
        'oen-color-11': "#ffeaf1",
        'oen-color-12': "#fbd6df",
        'oen-color-13': "#efadbb",
        'oen-color-14': "#e38095",
        'oen-color-15': "#da5b75",
        'oen-color-16': "#d44361",
        'oen-color-17': "#d23657",
        'oen-color-18': "#bb2747",
        'oen-color-19': "#a71f3f",
        'oen-color-20': "#941335",

        'label': '#F4D182',
        'secondary-label': '#E5B580',
        'tertiary-label': '#CB8545',
        'accent': '#E5B580',
        'accent-bg': '#A6572E',
        'accent-fg': '#D1AB87',
        'accent-oen': '#AC7D54',
        'accent-oen-2': '#796458',
        'accent-2': '#FBF2C6',
        'accent-3': '#E97365',
        'placeholder': '#34281C',
        'background': '#825843',
        'background-2': '#534E54',
        'secondary-background': '#796458',
        'tertiary-background': '#633F35',
        'main-page-background': '#A06648'
      },

      idol: {
        'badge-play': '#570F12',
        'bilibili': '#302A4B',
        'music-player-bg': '#593A51',
        'item-hover': '#45BEEA',

        'pome-bg': '#eaeaff',
        'pome-fg': '#3b37fd',

        'weibo-bg': '#ffe8ec',
        'weibo-fg': '#f44152',

        'bilibili-bg': '#e3faff',
        'bilibili-fg': '#37abe9',

        'vr-bg': '#e5feee',
        'vr-fg': '#53e383',

        // generated from #87EAFF
        'oen-blue': '#87EAFF',
        'oen-color-1': "#e1fdff",
        'oen-color-2': "#ccf8ff",
        'oen-color-3': "#9ceeff",
        'oen-color-4': "#68e4fe",
        'oen-color-5': "#43dbfd",
        'oen-color-6': "#2fd6fd",
        'oen-color-7': "#1dd4fe",
        'oen-color-8': "#00bbe3",
        'oen-color-9': "#00a7cb",
        'oen-color-10': "#0090b3",

        // generated from #DA5D77
        'oen-red': '#DA5D77',
        'oen-red-2': '#E97365',
        'oen-color-11': "#ffeaf1",
        'oen-color-12': "#fbd6df",
        'oen-color-13': "#efadbb",
        'oen-color-14': "#e38095",
        'oen-color-15': "#da5b75",
        'oen-color-16': "#d44361",
        'oen-color-17': "#d23657",
        'oen-color-18': "#bb2747",
        'oen-color-19': "#a71f3f",
        'oen-color-20': "#941335",

        'label': '#BDCDEF',
        'secondary-label': '#C2B4D2',
        'tertiary-label': '#44314B',
        'accent': '#E77379',
        'accent-bg': '#9189BD',
        'accent-fg': '#6A589D',
        'accent-oen': '#6A589D',
        'accent-oen-2': '#593A51',
        'accent-2': '#7B6190',
        'accent-3': '#9E6B85',
        'background': '#44314B',
        'background-2': '#302A4B',
        'secondary-background': '#593A51',
        'tertiary-background': '#6A589D',
        'main-page-background': '#887DB3'
      },

      lazy: {
        'badge-play': '#9A7773',
        'bilibili': '#BE9287',
        'music-player-bg': '#D6C5C6',
        'item-hover': '#45BEEA',

        'pome-bg': '#eaeaff',
        'pome-fg': '#3b37fd',

        'weibo-bg': '#ffe8ec',
        'weibo-fg': '#f44152',

        'bilibili-bg': '#e3faff',
        'bilibili-fg': '#37abe9',

        'vr-bg': '#e5feee',
        'vr-fg': '#53e383',

        // generated from #87EAFF
        'oen-blue': '#87EAFF',
        'oen-color-1': "#e1fdff",
        'oen-color-2': "#ccf8ff",
        'oen-color-3': "#9ceeff",
        'oen-color-4': "#68e4fe",
        'oen-color-5': "#43dbfd",
        'oen-color-6': "#2fd6fd",
        'oen-color-7': "#1dd4fe",
        'oen-color-8': "#00bbe3",
        'oen-color-9': "#00a7cb",
        'oen-color-10': "#0090b3",

        // generated from #DA5D77
        'oen-red': '#DA5D77',
        'oen-red-2': '#E97365',
        'oen-color-11': "#ffeaf1",
        'oen-color-12': "#fbd6df",
        'oen-color-13': "#efadbb",
        'oen-color-14': "#e38095",
        'oen-color-15': "#da5b75",
        'oen-color-16': "#d44361",
        'oen-color-17': "#d23657",
        'oen-color-18': "#bb2747",
        'oen-color-19': "#a71f3f",
        'oen-color-20': "#941335",

        'label': '#938E91',
        'secondary-label': '#BCABAB',
        'tertiary-label': '#BCABAB',
        'accent': '#E77379',
        'accent-bg': '#E7DBD9',
        'accent-fg': '#D6C5C6',
        'accent-oen': '#B36C50',
        'accent-oen-2': '#593A51',
        'accent-2': '#7B6190',
        'accent-3': '#9E6B85',
        'background': '#44314B',
        'background-2': '#E4C8C5',
        'secondary-background': '#593A51',
        'tertiary-background': '#E0E9F6',
        'main-page-background': '#F9F2F0'
      },

      shining: {
        'badge-play': '#9A7773',
        'bilibili': '#BE9287',
        'music-player-bg': '#AE3E4C',
        'item-hover': '#45BEEA',

        'pome-bg': '#eaeaff',
        'pome-fg': '#3b37fd',

        'weibo-bg': '#ffe8ec',
        'weibo-fg': '#f44152',

        'bilibili-bg': '#e3faff',
        'bilibili-fg': '#37abe9',

        'vr-bg': '#e5feee',
        'vr-fg': '#53e383',

        // // generated from #87EAFF
        // 'oen-blue': '#87EAFF',
        // 'oen-color-1': "#e1fdff",
        // 'oen-color-2': "#ccf8ff",
        // 'oen-color-3': "#9ceeff",
        // 'oen-color-4': "#68e4fe",
        // 'oen-color-5': "#43dbfd",
        // 'oen-color-6': "#2fd6fd",
        // 'oen-color-7': "#1dd4fe",
        // 'oen-color-8': "#00bbe3",
        // 'oen-color-9': "#00a7cb",
        // 'oen-color-10': "#0090b3",

        // // generated from #DA5D77
        // 'oen-red': '#DA5D77',
        // 'oen-red-2': '#E97365',
        // 'oen-color-11': "#ffeaf1",
        // 'oen-color-12': "#fbd6df",
        // 'oen-color-13': "#efadbb",
        // 'oen-color-14': "#e38095",
        // 'oen-color-15': "#da5b75",
        // 'oen-color-16': "#d44361",
        // 'oen-color-17': "#d23657",
        // 'oen-color-18': "#bb2747",
        // 'oen-color-19': "#a71f3f",
        // 'oen-color-20': "#941335",

        'label': '#85088C',
        'secondary-label': '#A40DAE',
        'tertiary-label': '#BCABAB',
        'accent': '#E77379',
        'accent-bg': '#B59EF5',
        'accent-fg': '#5A1FAF',
        'accent-oen': '#828C9E',
        'accent-oen-2': '#2B242E',
        'accent-2': '#CAFD9A',
        'accent-3': '#CAFD9A',
        'background': '#484B54',
        'background-2': '#C4A494',
        'secondary-background': '#593A51',
        'tertiary-background': '#F9C3FE', //筛选按钮配色
        'main-page-background': '#c6b4f8' //总底色
      },

      // 2. 新增 meteor (夜空流星)
      meteor: {
        // --- 核心背景 ---
        'background': '#282E42',       // [列表底色] 夜空深蓝灰
        'main-page-background': '#151922', // [网页大背景] 更深的夜空色，增加层次感

        // --- 强调色 (流星/星光) ---
        'accent': '#FDD835',           // [强调色] 明亮的流星金
        'accent-fg': '#FFF9C4',        // [强调文字] 极浅的金黄色
        'accent-bg': '#37405A',        // [强调背景] 比主背景稍亮的蓝灰

        // --- 文字配色 (星光白) ---
        'label': '#ECEFF1',            // [主要文字] 接近纯白
        'secondary-label': '#B0BEC5',  // [次要文字] 蓝灰色
        'tertiary-label': '#78909C',   // [第三级文字] 深蓝灰

        // --- 组件配色 ---
        'badge-play': '#FDD835',       // 播放按钮：流星金
        'bilibili': '#40C4FF',         // B站：天际蓝
        'music-player-bg': '#323A52',  // 播放器：比背景稍亮，浮起感
        'item-hover': '#3E4662',       // 列表悬停：被星光照亮的感觉

        // --- 社交图标 ---
        'pome-bg': '#23293B',
        'pome-fg': '#6B71FF',
        'weibo-bg': '#23293B',
        'weibo-fg': '#FF8A80',
        'bilibili-bg': '#23293B',
        'bilibili-fg': '#40C4FF',
        'vr-bg': '#23293B',
        'vr-fg': '#69F0AE',

        // --- 其他 ---
        'oen-blue': '#80D8FF',
        'accent-oen': '#FDD835',
        'accent-oen-2': '#ECEFF1',
        'accent-2': '#FFFF00',
        'accent-3': '#FDD835',

        'background-2': '#323A52',
        'secondary-background': '#1B2130',
        'tertiary-background': '#455A64',
        'placeholder': '#546E7A',
      },

      // 3. 新增 lab (梦境实验)
      lab: {
        // --- 核心配色 ---
        'background': '#FFFFFF',       // [列表底色] 纯白，营造实验室的洁净感
        'main-page-background': '#DCEAF7', // [网页大背景] 淡蓝色，像梦境的天空

        // --- 强调色 ---
        'accent': '#F7C8D0',           // [强调色] 肉粉色 (Flesh Pink)
        'accent-fg': '#D68A96',        // [强调文字] 深一点的肉粉，保证看得清
        'accent-bg': '#FFF0F3',        // [强调背景] 极淡的粉色

        // --- 文字配色 ---
        'label': '#5E6C84',            // [主要文字] 深灰蓝
        'secondary-label': '#8FA0BC',  // [次要文字] 浅灰蓝
        'tertiary-label': '#C3CFE0',   // [第三级文字]

        // --- 组件配色 ---
        'badge-play': '#F7C8D0',       // 播放按钮：肉粉色
        'bilibili': '#89CFF0',         // B站：婴儿蓝
        'music-player-bg': '#FFFFFF',  // 播放器背景：纯白
        'item-hover': '#EBF5FF',       // 列表悬停：极淡的蓝色

        // --- 社交图标背景 ---
        'pome-bg': '#F0F7FF',
        'pome-fg': '#9DB6E4',
        'weibo-bg': '#FFF0F3',
        'weibo-fg': '#F7C8D0',
        'bilibili-bg': '#E6F4FF',
        'bilibili-fg': '#89CFF0',
        'vr-bg': '#F0FFF4',
        'vr-fg': '#98E6B8',

        // --- 其他装饰色 ---
        'oen-blue': '#A3D5FF',
        'accent-oen': '#F7C8D0',
        'accent-oen-2': '#5E6C84',
        'accent-2': '#FFF9DB',
        'accent-3': '#F7C8D0',

        'background-2': '#F4F9FD',
        'secondary-background': '#E8F1F8',
        'tertiary-background': '#F7FBFE',
        'placeholder': '#DAE1E7',
      },

      // 4. 新增 cyber (赛博梦境)
      cyber: {
        // --- 核心背景 ---
        'background': '#15175c',       // [列表/组件底色] 比主背景稍亮，增加层次
        'main-page-background': '#0C0D45', // [用户指定] 网页大背景：深蓝紫

        // --- 强调色 (霓虹光效) ---
        'accent': '#00f3ff',           // [强调色] 赛博霓虹青 (Cyber Cyan)
        'accent-fg': '#ffffff',        // [强调文字] 白色
        'accent-bg': '#114e86',        // [强调背景] 深青色

        // --- 文字配色 (荧光屏风格) ---
        'label': '#e0f7fa',            // [主要文字] 极淡的青白
        'secondary-label': '#7c8fa6',  // [次要文字] 蓝灰
        'tertiary-label': '#4a5b75',   // [第三级文字]

        // --- 组件配色 ---
        'badge-play': '#d600ff',       // 播放按钮：霓虹紫 (Neon Purple)
        'bilibili': '#00f3ff',         // B站：跟随主色调
        'music-player-bg': '#0f114a',  // 播放器：深沉的底色
        'item-hover': '#1e217a',       // 列表悬停：高亮蓝

        // --- 社交图标 ---
        'pome-bg': '#1a0b2e',
        'pome-fg': '#878cff',
        'weibo-bg': '#2a0a12',
        'weibo-fg': '#ff0055',
        'bilibili-bg': '#051821',
        'bilibili-fg': '#00f3ff',
        'vr-bg': '#00261c',
        'vr-fg': '#00ff9d',

        // --- 其他装饰 ---
        'oen-blue': '#00f3ff',
        'accent-oen': '#d600ff',
        'accent-oen-2': '#e0f7fa',
        'accent-2': '#ffee00',
        'accent-3': '#ff0055',

        'background-2': '#15175c',
        'secondary-background': '#08092e',
        'tertiary-background': '#23266e',
        'placeholder': '#353a6e',
      },

      // 5. 新增 camera (时间定格)
      camera: {
        // --- 核心背景 (相册与相纸) ---
        'background': '#FFF9FA',       // [列表底色] 接近纯白
        'main-page-background': '#FAE7F7', // [用户指定] 网页大背景：淡兰花色，营造柔光滤镜感

        // --- 强调色 (快门与对焦) ---
        'accent': '#FF80AB',           // [强调色] 甜心粉
        'accent-fg': '#5D4037',        // [强调文字] 纯白
        'accent-bg': '#FFEDF4',        // [强调背景] 极淡的粉色高光

        // --- 文字配色 (显影液风格) ---
        'label': '#5D4037',            // [主要文字] 深棕色，像老照片的成像色，比纯黑柔和
        'secondary-label': '#8D6E63',  // [次要文字] 浅棕褐
        'tertiary-label': '#D7CCC8',   // [第三级文字]

        // --- 组件配色 ---
        'badge-play': '#FF80AB',       // 播放按钮：跟随主强调色
        'bilibili': '#80D8FF',         // B站：清透的天空蓝
        'music-player-bg': '#FFF0F5',  // 播放器：薰衣草红晕，微弱的区别于纯白背景
        'item-hover': '#FCE4EC',       // 列表悬停：淡淡的樱花色，像闪光灯补光

        // --- 社交图标 (镜头滤镜色) ---
        'pome-bg': '#eaeaff',
        'pome-fg': '#3b37fd',
        'weibo-bg': '#FFEBEE',         // 红色滤镜底
        'weibo-fg': '#EF5350',         // 红色滤镜前景色
        'bilibili-bg': '#E1F5FE',      // 蓝色滤镜底
        'bilibili-fg': '#29B6F6',      // 蓝色滤镜前景色
        'vr-bg': '#E0F2F1',            // 青色滤镜底
        'vr-fg': '#26A69A',            // 青色滤镜前景色

        // --- 其他装饰 ---
        'oen-blue': '#82B1FF',         // 辅助蓝
        'accent-oen': '#FF80AB',
        'accent-oen-2': '#5D4037',
        'accent-2': '#F4FF81',         // 柠檬黄，作为点缀
        'accent-3': '#FF80AB',

        'background-2': '#F8BBD0',     // 较深的粉色，用于分割
        'secondary-background': '#FFF5F8',
        'tertiary-background': '#F3E5F5',
        'placeholder': '#E1BEE7',      // 占位符颜色
      },

      sakura: {
        // --- 核心背景 ---
        'background': '#FFFFFF',       // [列表底色] 纯白，保证阅读清晰
        'main-page-background': '#f7f1fd', // [网页大背景] 极淡的紫罗兰色，取自光照下的头发

        // --- 强调色 (发饰与瞳孔) ---
        'accent': '#8E6AD8',
        'accent-fg': '#6C4DD9',
        'accent-bg': '#F0E9FF',

        // --- 文字配色 ---
        'label': '#512DA8',            // [主要文字] 深紫色，代替纯黑，更融合画面
        'secondary-label': '#6E63A8',  // [次要文字] 蓝紫色
        'tertiary-label': '#af94e0',   // [第三级文字] 浅紫

        // --- 组件配色 ---
        'badge-play': '#9575CD',       // 播放按钮：主紫色
        'bilibili': '#F06292',         // B站
        'music-player-bg': '#FFF7FF',  // 播放器：透着一点点粉的白
        'item-hover': '#F3E5F5',       // 列表悬停：淡紫高光

        // --- 社交图标 (花瓣与叶子) ---
        'pome-bg': '#e8f3ff',
        'pome-fg': '#4946ff',
        'weibo-bg': '#DCEDC8',         // 浅绿背景 (叶子)
        'weibo-fg': '#689F38',         // 深绿图标
        'bilibili-bg': '#E1F5FE',      // 浅蓝背景 (天空)
        'bilibili-fg': '#29B6F6',      // 蓝图标
        'vr-bg': '#F3E5F5',
        'vr-fg': '#AB47BC',

        // --- 其他 ---
        'oen-blue': '#7986CB',
        'accent-oen': '#9575CD',
        'accent-oen-2': '#512DA8',
        'accent-2': '#fda0be',         // 樱花粉点缀
        'accent-3': '#a8da73',         // 嫩叶绿点缀

        'background-2': '#D1C4E9',
        'secondary-background': '#EDE7F6',
        'tertiary-background': '#F3E5F5',
        'placeholder': '#D1C4E9',
      },
    })
  ],
}

