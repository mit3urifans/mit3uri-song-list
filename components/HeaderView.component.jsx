import React, { useState, useRef, useEffect } from "react";
import Image from "next/legacy/image";
import config from "../config/constants";
import { song_list } from "../config/song_list";
import NumberTicker from "../components/NumberTicker.component";
import BlurFade from "./ui/blur-fade";
import confetti from "canvas-confetti";

import { HiMiniPlusCircle } from "react-icons/hi2";
import { BsPalette2 } from "react-icons/bs";
import { RiPaletteFill } from "react-icons/ri";

import { motion } from "framer-motion";

const HomeList = () => {
  return (
    <>
      <div
        className="flex items-center
        flex-nowrap w-full overflow-x-auto
        no-scrollbar overflow-y-visible py-2"
      >
        {config.HomeList.map((c, idx) => {
          return (
            <BlurFade
              key={idx}
              delay={0.2 + idx * 0.1}
              inView
              className="flex items-center rounded-full shrink-0"
            >
              <button
                className={`
                  ${c.textcolor} ${c.background} ${c.shadowcolor}
                  flex items-center rounded-full shrink-0 
                  ${idx == 0 ? "ml-[1rem]" : "ml-2"}
                  ${idx == config.HomeList.length - 1 ? "mr-[1rem]" : "mr-0"}
                  px-[0.7em] py-[0.3em] relative space-x-2
                  sm:hover:scale-110 transition-all duration-300
                `}
                onClick={() => window.open(c.url)}
                key={idx}
              >
                <Image
                  src={c.icon}
                  alt={c.name}
                  width={16}
                  height={16}
                  loader={({ src }) => src}
                  unoptimized
                />
                <span className="text-sm">{c.name}</span>
              </button>
            </BlurFade>
          );
        })}
      </div>
    </>
  );
};

const HeaderView = ({ props: [EffThis] }) => {
  const [clicks, setClicks] = useState(1);
  const [avatarUrl, setAvatarUrl] = useState(
    "/api/v2/avatar"
  );
  const [isThemeSelectionOpen, setIsThemeSelectionOpen] =
    useState(false);
  useEffect(() => {
    if (clicks > 5) {
      setAvatarUrl(
        "/assets/images/emoticon_bgs1314baobaomuamualovelove.webp"
      );
    }
  }, [clicks]);
  const dropdownRef = useRef(null);
  const theme_name_map = new Map(Object.entries(config.theme));

  const handleClick = () => {
    const defaults = {
      spread: 360,
      ticks: 50,
      gravity: 0,
      decay: 0.94,
      startVelocity: 30,
      colors: ["#FFE400", "#FFBD00", "#E89400", "#FFCA6C", "#FDFFB8"],
    };
 
    const shoot = () => {
      confetti({
        ...defaults,
        particleCount: 40,
        scalar: 1.2,
        shapes: ["star"],
      });
 
      confetti({
        ...defaults,
        particleCount: 10,
        scalar: 0.75,
        shapes: ["circle"],
      });
    };
 
    setTimeout(shoot, 0);
    setTimeout(shoot, 100);
    setTimeout(shoot, 200);
  };

  return (
    <>
      <div>
        <div className="pt-[15rem] sm:pt-[25rem] 5xl:pt-[35rem]">
          <div className="flex items-center">
            <BlurFade delay={0.25} inView>
              <div className="mr-2 ml-[1rem] hidden relative sm:w-[9rem] sm:h-[9rem] sm:block">
                <Image
                  src="mit3uri.jpg"
                  alt="liver-avatar"
                  loader={({ src }) => src}
                  layout="fill"
                  objectFit="contain"
                  unoptimized
                  className="rounded-full spin-back"
                />
              </div>
            </BlurFade>
            <div className="flex flex-col items-start">
              <div className="flex items-center ml-[1rem] mb-2">
                <div className="mr-2 w-[3.5rem] h-[3.5rem] relative sm:hidden">
                  <Image
                    src="mit3uri.jpg"
                    alt="liver-avatar"
                    loader={({ src }) => src}
                    layout="fill"
                    objectFit="contain"
                    unoptimized
                    className="rounded-full spin-back"
                  />
                </div>
                <div className="text-base text-label flex-col relative">
                  <span className="font-bold block sm:text-title w-fit relative">
                    <BlurFade delay={0} inView>
                      <span>{config.Name}</span>
                    </BlurFade>
                  </span>
                  <BlurFade className="relative z-[10]" delay={0.05} inView>
                    <div className="flex flex-row items-center space-x-3">
                      <span className="sm:text-subtitle">
                        已收录的歌曲{" "}
                        <button onClick={handleClick}>
                          <NumberTicker
                            value={song_list.length}
                            delay={0.3}
                            className="mx-1 text-label dark:text-label relative"
                          />
                        </button>{" "}
                        首
                      </span>
                      <button
                        className="bg-accent-bg
                        h-[1.5rem] rounded-full right-0 hidden sm:flex
                        items-center justify-center flex-row space-x-1 px-2"
                        onClick={() => {
                          window.open('https://docs.qq.com/sheet/DSU9MVFVVVGVGR3Bz', '_blank');
                        }}
                      >
                        <HiMiniPlusCircle className="text-xs inline text-accent-fg" />
                        <span className="text-xs text-accent-fg">添加歌曲</span>
                      </button>
                      <button
                        className="relative bg-accent-bg h-[1.5rem] rounded-full right-0
                        flex items-center justify-center flex-row space-x-1 px-2"
                        onClick={() => {
                          setIsThemeSelectionOpen(!isThemeSelectionOpen);
                        }}
                      >
                        <BsPalette2 className="text-xs inline text-accent-fg" />
                        <span className="text-xs text-accent-fg ">
                          切换主题
                        </span>
                        {isThemeSelectionOpen ? (
                          <motion.div
                            className="origin-top-right absolute right-0 mt-2 w-30 
                            rounded-md top-[1.2rem]
                            focus:outline-none z-[100] overflow-y-auto"
                            aria-orientation="vertical"
                            aria-labelledby="menu-button"
                            tabIndex="-1"
                            ref={dropdownRef}
                            initial={{
                              opacity: 0,
                              scale: 0,
                              transform: "translateY(15px)",
                            }}
                            animate={{
                              opacity: [0, 1],
                              scale: [0, 0.5, 1],
                              transform: "translateY(0px)",
                            }}
                          >
                            <div
                              className="flex-col flex items-start space-y-1"
                              role="none"
                            >
                              {[...theme_name_map].map(([theme, value]) => {
                                return (
                                  <div
                                    onClick={() => {
                                      setIsThemeSelectionOpen(false);
                                      EffThis.set_theme(theme);
                                    }}
                                    className="items-center px-3 space-x-1 py-2 text-sm text-label flex flex-row
                                  bg-accent-bg rounded-full w-[9rem] overflow-clip"
                                    role="menuitem"
                                    tabIndex="-1"
                                    id="menu-item-3"
                                    key={value.name}
                                  >
                                    <RiPaletteFill className="inline" />
                                    <span>{value.name}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </motion.div>
                        ) : null}
                      </button>
                    </div>
                  </BlurFade>
                </div>
              </div>
              <HomeList />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeaderView;
