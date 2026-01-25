import pandas as pd
import re
import os

# ================= 配置区域 =================
# CSV 文件路径 (你的主要数据源)
CSV_PATH = 'music_data.csv'
# Excel 文件路径 (自动导出给网站用)
EXCEL_PATH = 'Book1.xlsx'

# 你的原始数据 (直接粘贴)
RAW_DATA = """
251128 晚台 理歌单


射守矢真兔
2025年11月29日 02:20
三理Mit3uri：网页链接​ 
直播间：网页链接​

1845 人质
1850 我不难过
1856 红颜如霜
1900 雨爱
1929 半情歌
1935 demons
1938 radioactive
1946 一格格
1952 苏州河
2001 暖暖
2018 Because of you
2025 如果可以
2036 the show
2044 泪桥
2048 夏霞
2101 开始懂了
2108 水星记
2123 千千阙歌
2131 I Love you 3000
2144 彩色的黑
2149 九张机
2152 Sk8er Boi
2158 爱情讯息
2208 半岛铁盒
2433 呼吸决定
2439 恋人
"""


# ===========================================

def get_date_from_header(lines):
    for line in lines:
        line = line.strip()
        if not line: continue
        match = re.match(r'^(\d{6})', line)
        if match:
            raw_date = match.group(1)
            year = "20" + raw_date[0:2]
            month = str(int(raw_date[2:4]))
            day = str(int(raw_date[4:6]))
            return f"{year}/{month}/{day}"
    return None


def clean_date_str(date_val):
    """强力清洗函数：确保保存到 CSV 的时候永远是干净的"""
    if pd.isna(date_val):
        return ""
    s = str(date_val).strip()
    # 正则去掉时间 (00:00:00)
    s = re.sub(r'\s+\d{1,2}:\d{2}:\d{2}', '', s)
    # 强制变成斜杠
    s = s.replace("-", "/")
    return s


def update_songs():
    print(f"正在读取 {CSV_PATH} ...")

    if not os.path.exists(CSV_PATH):
        print(f"❌ 错误：找不到 {CSV_PATH}！请先运行 fix_csv.py 进行初始化。")
        return

    try:
        # 读取 CSV
        df = pd.read_csv(CSV_PATH, dtype=str, encoding='utf-8-sig')
    except Exception as e:
        print(f"❌ 读取 CSV 失败: {e}")
        return

    df.fillna('', inplace=True)

    # 读取进来后立刻清洗一遍，防止残留脏数据
    if '日期' in df.columns:
        df['日期'] = df['日期'].apply(clean_date_str)

    existing_songs_map = {}
    for name in df['歌名'].tolist():
        name = str(name).strip()
        if name:
            existing_songs_map[name.lower()] = name

    lines = RAW_DATA.strip().split('\n')
    stream_date = get_date_from_header(lines)

    if not stream_date:
        print("❌ 错误：无法从第一行提取日期！")
        return
    print(f"✅ 识别到直播日期: {stream_date}")

    new_songs_count = 0
    updated_songs_count = 0

    for line in lines:
        line = line.strip()
        if not line: continue

        match = re.match(r'^(\d{3,4})\s+(.+)$', line)
        if not match:
            continue

        raw_song_text = match.group(2).strip()
        raw_song_lower = raw_song_text.lower()

        target_song_name = raw_song_text
        found = False
        match_info = ""

        if raw_song_lower in existing_songs_map:
            target_song_name = existing_songs_map[raw_song_lower]
            found = True
        else:
            parts = raw_song_text.split(' ')
            if len(parts) > 1:
                potential_name = parts[0]
                potential_lower = potential_name.lower()
                if potential_lower in existing_songs_map:
                    target_song_name = existing_songs_map[potential_lower]
                    found = True
                    match_info = f" (模糊匹配: {raw_song_text})"

        if found:
            # === 老歌更新 ===
            mask = df['歌名'] == target_song_name
            idx = df[mask].index[0]

            current_date = clean_date_str(df.at[idx, '日期'])
            if stream_date not in current_date:
                new_date = f"{current_date}，{stream_date}" if current_date else stream_date
                df.at[idx, '日期'] = new_date.strip('，')

            try:
                count = int(float(df.at[idx, '次数'])) if df.at[idx, '次数'] else 0
                df.at[idx, '次数'] = str(count + 1)
            except ValueError:
                df.at[idx, '次数'] = '1'

            updated_songs_count += 1
            print(f"[更新] {target_song_name}{match_info}")

        else:
            # === 新歌追加 ===
            new_row = {
                '序号': '',
                '歌名': raw_song_text,
                '歌名翻译': '',
                '原唱': '',
                '日期': stream_date,
                '备注': '',
                '语言': '',
                '次数': '1',
                '歌切': ''
            }
            df = pd.concat([df, pd.DataFrame([new_row])], ignore_index=True)
            existing_songs_map[raw_song_text.lower()] = raw_song_text
            new_songs_count += 1
            print(f"[新增] {raw_song_text}")

    print("-" * 30)
    print(f"处理完成！新增: {new_songs_count} 首, 更新: {updated_songs_count} 首")

    # 1. 保存 CSV
    try:
        df.to_csv(CSV_PATH, index=False, encoding='utf-8-sig')
        print(f"✅ CSV 已保存: {CSV_PATH}")
    except PermissionError:
        print(f"❌ 保存 CSV 失败: 文件可能被打开")

    # 2. 导出 Excel
    try:
        df.to_excel(EXCEL_PATH, index=False, engine='openpyxl')
        print(f"✅ Excel 已生成: {EXCEL_PATH}")
    except PermissionError:
        print(f"⚠️ 警告: Excel 文件被占用，无法自动导出。但不影响 CSV 保存。")


if __name__ == "__main__":
    update_songs()