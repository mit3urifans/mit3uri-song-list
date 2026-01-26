import pandas as pd
import os
import re

# ================= 配置区域 =================
# 源文件: 你手动修改的 CSV
CSV_PATH = 'music_data.csv'
# 目标文件: 网站构建需要的 Excel
EXCEL_PATH = 'Book1.xlsx'


# ===========================================

def clean_date_str(date_val):
    """
    清洗日期格式，防止 Excel 显示乱码或带时间
    1. 去除 00:00:00
    2. 强制将横杠 - 替换为斜杠 /
    """
    if pd.isna(date_val):
        return ""
    s = str(date_val).strip()
    # 正则去掉时间 (00:00:00)
    s = re.sub(r'\s+\d{1,2}:\d{2}:\d{2}', '', s)
    # 强制变成斜杠
    s = s.replace("-", "/")
    return s


def generate_xlsx():
    print(f"正在读取 {CSV_PATH} ...")

    if not os.path.exists(CSV_PATH):
        print(f"❌ 错误：找不到 {CSV_PATH}！")
        return

    try:
        # 1. 读取 CSV (强制所有列为文本格式，防止数字被 Excel 科学计数法)
        df = pd.read_csv(CSV_PATH, dtype=str, encoding='utf-8-sig')
    except Exception as e:
        print(f"❌ 读取 CSV 失败: {e}")
        return

    # 2. 数据清洗
    df.fillna('', inplace=True)

    # 确保日期列格式正确
    if '日期' in df.columns:
        df['日期'] = df['日期'].apply(clean_date_str)

    print(f"正在生成 {EXCEL_PATH} ...")

    # 3. 导出为 Excel
    try:
        # engine='openpyxl' 是必须的
        df.to_excel(EXCEL_PATH, index=False, engine='openpyxl')
        print(f"✅ 成功！Book1.xlsx 已更新。")
        print(f"现在你可以运行 npm run build 来构建网站了。")
    except PermissionError:
        print(f"❌ 失败：Book1.xlsx 正被打开，请关闭 Excel/WPS 后重试！")
    except Exception as e:
        print(f"❌ 生成 Excel 时发生错误: {e}")


if __name__ == "__main__":
    generate_xlsx()