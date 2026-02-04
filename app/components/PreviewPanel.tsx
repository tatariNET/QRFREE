"use client";

import { useMemo, useState } from "react";

type PreviewPanelProps = {
  svgMarkup: string;
  blur: number;
  contrast: number;
  noise: number;
  onBlurChange: (value: number) => void;
  onContrastChange: (value: number) => void;
  onNoiseChange: (value: number) => void;
};

export default function PreviewPanel({
  svgMarkup,
  blur,
  contrast,
  noise,
  onBlurChange,
  onContrastChange,
  onNoiseChange,
}: PreviewPanelProps) {
  const [showBefore, setShowBefore] = useState(false);

  const noiseStyle = useMemo(() => {
    if (noise <= 0) return "";
    return `linear-gradient(rgba(0,0,0,${noise / 100}), rgba(0,0,0,${
      noise / 100
    }))`;
  }, [noise]);

  const rangeBackground = (
    value: number,
    min: number,
    max: number,
    start: string,
    end: string,
  ) => {
    const percent = ((value - min) / (max - min)) * 100;
    return `linear-gradient(90deg, ${start} 0%, ${end} ${percent}%, rgba(148, 163, 184, 0.35) ${percent}%, rgba(148, 163, 184, 0.2) 100%)`;
  };

  const confidenceScore = Math.max(
    0,
    Math.min(100, 100 - blur * 18 - noise * 1.2 - Math.abs(100 - contrast) * 0.6),
  );

  const confidenceLabel =
    confidenceScore > 75
      ? "High"
      : confidenceScore > 50
        ? "Medium"
        : "Low";

  return (
    <section className="rounded-none border border-zinc-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/70">
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        Preview
      </h2>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        Print safety simulation with blur, contrast, and noise.
      </p>

      <div className="mt-6 flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-zinc-700 dark:text-zinc-200">
              Scan confidence
            </span>
            <span className="rounded-none border border-zinc-200 px-2 py-0.5 text-[10px] uppercase tracking-wide dark:border-zinc-700">
              {confidenceLabel}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="border border-zinc-200 px-2 py-1 text-[11px] uppercase tracking-wide text-zinc-600 transition hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-300"
              onClick={() => setShowBefore((value) => !value)}
            >
              {showBefore ? "Show after" : "Show before"}
            </button>
          </div>
        </div>

        <div
          className="relative flex h-72 w-72 items-center justify-center rounded-none border border-dashed border-zinc-200 bg-white p-4 shadow-inner dark:border-zinc-700 dark:bg-zinc-950"
          style={{
            filter: showBefore ? "none" : `blur(${blur}px) contrast(${contrast}%)`,
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)",
            backgroundSize: "12px 12px",
          }}
        >
          <div
            className="absolute inset-0 rounded-none"
            style={{
              backgroundImage: showBefore ? "" : noiseStyle,
              opacity: noise / 100,
              pointerEvents: "none",
            }}
          />
          <div className="absolute inset-3 border border-dashed border-emerald-300/50" />
          <div
            className="qr-preview h-full w-full"
            dangerouslySetInnerHTML={{ __html: svgMarkup }}
          />
        </div>

        <div className="grid w-full gap-4 text-sm text-zinc-600 dark:text-zinc-300">
          <div className="flex flex-wrap gap-2 text-xs">
            <button
              type="button"
              className="border border-zinc-200 px-2 py-1 text-zinc-600 transition hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-300"
              onClick={() => {
                onBlurChange(0.5);
                onContrastChange(110);
                onNoiseChange(2);
              }}
            >
              Print Safe
            </button>
            <button
              type="button"
              className="border border-zinc-200 px-2 py-1 text-zinc-600 transition hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-300"
              onClick={() => {
                onBlurChange(0);
                onContrastChange(130);
                onNoiseChange(0);
              }}
            >
              High Contrast
            </button>
            <button
              type="button"
              className="border border-zinc-200 px-2 py-1 text-zinc-600 transition hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-300"
              onClick={() => {
                onBlurChange(1.5);
                onContrastChange(95);
                onNoiseChange(12);
              }}
            >
              Noisy
            </button>
            <button
              type="button"
              className="border border-zinc-200 px-2 py-1 text-zinc-600 transition hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-300"
              onClick={() => {
                onBlurChange(3);
                onContrastChange(90);
                onNoiseChange(8);
              }}
            >
              Blurred
            </button>
          </div>

          <label className="grid gap-2 text-xs">
            <div className="flex items-center justify-between">
              <span>Blur</span>
              <span className="text-zinc-500">{blur.toFixed(1)} px</span>
            </div>
            <div className="flex items-center gap-3">
              <input
                className="range-pro"
                type="range"
                min={0}
                max={4}
                step={0.5}
                value={blur}
                title="Simulate printer blur / camera shake"
                style={{
                  background: rangeBackground(
                    blur,
                    0,
                    4,
                    "#00f5a0",
                    "#00cfff",
                  ),
                }}
                onChange={(event) => onBlurChange(Number(event.target.value))}
              />
              <input
                type="number"
                min={0}
                max={4}
                step={0.5}
                value={blur}
                onChange={(event) => onBlurChange(Number(event.target.value))}
                className="w-16 border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
              />
            </div>
          </label>

          <label className="grid gap-2 text-xs">
            <div className="flex items-center justify-between">
              <span>Contrast</span>
              <span className="text-zinc-500">{contrast}%</span>
            </div>
            <div className="flex items-center gap-3">
              <input
                className="range-pro"
                type="range"
                min={70}
                max={140}
                step={5}
                value={contrast}
                title="High contrast ensures scanning reliability"
                style={{
                  background: rangeBackground(
                    contrast,
                    70,
                    140,
                    "#1a73e8",
                    "#4285f4",
                  ),
                }}
                onChange={(event) =>
                  onContrastChange(Number(event.target.value))
                }
              />
              <input
                type="number"
                min={70}
                max={140}
                step={5}
                value={contrast}
                onChange={(event) =>
                  onContrastChange(Number(event.target.value))
                }
                className="w-16 border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
              />
            </div>
          </label>

          <label className="grid gap-2 text-xs">
            <div className="flex items-center justify-between">
              <span>Noise</span>
              <span className="text-zinc-500">{noise}%</span>
            </div>
            <div className="flex items-center gap-3">
              <input
                className="range-pro"
                type="range"
                min={0}
                max={30}
                step={5}
                value={noise}
                title="Simulates printing artifacts"
                style={{
                  background: rangeBackground(
                    noise,
                    0,
                    30,
                    "#00f5a0",
                    "#00cfff",
                  ),
                }}
                onChange={(event) => onNoiseChange(Number(event.target.value))}
              />
              <input
                type="number"
                min={0}
                max={30}
                step={5}
                value={noise}
                onChange={(event) => onNoiseChange(Number(event.target.value))}
                className="w-16 border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
              />
            </div>
          </label>
        </div>
      </div>
    </section>
  );
}
