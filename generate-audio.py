#!/usr/bin/env python3
"""
Generates WAV audio files for all Spanish and Catalan texts in the app.
Uses Piper TTS: sharvard-medium (ES) and upc_pau-x_low (CA).

Output: src/main/resources/static/audio/{es|ca}/{djb2(text)}.wav

Filename is a DJB2 hash of the cleaned text (first form before '/')
so the Angular AudioService can derive the filename client-side without
any extra lookup table.

Usage:
    /opt/homebrew/bin/python3 generate-audio.py
"""

import json
import wave
import sys
from pathlib import Path

try:
    from piper import PiperVoice
except ImportError:
    print("ERROR: piper-tts not installed. Run:")
    print("  /opt/homebrew/bin/pip3 install piper-tts --break-system-packages")
    sys.exit(1)

# ── Paths ────────────────────────────────────────────────────────────────────
ROOT   = Path(__file__).parent
MODELS = ROOT / "piper/models"
ES_MODEL = MODELS / "es_ES-sharvard-medium.onnx"
CA_MODEL = MODELS / "ca_ES-upc_pau-x_low.onnx"
DATA   = ROOT / "src/main/resources/data"
OUT_ES = ROOT / "src/main/resources/static/audio/es"
OUT_CA = ROOT / "src/main/resources/static/audio/ca"

OUT_ES.mkdir(parents=True, exist_ok=True)
OUT_CA.mkdir(parents=True, exist_ok=True)

# ── DJB2 hash — MUST match AudioService.djb2() in TypeScript ─────────────────
def djb2(text: str) -> str:
    h = 5381
    for c in text:
        h = ((h << 5) + h) ^ ord(c)
        h &= 0xFFFFFFFF
    return format(h, '08x')

def clean(text: str) -> str:
    """Take first form when word has alternatives, e.g. 'dos / dues' → 'dos'."""
    return text.split('/')[0].strip()

# ── WAV writer ────────────────────────────────────────────────────────────────
def write_wav(out_path: Path, voice: PiperVoice, text: str) -> bool:
    if out_path.exists():
        return False  # skip existing
    chunks = list(voice.synthesize(text))
    if not chunks:
        return False
    with wave.open(str(out_path), 'wb') as wf:
        c = chunks[0]
        wf.setnchannels(c.sample_channels)
        wf.setsampwidth(c.sample_width)
        wf.setframerate(c.sample_rate)
        for chunk in chunks:
            wf.writeframes(chunk.audio_int16_bytes)
    return True

# ── Collect all texts ─────────────────────────────────────────────────────────
es_texts: set[str] = set()
ca_texts: set[str] = set()

def add_from_json(filepath: Path, es_key: str = 'spanish', ca_key: str = 'catalan'):
    data = json.loads(filepath.read_text(encoding='utf-8'))
    for entry in data:
        if entry.get(es_key):
            es_texts.add(clean(entry[es_key]))
        if entry.get(ca_key):
            ca_texts.add(clean(entry[ca_key]))

# JSON data files
add_from_json(DATA / "colors.json")
add_from_json(DATA / "introduction-phrases.json")
add_from_json(DATA / "shopping-phrases.json")
add_from_json(DATA / "shopping-items.json")

# Numbers (hardcoded in Java — reproduce here)
NUMBERS_ES = [
    "cero","uno","dos","tres","cuatro","cinco","seis","siete","ocho","nueve",
    "diez","once","doce","trece","catorce","quince","dieciséis","diecisiete",
    "dieciocho","diecinueve","veinte","veintiuno","veintidós","treinta",
    "cuarenta","cincuenta","sesenta","setenta","ochenta","noventa","cien",
    "doscientos","trescientos","cuatrocientos","quinientos","seiscientos",
    "setecientos","ochocientos","novecientos","mil","un millón",
]
NUMBERS_CA = [
    "zero","un","dos","tres","quatre","cinc","sis","set","vuit","nou",
    "deu","onze","dotze","tretze","catorze","quinze","setze","disset",
    "divuit","dinou","vint","vint-i-un","vint-i-dos","trenta",
    "quaranta","cinquanta","seixanta","setanta","vuitanta","noranta","cent",
    "dos-cents","tres-cents","quatre-cents","cinc-cents","sis-cents",
    "set-cents","vuit-cents","nou-cents","mil","un milió",
]
for t in NUMBERS_ES:
    es_texts.add(clean(t))
for t in NUMBERS_CA:
    ca_texts.add(clean(t))

# Remove empty strings
es_texts.discard('')
ca_texts.discard('')

print(f"Texts to synthesize: {len(es_texts)} ES, {len(ca_texts)} CA")
print("Loading voices (may take a moment)...")

voice_es = PiperVoice.load(str(ES_MODEL))
voice_ca = PiperVoice.load(str(CA_MODEL))

print("Voices loaded. Generating audio files...")

# ── Generate ES ───────────────────────────────────────────────────────────────
es_new = 0
for i, text in enumerate(sorted(es_texts), 1):
    out = OUT_ES / f"{djb2(text)}.wav"
    if write_wav(out, voice_es, text):
        es_new += 1
    if i % 50 == 0:
        print(f"  ES: {i}/{len(es_texts)}")

print(f"ES done — {es_new} new, {len(es_texts)-es_new} skipped")

# ── Generate CA ───────────────────────────────────────────────────────────────
ca_new = 0
for i, text in enumerate(sorted(ca_texts), 1):
    out = OUT_CA / f"{djb2(text)}.wav"
    if write_wav(out, voice_ca, text):
        ca_new += 1
    if i % 50 == 0:
        print(f"  CA: {i}/{len(ca_texts)}")

print(f"CA done — {ca_new} new, {len(ca_texts)-ca_new} skipped")
print(f"\nTotal: {len(es_texts)+len(ca_texts)} WAV files in src/main/resources/static/audio/")
