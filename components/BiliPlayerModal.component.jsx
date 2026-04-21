import styles from "../styles/Home.module.css";
import { useEffect, useRef } from "react";
import { eff_set } from "../config/controllers";

export default function BiliPlayerModal(
    { props: [Title, Visible, List, Selected, AudioOnly, EffThis] }
) {

    const goToNextSongRef = useRef(null);
    const isSwitchingRef = useRef(false);

    useEffect(() => {
        const handleEnded = (event) => {
            console.log("[BiliPlayer] 扩展检测到播放结束:", event.detail);

            if (isSwitchingRef.current) return;
            isSwitchingRef.current = true;

            goToNextSongRef.current?.();

            setTimeout(() => {
                isSwitchingRef.current = false;
            }, 1500);
        };

        // 监听扩展发送的自定义事件
        window.addEventListener("bilibiliVideoEnded", handleEnded);

        return () => {
            window.removeEventListener("bilibiliVideoEnded", handleEnded);
        };
    }, []);

    if (!Visible) {
        return null;
    }

    const bvidUrl = (bvid) => `https://player.bilibili.com/player.html?bvid=${bvid}`;
    const bvidList = (Array.isArray(List) ? List : [])
        .map((item) => (typeof item === "string" ? item.trim() : ""))
        .filter(Boolean);
    const selectedBvid = Selected || bvidList[0] || "";

    const playlist = EffThis?.current_album || [];
    const currentIndex = playlist.findIndex(song => song.song_name === Title);

    const findNextValidSong = (startIndex) => {
        const len = playlist.length;
        if (len === 0) return null;
        for (let offset = 1; offset < len; offset++) {
            const i = (startIndex + offset) % len;  // ← 循环：到末尾后从 0 开始
            if (playlist[i]?.BVID) return { song: playlist[i], index: i };
        }
        return null;
    };

    const findPrevValidSong = (startIndex) => {
        const len = playlist.length;
        if (len === 0) return null;
        // 从 startIndex-1 开始，循环遍历，跳过 startIndex 本身
        for (let offset = 1; offset < len; offset++) {
            const i = (startIndex - offset + len) % len;  // ← 循环：到开头后从末尾继续
            if (playlist[i]?.BVID) return { song: playlist[i], index: i };
        }
        return null;
    };

    const switchSong = (song) => {
        if (!song?.BVID || !EffThis) return;
        const list = song.BVID.split(/，/g).map(s => s.trim()).filter(Boolean);
        const selected = list[0] || '';
        eff_set(EffThis, 'modalPlayerShow', true);
        eff_set(EffThis, 'modalPlayerSongName', song.song_name);
        eff_set(EffThis, 'BVID', song.BVID);
        eff_set(EffThis, 'bvid_list', list);
        if (selected) eff_set(EffThis, 'bvid_selected', selected);
    };

    const goToPrevSong = () => {
        if (currentIndex < 0) return;
        const prev = findPrevValidSong(currentIndex);
        if (prev) switchSong(prev.song);
    };

    const goToNextSong = () => {
        if (currentIndex < 0) return;
        const next = findNextValidSong(currentIndex);
        if (next) switchSong(next.song);
    };

    goToNextSongRef.current = goToNextSong;

    const hasAnyValidSong = playlist.some(song => song?.BVID);
    const hasPrevSong = currentIndex >= 0 && hasAnyValidSong && playlist.length > 1;
    const hasNextSong = currentIndex >= 0 && hasAnyValidSong && playlist.length > 1;

    const restoreVideo = () => eff_set(EffThis, "bili_player_audio_only", false);
    const hideVideo = () => eff_set(EffThis, "bili_player_audio_only", true);

    return (
        <>
            {!AudioOnly ? (
                <div
                    className={styles.biliPlayerBackdrop}
                    onClick={EffThis.hide_bili_player}
                />
            ) : null}

            <div
                className={`${styles.biliPlayerFloating} ${
                    AudioOnly ? styles.biliPlayerFloatingHidden : styles.biliPlayerFloatingVisible
                }`}
            >
                <div className={styles.biliPlayerPanel}>
                    <div className={styles.biliPlayerTopbar}>
                        <div className={styles.biliPlayerTitleBlock}>
                            <div className={styles.biliModalTitle}>{Title || "Bilibili Player"}</div>

                            {playlist.length > 0 && currentIndex >= 0 && (
                                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
                                    <button
                                        type="button"
                                        onClick={goToPrevSong}
                                        disabled={!hasPrevSong}
                                        style={{
                                            fontSize: "11px",
                                            padding: "2px 3px",
                                            border: "1px solid #ccc",
                                            borderRadius: "4px",
                                            background: "transparent",
                                            cursor: hasPrevSong ? "pointer" : "not-allowed",
                                            opacity: hasPrevSong ? 1 : 0.4,
                                        }}
                                    >
                                        ◀ 上一首
                                    </button>
                                    <span style={{ fontSize: "12px", color: "#666", whiteSpace: "nowrap" }}>
                                        {currentIndex + 1} / {playlist.length}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={goToNextSong}
                                        disabled={!hasNextSong}
                                        style={{
                                            fontSize: "11px",
                                            padding: "2px 3px",
                                            border: "1px solid #ccc",
                                            borderRadius: "4px",
                                            background: "transparent",
                                            cursor: hasNextSong ? "pointer" : "not-allowed",
                                            opacity: hasNextSong ? 1 : 0.4,
                                        }}
                                    >
                                        下一首 ▶
                                    </button>
                                </div>
                            )}

                            <div className={styles.bvidBarCount}>
                                {bvidList.length ? `${bvidList.length} 条歌切` : "暂时没有可用歌切；；"}
                            </div>
                        </div>
                        <div className={styles.biliPlayerActions}>
                            <button
                                type="button"
                                className={styles.biliPlayerActionButton}
                                onClick={hideVideo}
                                disabled={!selectedBvid}
                            >
                                后台播放
                            </button>
                            <button
                                type="button"
                                className={styles.biliPlayerCloseButton}
                                onClick={EffThis.hide_bili_player}
                            >
                                关闭
                            </button>
                        </div>
                    </div>

                    <div className={styles.bvid_bar}>
                        {bvidList.map((bvid, idx) => (
                            <button
                                type="button"
                                className={
                                    selectedBvid === bvid
                                        ? `${styles.bvid_bar__item} ${styles.bvid_bar__item__inactive}`
                                        : styles.bvid_bar__item
                                }
                                onClick={() => eff_set(EffThis, "bvid_selected", bvid)}
                                key={`${bvid}-${idx}`}
                            >
                                {bvid}
                            </button>
                        ))}
                    </div>

                    <div className={styles.biliPlayerFrameWrap}>
                        {selectedBvid ? (
                            <iframe
                                src={bvidUrl(selectedBvid)}
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                allow="autoplay; fullscreen"
                                allowFullScreen
                                title={`Bilibili Player - ${selectedBvid}`}
                            />
                        ) : (
                            <div className={styles.biliPlayerEmpty}>
                                No playable video
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {AudioOnly ? (
                <div
                    className={styles.biliPlayerMiniDock}
                    style={{ minWidth: "370px" }}
                >
                    <div className={styles.biliPlayerMiniText} style={{ overflow: "hidden" }}>
                        <div
                            className={styles.biliPlayerMiniTitle}
                            style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            }}
                        >
                            {Title || "Bilibili Player"}
                        </div>
                    </div>

                    {playlist.length > 0 && currentIndex >= 0 && (
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginRight: "8px", flexShrink: 0 }}>
                            <button
                                type="button"
                                onClick={goToPrevSong}
                                disabled={!hasPrevSong}
                                style={{
                                    fontSize: "8px",
                                    padding: "2px 3px",
                                    border: "1px solid #999",
                                    borderRadius: "3px",
                                    background: "transparent",
                                    color: "#000000",
                                    opacity: hasPrevSong ? 1 : 0.4,
                                    cursor: hasPrevSong ? "pointer" : "not-allowed",
                                }}
                            >
                                ◀
                            </button>
                            <span style={{ fontSize: "11px", color: "#999", whiteSpace: "nowrap" }}>
                                {currentIndex + 1}/{playlist.length}
                            </span>
                            <button
                                type="button"
                                onClick={goToNextSong}
                                disabled={!hasNextSong}
                                style={{
                                    fontSize: "8px",
                                    padding: "2px 3px",
                                    border: "1px solid #999",
                                    borderRadius: "3px",
                                    background: "transparent",
                                    color: "#000000",
                                    opacity: hasNextSong ? 1 : 0.4,
                                    cursor: hasNextSong ? "pointer" : "not-allowed",
                                }}
                            >
                                ▶
                            </button>
                        </div>
                    )}

                    <button
                        type="button"
                        className={styles.biliPlayerMiniButton}
                        onClick={restoreVideo}
                    >
                        看视频
                    </button>
                    <button
                        type="button"
                        className={styles.biliPlayerMiniClose}
                        onClick={EffThis.hide_bili_player}
                    >
                        关闭
                    </button>
                </div>
            ) : null}
        </>
    );
}