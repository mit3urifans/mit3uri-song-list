const config = {
  Name: "三理Mit3uri", // 主页名字

  BiliLiveRoomID: "1967216004", // Bilibili直播间id

  // VRMember: "https://vrp.live/member/SUI",

  Footer: "Github",

  Repository: "https://github.com/starsJuly/sui-song-list.git",

  customCursorEnabled: true, // 使用自定义光标图片
  cursorVersion: "v2",

  LanguageCategories: ["日语", "英语", "韩语"], // 语言分类
  RemarkCategories: [], // 标签分类

  // 自定义按钮 （可以复制生成更多）
  HomeList: [
    {
      url: "https://space.bilibili.com/2030198123",
      name: "个人空间",
      icon: "/assets/icon/bilibili_logo_padded.png",
      background: "bg-bilibili-bg",
      textcolor: "text-bilibili-fg",
      shadowcolor: "shadow-bilibili-fg"
    },
    {
      url: "https://live.bilibili.com/1967216004",
      name: "直播间",
      icon: "/assets/icon/bilibili_logo_padded.png",
      background: "bg-bilibili-bg",
      textcolor: "text-bilibili-fg",
      shadowcolor: "shadow-bilibili-fg"
    },
    {
      url: "https://pome.vip/0ec1ecd21515",
      name: "提问箱",
      icon: "/assets/icon/pome.png",
      background: "bg-pome-bg",
      textcolor: "text-pome-fg",
      shadowcolor: "shadow-pome-fg"
    }
  ],

  theme: {
    'light':  {
      name: '爱之类的话语',
      dynamic: false,
    },
    'dark': {
      name: '魔偶马戏团',
      dynamic: false,
    },
    'flower': {
      name: '花做成的海',
      dynamic: false,
    },
    'marvelous': {
      name: '奇妙夜',
      dynamic: false,
    },
    'brisk': {
      name: '白云红叶两悠悠',
      dynamic: true,
    },
    'idol': {
      name: '娉婷似不任罗绮',
      dynamic: false,
    },
    'lazy': {
      name: '懒倦慵吟守岁诗',
      dynamic: false,
    },
    'shining': {
      name: 'Effulgence',
      dynamic: false,
    },
  }
}

const generate_theme = () => {
  let theme = {};

  // theme.cursor

  const cursor_types = [ 'normal', 'pointer', 'text' ];
  let custom_cursor_dirpath = '/assets/cursor';
  const custom_cursor_suffix = '.png';

  theme.cursor = {};

  if (config.cursorVersion === "v2") {
    custom_cursor_dirpath = '/assets/cursor/v2';
  }

  for (const type of cursor_types) {
      theme.cursor[type] =  config.customCursorEnabled
                            ? `url("${custom_cursor_dirpath + '/' + type + custom_cursor_suffix}"), pointer`
                            : `${type}`
  }

  return theme;
};

export default config
export const theme = generate_theme();
