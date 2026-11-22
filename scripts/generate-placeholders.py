#!/usr/bin/env python3
"""
Generates the gold-on-green placeholder media used by the site until real work
is dropped in. Everything lands in /public/media.

  python3 scripts/generate-placeholders.py

Requires: numpy, Pillow, ffmpeg on PATH. Safe to delete once your real media
is in place — nothing at runtime depends on this script.
"""
from __future__ import annotations

import math
import os
import subprocess
import wave
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "media"
(OUT / "work").mkdir(parents=True, exist_ok=True)

FPS = 24
CLIP_SECONDS = 6

# Brand palette ramp: velvet green -> deep gold -> gold -> light gold -> highlight
STOPS = np.array([0.0, 0.35, 0.62, 0.82, 1.0])
RAMP = np.array(
    [
        [11, 36, 25],
        [70, 62, 30],
        [156, 122, 50],
        [214, 178, 96],
        [250, 236, 196],
    ],
    dtype=np.float32,
)


def colorize(v: np.ndarray) -> np.ndarray:
    v = np.clip(v, 0.0, 1.0)
    out = np.empty(v.shape + (3,), dtype=np.float32)
    for c in range(3):
        out[..., c] = np.interp(v, STOPS, RAMP[:, c])
    return out


def grid(w: int, h: int):
    aspect = w / h
    x = np.linspace(-aspect, aspect, w, dtype=np.float32)
    y = np.linspace(-1, 1, h, dtype=np.float32)
    return np.meshgrid(x, y)


def vignette(w: int, h: int, strength=0.85) -> np.ndarray:
    x, y = grid(w, h)
    r = np.sqrt((x / (w / h)) ** 2 + y**2)
    return np.clip(1.0 - strength * (r**2.2) * 0.75, 0.0, 1.0)


# ---------------------------------------------------------------------------
# Looks. Each takes (w, h, phase in [0, 2pi)) and returns an HxWx3 float image.
# ---------------------------------------------------------------------------


def look_liquid(w, h, p):
    x, y = grid(w, h)
    q = np.sin(x * 2.1 + np.cos(p)) + np.sin(y * 2.7 - np.sin(p) * 1.3)
    wx = x + 0.45 * np.sin(y * 3.3 + q + p)
    wy = y + 0.35 * np.cos(x * 2.4 - q + p)
    v = 0.5 + 0.5 * np.sin(wx * 5.0 + wy * 3.0 + q * 2.2)
    v = v**3.2
    v = v * vignette(w, h) * 1.05
    return colorize(v)


def look_rings(w, h, p):
    x, y = grid(w, h)
    r = np.sqrt(x**2 + y**2)
    a = np.arctan2(y, x)
    wob = 0.06 * np.sin(a * 6 + p) + 0.04 * np.sin(a * 11 - 2 * p)
    v = 0.5 + 0.5 * np.sin((r + wob) * 42 - p * 6)
    v = (v**9) * np.exp(-r * 1.6) * 1.6
    glow = np.exp(-((r - 0.42 - 0.04 * np.sin(p * 2)) ** 2) / 0.002) * 0.9
    return colorize(np.clip(v + glow, 0, 1) * vignette(w, h))


def _blurred_points(w, h, xs, ys, weights, radius):
    img = np.zeros((h, w), dtype=np.float32)
    ix = np.clip(xs.astype(int), 0, w - 1)
    iy = np.clip(ys.astype(int), 0, h - 1)
    np.add.at(img, (iy, ix), weights)
    pil = Image.fromarray(np.clip(img * 255 * 4, 0, 255).astype(np.uint8))
    sharp = np.asarray(pil.filter(ImageFilter.GaussianBlur(radius * 0.6)), dtype=np.float32) / 255
    soft = np.asarray(pil.filter(ImageFilter.GaussianBlur(radius * 3)), dtype=np.float32) / 255
    return sharp * 2.5 + soft * 3.5


_rng = np.random.default_rng(7)
_DUST = _rng.random((2600, 4)).astype(np.float32)


def look_dust(w, h, p):
    s = min(w, h)
    d = _DUST
    ang = d[:, 0] * math.tau + p * np.where(d[:, 2] > 0.5, 1, -1)
    rad = (0.12 + d[:, 1] ** 0.6 * 0.9) * s * 0.6
    breathe = 1 + 0.08 * np.sin(p * 2 + d[:, 3] * 6)
    xs = w / 2 + np.cos(ang) * rad * breathe * 1.45
    ys = h / 2 + np.sin(ang) * rad * breathe * 0.7
    img = Image.new("L", (w, h), 0)
    draw = ImageDraw.Draw(img)
    size = s / 540
    for x0, y0, b in zip(xs, ys, d[:, 3]):
        r = size * (0.6 + b * 1.6)
        draw.ellipse([x0 - r, y0 - r, x0 + r, y0 + r], fill=int(90 + 165 * b))
    sharp = np.asarray(img, dtype=np.float32) / 255
    glow = np.asarray(img.filter(ImageFilter.GaussianBlur(s / 70)), dtype=np.float32) / 255
    x, y = grid(w, h)
    core = 0.22 * np.exp(-(x**2 + y**2) * 2.2)
    return colorize(np.clip(sharp * 0.95 + glow * 2.2 + core, 0, 1))


