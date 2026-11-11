# アプリのアイコン（PNG）を作る。外部ライブラリなし。
# 使い方: python3 scripts/make-icons.py   → icons/ に4つ書き出す
# 図柄: 緑の地に、クリーム色の牌が1枚。牌には一筒のような赤い円。
import math
import os
import struct
import zlib

GREEN = (31, 107, 79)
CREAM = (251, 245, 228)
EDGE = (201, 185, 143)
RED = (194, 53, 46)
BLUE = (31, 78, 140)


def rounded(x, y, x0, y0, x1, y1, r):
    """角の丸い長方形の中なら 0〜1（端はなめらかに）"""
    cx = min(max(x, x0 + r), x1 - r)
    cy = min(max(y, y0 + r), y1 - r)
    d = math.hypot(x - cx, y - cy)
    return max(0.0, min(1.0, r - d + 0.5))


def mix(a, b, t):
    return tuple(round(a[i] * (1 - t) + b[i] * t) for i in range(3))


def draw(size, pad):
    """pad: 地の余白（maskable は大きめ）"""
    rows = []
    s = size
    tw = s * (1 - 2 * pad) * 0.62
    th = tw * 1.33
    x0, y0 = (s - tw) / 2, (s - th) / 2
    x1, y1 = x0 + tw, y0 + th
    cx, cy = s / 2, s / 2
    for j in range(s):
        row = bytearray([0])
        for i in range(s):
            x, y = i + 0.5, j + 0.5
            c = GREEN
            edge = rounded(x, y, x0, y0, x1, y1, tw * 0.12)
            if edge > 0:
                c = mix(c, EDGE, edge)
                inner = rounded(x, y, x0 + s * 0.012, y0 + s * 0.012, x1 - s * 0.012, y1 - s * 0.012, tw * 0.1)
                c = mix(c, CREAM, inner)
                d = math.hypot(x - cx, y - cy)
                for radius, color in ((tw * 0.36, BLUE), (tw * 0.3, CREAM), (tw * 0.22, RED), (tw * 0.08, CREAM)):
                    t = max(0.0, min(1.0, radius - d + 0.5))
                    if t > 0:
                        c = mix(c, color, t * inner)
            row += bytes(c)
        rows.append(bytes(row))
    raw = b''.join(rows)

    def chunk(tag, data):
        return struct.pack('>I', len(data)) + tag + data + struct.pack('>I', zlib.crc32(tag + data) & 0xFFFFFFFF)

    ihdr = struct.pack('>IIBBBBB', s, s, 8, 2, 0, 0, 0)
    return b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', ihdr) + chunk(b'IDAT', zlib.compress(raw, 9)) + chunk(b'IEND', b'')


root = os.path.join(os.path.dirname(__file__), '..', 'icons')
os.makedirs(root, exist_ok=True)
for name, size, pad in (
    ('icon-192.png', 192, 0.0),
    ('icon-512.png', 512, 0.0),
    ('icon-maskable-512.png', 512, 0.1),
    ('apple-touch-icon.png', 180, 0.0),
):
    with open(os.path.join(root, name), 'wb') as f:
        f.write(draw(size, pad))
    print(name)
