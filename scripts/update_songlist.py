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
251231 晚台 理歌单

射守矢真兔
2026年01月01日 02:50
三理Mit3uri：网页链接​ 
直播间：网页链接​

2120 I Really Want to Stay At Your House
2128 住在天狼星的那个人
2139 别再问我什么是迪斯科
2157 Super Star
2217 supernatural
2254 霓虹甜心
2304 ditto
2318 时间煮雨
2338 处处吻
2415 世界上的另一个我
2550 Have a nice day
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

    # === 构建索引映射 (修改部分) ===
    existing_songs_map = {}  # 小写歌名 -> 原歌名
    translated_songs_map = {}  # 小写译名 -> 原歌名 (新增)

    # 遍历每一行，同时建立 歌名 和 译名 的索引
    for index, row in df.iterrows():
        # 获取歌名
        s_name = str(row.get('歌名', '')).strip()
        if s_name:
            existing_songs_map[s_name.lower()] = s_name

        # 获取译名 (如果列存在且不为空)
        t_name = str(row.get('歌名翻译', '')).strip()
        if t_name:
            # 关键：如果有译名，建立 "小写译名 -> 原歌名" 的映射
            translated_songs_map[t_name.lower()] = s_name

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

        # === 匹配逻辑 (修改部分) ===

        # 1. 尝试 歌名 精确匹配 (忽略大小写)
        if raw_song_lower in existing_songs_map:
            target_song_name = existing_songs_map[raw_song_lower]
            found = True

        # 2. [新增] 尝试 译名 精确匹配 (忽略大小写)
        # 例如：原数据里有 歌名="Unravel" 译名="错乱"，这里输入 "错乱" 也能找到 "Unravel"
        elif raw_song_lower in translated_songs_map:
            target_song_name = translated_songs_map[raw_song_lower]
            found = True
            match_info = f" (通过译名匹配: {raw_song_text} -> {target_song_name})"

        # 3. 尝试 模糊匹配 (取空格前第一段去匹配歌名)
        else:
            parts = raw_song_text.split(' ')
            if len(parts) > 1:
                potential_name = parts[0]
                potential_lower = potential_name.lower()

                # 模糊匹配也先查歌名
                if potential_lower in existing_songs_map:
                    target_song_name = existing_songs_map[potential_lower]
                    found = True
                    match_info = f" (模糊匹配歌名: {raw_song_text})"
                # 再查译名 (可选，为了更强力也可以加上)
                elif potential_lower in translated_songs_map:
                    target_song_name = translated_songs_map[potential_lower]
                    found = True
                    match_info = f" (模糊匹配译名: {raw_song_text} -> {target_song_name})"

        if found:
            # === 老歌更新 ===
            mask = df['歌名'] == target_song_name
            # 安全检查：确保能找到行
            if mask.any():
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
                print(f"⚠️ 警告: 逻辑判定找到了 {target_song_name} 但 DataFrame 中未定位到，请检查数据完整性。")

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
            # 添加到缓存，防止同一次直播里重复添加
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

    # # 2. 导出 Excel
    # try:
    #     df.to_excel(EXCEL_PATH, index=False, engine='openpyxl')
    #     print(f"✅ Excel 已生成: {EXCEL_PATH}")
    # except PermissionError:
    #     print(f"⚠️ 警告: Excel 文件被占用，无法自动导出。但不影响 CSV 保存。")


if __name__ == "__main__":
    update_songs()