def look_lines(w, h, p):
    img = Image.new("RGB", (w, h), tuple(RAMP[0].astype(int)))
    draw = ImageDraw.Draw(img)
    n = 46
    xs = np.linspace(0, w, 160)
    for k in range(n):
        base = h * (0.08 + 0.84 * k / (n - 1))
        f = k / n
        amp = h * 0.06 * (0.4 + math.sin(f * math.pi) * 1.2)
        ys = (
            base
            + amp * np.sin(xs / w * 5.2 + p + f * 4)
            + amp * 0.5 * np.sin(xs / w * 11.0 - p * 2 + f * 9)
        )
        bright = 0.35 + 0.65 * (0.5 + 0.5 * math.sin(f * 7 + p))
        col = tuple(colorize(np.array(0.45 + bright * 0.5)).astype(int).tolist())
        draw.line(list(zip(xs.tolist(), ys.tolist())), fill=col, width=max(1, w // 640))
    arr = np.asarray(img, dtype=np.float32)
    return arr * vignette(w, h)[..., None] + RAMP[0] * (1 - vignette(w, h)[..., None])


def look_chevrons(w, h, p):
    x, y = grid(w, h)
    k = 5.0
    band = np.abs(x) * k * 0.9 + y * k
    v = 0.5 + 0.5 * np.sin(band * math.pi - p * 2 * 2)
    v = np.where(v > 0.93, 1.0, v**14 * 0.6)
    fade = np.exp(-(x**2) * 0.5) * (0.4 + 0.6 * (0.5 + 0.5 * np.sin(y * 2 + p)))
    return colorize(v * fade * vignette(w, h) + 0.04)


def look_spectrum(w, h, p):
    img = Image.new("L", (w, h), 0)
    draw = ImageDraw.Draw(img)
    cx, cy = w / 2, h / 2
    s = min(w, h)
    bars = 180
    for i in range(bars):
        a = i / bars * math.tau
        e = (
            0.5
            + 0.3 * math.sin(a * 3 + p * 2)
            + 0.2 * math.sin(a * 7 - p * 3)
            + 0.15 * math.sin(a * 13 + p)
        )
        r0 = s * 0.26
        r1 = r0 + s * 0.22 * max(0.05, e) ** 2
        draw.line(
            [(cx + math.cos(a) * r0, cy + math.sin(a) * r0), (cx + math.cos(a) * r1, cy + math.sin(a) * r1)],
            fill=int(140 + 110 * max(0, min(1, e))),
            width=max(2, s // 220),
        )
    draw.ellipse([cx - s * 0.24, cy - s * 0.24, cx + s * 0.24, cy + s * 0.24], outline=200, width=max(1, s // 400))
    arr = np.asarray(img, dtype=np.float32) / 255
    glow = np.asarray(img.filter(ImageFilter.GaussianBlur(s / 50)), dtype=np.float32) / 255
    return colorize(np.clip(arr * 0.9 + glow * 0.8, 0, 1))


def look_sphere(w, h, p):
    x, y = grid(w, h)
    a = np.arctan2(y, x)
    R = 0.62 + 0.035 * np.sin(a * 5 + p) + 0.02 * np.sin(a * 9 - 2 * p)
    r2 = (x**2 + y**2) / R**2
    inside = r2 < 1
    nz = np.sqrt(np.clip(1 - r2, 0, 1))
    nx, ny = x / R, y / R
    # reflection vector of view dir (0,0,-1)
    ry = 2 * nz * ny
    rx = 2 * nz * nx
    env = 0.5 + 0.5 * np.sin(ry * 4.5 + np.sin(rx * 3 + p) * 1.4 + p)
    env = env**2.2
    fres = (1 - nz) ** 2.5
    v = np.where(inside, 0.25 + env * 0.7 + fres * 0.4, 0)
    halo = np.exp(-np.maximum(np.sqrt(r2) - 1, 0) * 9) * (~inside) * 0.35
    return colorize(np.clip(v + halo, 0, 1) * vignette(w, h, 0.6))


def look_smoke(w, h, p):
    x, y = grid(w, h)
    v = np.zeros_like(x)
    amp, freq = 0.5, 1.2
    for i in range(5):
        v += amp * np.sin(x * freq + np.sin(y * freq * 0.8 + p + i) * 1.5 + p * (1 if i % 2 else -1))
        v += amp * np.cos(y * freq * 1.1 + np.cos(x * freq * 0.7 - p + i) * 1.2)
        amp *= 0.55
        freq *= 2.03
    v = 0.5 + v * 0.35
    v = np.clip(v, 0, 1) ** 2.6
    return colorize(v * vignette(w, h) * 1.1)


LOOKS = {
    "liquid": look_liquid,
    "rings": look_rings,
    "dust": look_dust,
    "lines": look_lines,
    "chevrons": look_chevrons,
    "spectrum": look_spectrum,
    "sphere": look_sphere,
    "smoke": look_smoke,
}


def encode(frames_fn, path: Path, w: int, h: int, n: int, crf=27):
    cmd = [
        "ffmpeg", "-y", "-loglevel", "error",
        "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{w}x{h}", "-r", str(FPS), "-i", "-",
        "-c:v", "libx264", "-preset", "slow", "-crf", str(crf), "-pix_fmt", "yuv420p",
        "-movflags", "+faststart", "-an", str(path),
    ]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    for i in range(n):
        frame = frames_fn(i)
        proc.stdin.write(np.clip(frame, 0, 255).astype(np.uint8).tobytes())
    proc.stdin.close()
    proc.wait()


def save_jpg(arr, path: Path, q=82):
    Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8)).save(path, quality=q, optimize=True, progressive=True)


def make_work_clips():
    w, h = 960, 540
    n = FPS * CLIP_SECONDS
    for name, fn in LOOKS.items():
        print("clip", name)
        encode(lambda i: fn(w, h, i / n * math.tau), OUT / "work" / f"{name}.mp4", w, h, n)
        save_jpg(fn(1600, 900, 0.6), OUT / "work" / f"{name}.jpg")


def make_reel():
    w, h = 1280, 720
    order = ["liquid", "sphere", "smoke", "lines", "rings", "chevrons"]
    seg = FPS * 3
    fade = FPS // 2
    total = seg * len(order)

    def frame(i):
        idx = i // seg
        local = i % seg
        p = i / total * math.tau * 2
        a = LOOKS[order[idx]](w, h, p)
        if local >= seg - fade:
            t = (local - (seg - fade)) / fade
            b = LOOKS[order[(idx + 1) % len(order)]](w, h, p)
            return a * (1 - t) + b * t
        return a

    print("reel")
    encode(frame, OUT / "reel.mp4", w, h, total, crf=29)
    save_jpg(look_liquid(1920, 1080, 0.0), OUT / "reel-poster.jpg", q=78)


def make_portrait():
    # Abstract liquid-gold frame in portrait orientation (TODO in site.ts: swap for a real photo)
    save_jpg(look_liquid(1000, 1300, 2.4), OUT / "portrait.jpg")


def make_press_kit():
    page = Image.new("RGB", (1240, 1754), (11, 36, 25))
    d = ImageDraw.Draw(page)
    try:
        big = ImageFont.truetype("DejaVuSans.ttf", 96)
        small = ImageFont.truetype("DejaVuSans.ttf", 32)
    except OSError:
        big = small = ImageFont.load_default()
    d.text((120, 200), "MAK STUDIO", fill=(201, 162, 75), font=big)
    d.text((120, 340), "Press Kit — placeholder", fill=(233, 223, 199), font=small)
    d.text((120, 400), "Replace /public/press-kit.pdf with your real press kit.", fill=(233, 223, 199), font=small)
    d.line([(120, 480), (1120, 480)], fill=(156, 122, 50), width=2)
    page.save(ROOT / "public" / "press-kit.pdf", "PDF", resolution=150)


# ---------------------------------------------------------------------------
# Sample track: 120 BPM, ~56s, built so the visualizer has kick / bass / hats /
# melody to react to.
# ---------------------------------------------------------------------------


def make_track():
    sr = 44100
    bpm = 120
    beat = 60 / bpm
    bar = beat * 4
    bars = 28
    n = int(sr * bar * bars)
    t = np.arange(n) / sr
    mix = np.zeros(n, dtype=np.float64)
    rng = np.random.default_rng(3)

    def at(sec):
        return int(sec * sr)

    def add(sig, start):
        s = at(start)
        e = min(n, s + len(sig))
        mix[s:e] += sig[: e - s]

    # sections (in bars)
    def section(b):
        if b < 4:
            return "intro"
        if b < 8:
            return "build"
        if b < 16:
            return "drop"
        if b < 20:
            return "break"
        if b < 26:
            return "drop"
        return "outro"

    # chord roots (Hz) — D minor-ish: Dm, Bb, F, C
    roots = [73.42, 58.27, 87.31, 65.41]
    chords = [
        [293.66, 349.23, 440.00],
        [233.08, 293.66, 349.23],
        [261.63, 349.23, 440.00],
        [261.63, 329.63, 392.00],
    ]

    kick_len = int(sr * 0.45)
    kt = np.arange(kick_len) / sr
    kick = np.sin(2 * np.pi * (45 * kt + (110 / 18) * (1 - np.exp(-18 * kt)))) * np.exp(-kt * 7)
    kick += 0.3 * np.sin(2 * np.pi * 180 * kt) * np.exp(-kt * 60)

    hat_len = int(sr * 0.06)
    hat = rng.standard_normal(hat_len) * np.exp(-np.arange(hat_len) / sr * 70)
    hat = np.diff(hat, prepend=0) * 0.5  # crude high-pass

    clap_len = int(sr * 0.25)
    clap = rng.standard_normal(clap_len) * np.exp(-np.arange(clap_len) / sr * 18)
    clap = np.convolve(clap, np.ones(6) / 6, mode="same")

    for b in range(bars):
        sec = section(b)
        bt = b * bar
        ci = b % 4
        # pad
        pad_len = int(sr * bar)
        pt = np.arange(pad_len) / sr
        env = np.minimum(1, pt / 0.8) * np.minimum(1, (bar - pt) / 0.5)
        pad = sum(
            np.sin(2 * np.pi * f * pt) + 0.5 * np.sin(2 * np.pi * f * 1.005 * pt) + 0.25 * np.sin(2 * np.pi * f * 2.0 * pt)
            for f in chords[ci]
        )
        pad_gain = 0.05 if sec in ("drop",) else 0.08
        add(pad * env * pad_gain, bt)

        for q in range(4):
            beat_t = bt + q * beat
            if sec in ("build", "drop") or (sec == "outro" and b < 27):
                add(kick * 0.9, beat_t)
            if sec == "drop" and q in (1, 3):
                add(clap * 0.35, beat_t)
            # bass: offbeat 8ths in drops
            if sec == "drop":
                bl = int(sr * beat * 0.45)
                btt = np.arange(bl) / sr
                f = roots[ci]
                bass = np.tanh(2.2 * (np.sin(2 * np.pi * f * btt) + 0.4 * np.sin(2 * np.pi * f * 2 * btt)))
                add(bass * np.exp(-btt * 4) * 0.35, beat_t + beat / 2)
            # hats
            if sec in ("build", "drop", "break"):
                for e in range(2 if sec != "drop" else 4):
                    add(hat * (0.18 if e % 2 else 0.1), beat_t + e * beat / (2 if sec != "drop" else 4))
        # arpeggio
        if sec in ("drop", "break", "outro"):
            notes = chords[ci] + [chords[ci][0] * 2]
            for s16 in range(16):
                f = notes[(s16 * 3) % 4] * (2 if sec == "break" else 1)
                nl = int(sr * beat / 4 * 1.8)
                nt = np.arange(nl) / sr
                tone = np.sin(2 * np.pi * f * nt) + 0.3 * np.sin(2 * np.pi * f * 3 * nt)
                add(tone * np.exp(-nt * 14) * 0.07, bt + s16 * beat / 4)

    # riser before the first drop
    rs, re_ = at(7 * bar), at(8 * bar)
    rt = np.arange(re_ - rs) / sr
    riser = rng.standard_normal(re_ - rs) * (rt / rt[-1]) ** 2 * 0.12
    mix[rs:re_] += np.convolve(riser, np.ones(3) / 3, mode="same")

    # master: fade out, soft clip, normalize
    fade = np.minimum(1, (t[-1] - t) / 3.0)
    mix *= fade
    mix = np.tanh(mix * 1.4)
    mix /= np.max(np.abs(mix)) + 1e-9
    mix *= 0.92
    stereo = np.stack([mix, np.roll(mix, 220) * 0.98], axis=1)
    pcm = (stereo * 32767).astype(np.int16)

    wav_path = OUT / "sample-track.wav"
    with wave.open(str(wav_path), "wb") as wf:
        wf.setnchannels(2)
        wf.setsampwidth(2)
        wf.setframerate(sr)
        wf.writeframes(pcm.tobytes())
    subprocess.run(
        ["ffmpeg", "-y", "-loglevel", "error", "-i", str(wav_path), "-c:a", "libmp3lame", "-b:a", "160k", str(OUT / "sample-track.mp3")],
        check=True,
    )
    wav_path.unlink()
    print("track")


if __name__ == "__main__":
    import sys
    os.chdir(ROOT)
    only = set(sys.argv[1:])
    if only:
        for name in only:
            globals()[name]()
        raise SystemExit
    make_work_clips()
    make_reel()
    make_portrait()
    make_press_kit()
    make_track()
    print("done")
