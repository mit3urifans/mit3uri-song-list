import { Modal } from "react-bootstrap";

import styles from "../styles/Home.module.css";

import { eff_set } from "../config/controllers";

export default function BiliPlayerModal
  ({ props: [ Title, Visible, List, Selected, EffThis, ] }) {

  const bvid_url = (bvid) => `//player.bilibili.com/player.html?bvid=${bvid}`;
  const bvid_list = (Array.isArray(List) ? List : [])
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);
  const selected_bvid = Selected || bvid_list[0] || "";

  return (
    <Modal
      show={Visible}
      onHide={EffThis.hide_bili_player}
      fullscreen="xl-down"
      size="xl"
      centered
    >
      <Modal.Header closeButton className={styles.biliModalHeader}>
        <Modal.Title className={styles.biliModalTitle}>
          { Title }
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className={styles.biliModalBody}>
        <div className={styles.biliPlayerDiv}>
          <div className={styles.bvid_bar}>
            {bvid_list.map((bvid, idx) => (
              <button
                type="button"
                className={
                  selected_bvid === bvid
                    ? `${styles.bvid_bar__item} ${styles.bvid_bar__item__inactive}`
                    : styles.bvid_bar__item
                }
                onClick={() => eff_set(EffThis, "bvid_selected", bvid)}
                key={`${bvid}-${idx}`}
              >
                { bvid }
              </button>
            ))}
          </div>
          <div className={styles.biliPlayerFrameWrap}>
            {selected_bvid ? (
              <iframe
                src={bvid_url(selected_bvid)}
                width="100%"
                height="100%"
                scrolling="no"
                border="0"
                frameBorder="0"
                allowFullScreen={true}
                title={`Bilibili Player - ${selected_bvid}`}
              />
            ) : (
              <div className={styles.biliPlayerEmpty}>
                暂无可播放视频
              </div>
            )}
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
