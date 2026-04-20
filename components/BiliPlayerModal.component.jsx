import styles from "../styles/Home.module.css";

import { eff_set } from "../config/controllers";

export default function BiliPlayerModal(
  { props: [Title, Visible, List, Selected, AudioOnly, EffThis] }
) {
  if (!Visible) {
    return null;
  }

  const bvidUrl = (bvid) => `https://player.bilibili.com/player.html?bvid=${bvid}`;
  const bvidList = (Array.isArray(List) ? List : [])
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);
  const selectedBvid = Selected || bvidList[0] || "";

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
        <div className={styles.biliPlayerMiniDock}>
          <div className={styles.biliPlayerMiniText}>
            <div className={styles.biliPlayerMiniTitle}>
              {Title || "Bilibili Player"}
            </div>
            <div className={styles.biliPlayerMiniSubtitle}>
              歌切正在后台播放
            </div>
          </div>
          <button
            type="button"
            className={styles.biliPlayerMiniButton}
            onClick={restoreVideo}
          >
            返回画面
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
