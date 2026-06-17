import { useCallback, useEffect, useRef, useState } from "react";
import { Upload, Loader2, FileText, RefreshCw, ScanLine } from "lucide-react";
import type { BillReading } from "@/services/db";
import { STRINGS } from "@/config/strings";

type Rect = { x: number; y: number; w: number; h: number }; // normalized 0..1

interface Props {
  variant: "previous" | "recent";
  onDone: (b: BillReading) => void;
}

// Simulated OCR result generator (mirrors PhotoScanner behavior).
function fakeReadResult(variant: "previous" | "recent"): BillReading {
  if (variant === "previous") return { kwh: 150, valueBRL: 125.5 };
  return Math.random() < 0.5 ? { kwh: 182, valueBRL: 154.8 } : { kwh: 132, valueBRL: 110.2 };
}

export function BillUploader({ variant, onDone }: Props) {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [isPdf, setIsPdf] = useState(false);
  const [rect, setRect] = useState<Rect>({ x: 0.1, y: 0.35, w: 0.8, h: 0.18 });
  const [reading, setReading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (fileUrl) URL.revokeObjectURL(fileUrl);
    };
  }, [fileUrl]);

  const handleFile = (f: File) => {
    if (fileUrl) URL.revokeObjectURL(fileUrl);
    const url = URL.createObjectURL(f);
    setFileUrl(url);
    setFileName(f.name);
    setIsPdf(f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"));
    setRect({ x: 0.1, y: 0.35, w: 0.8, h: 0.18 });
  };

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  };

  const handleRead = useCallback(() => {
    setReading(true);
    setTimeout(() => {
      onDone(fakeReadResult(variant));
      setReading(false);
    }, 2200);
  }, [variant, onDone]);

  if (!fileUrl) {
    return (
      <div className="mt-5">
        <label
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50/40 px-4 py-10 text-center transition hover:border-emerald-500 hover:bg-emerald-50"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-sm">
            <Upload className="h-5 w-5" />
          </div>
          <div className="text-sm font-semibold text-slate-900">
            Clique ou arraste sua fatura aqui
          </div>
          <div className="text-xs text-slate-500">{STRINGS.steps.uploadHint}</div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*,application/pdf"
            className="hidden"
            onChange={onPick}
          />
        </label>
      </div>
    );
  }

  return (
    <div className="mt-5 space-y-3 animate-fade-in">
      <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
        <div className="flex min-w-0 items-center gap-2">
          <FileText className="h-4 w-4 shrink-0 text-emerald-600" />
          <span className="truncate text-xs font-medium text-slate-700">{fileName}</span>
        </div>
        <button
          onClick={() => {
            setFileUrl(null);
            if (inputRef.current) inputRef.current.value = "";
          }}
          className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-emerald-700"
        >
          <RefreshCw className="h-3 w-3" /> {STRINGS.steps.uploadChange}
        </button>
      </div>

      <p className="text-xs text-slate-600">{STRINGS.steps.uploadSelectArea}</p>

      <CropArea fileUrl={fileUrl} isPdf={isPdf} rect={rect} setRect={setRect} reading={reading} />

      <button
        onClick={handleRead}
        disabled={reading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-70"
      >
        {reading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> {STRINGS.steps.scanning}
          </>
        ) : (
          <>
            <ScanLine className="h-4 w-4" /> {STRINGS.steps.uploadRead}
          </>
        )}
      </button>
    </div>
  );
}

/* ---------------- Crop area with drag-to-move + corner resize ---------------- */

type DragMode = null | "move" | "nw" | "ne" | "sw" | "se" | "new";

function CropArea({
  fileUrl,
  isPdf,
  rect,
  setRect,
  reading,
}: {
  fileUrl: string;
  isPdf: boolean;
  rect: Rect;
  setRect: (r: Rect) => void;
  reading: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<{
    mode: DragMode;
    startX: number;
    startY: number;
    startRect: Rect;
  }>({ mode: null, startX: 0, startY: 0, startRect: rect });

  const clamp = (v: number, min = 0, max = 1) => Math.max(min, Math.min(max, v));

  const getPos = (e: PointerEvent | React.PointerEvent) => {
    const box = containerRef.current!.getBoundingClientRect();
    return {
      x: clamp((e.clientX - box.left) / box.width),
      y: clamp((e.clientY - box.top) / box.height),
    };
  };

  const onPointerDown = (mode: DragMode) => (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    (e.target as Element).setPointerCapture?.(e.pointerId);
    const p = getPos(e);
    stateRef.current = { mode, startX: p.x, startY: p.y, startRect: rect };
    if (mode === "new") {
      setRect({ x: p.x, y: p.y, w: 0.001, h: 0.001 });
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const s = stateRef.current;
    if (!s.mode) return;
    const p = getPos(e);
    const dx = p.x - s.startX;
    const dy = p.y - s.startY;
    let { x, y, w, h } = s.startRect;

    if (s.mode === "move") {
      x = clamp(x + dx, 0, 1 - w);
      y = clamp(y + dy, 0, 1 - h);
    } else if (s.mode === "new") {
      const nx = Math.min(s.startX, p.x);
      const ny = Math.min(s.startY, p.y);
      const nw = Math.abs(p.x - s.startX);
      const nh = Math.abs(p.y - s.startY);
      x = nx;
      y = ny;
      w = Math.max(0.03, nw);
      h = Math.max(0.03, nh);
    } else {
      // corner resize
      let x2 = x + w;
      let y2 = y + h;
      if (s.mode.includes("w")) x = clamp(x + dx, 0, x2 - 0.03);
      if (s.mode.includes("n")) y = clamp(y + dy, 0, y2 - 0.03);
      if (s.mode.includes("e")) x2 = clamp(x2 + dx, x + 0.03, 1);
      if (s.mode.includes("s")) y2 = clamp(y2 + dy, y + 0.03, 1);
      w = x2 - x;
      h = y2 - y;
    }
    setRect({ x, y, w, h });
  };

  const onPointerUp = () => {
    stateRef.current.mode = null;
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={onPointerDown("new")}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      className="relative w-full select-none overflow-hidden rounded-xl border border-slate-200 bg-slate-100 touch-none"
      style={{ aspectRatio: "3 / 4" }}
    >
      {isPdf ? (
        <object data={fileUrl} type="application/pdf" className="h-full w-full pointer-events-none">
          <div className="flex h-full w-full items-center justify-center p-4 text-center text-xs text-slate-500">
            Pré-visualização do PDF indisponível. Você pode mesmo assim ajustar a área e ler.
          </div>
        </object>
      ) : (
        <img
          src={fileUrl}
          alt="Pré-visualização da fatura"
          draggable={false}
          className="pointer-events-none h-full w-full object-contain"
        />
      )}

      {/* Dim overlay outside selection using box-shadow trick */}
      <div
        className="pointer-events-none absolute"
        style={{
          left: `${rect.x * 100}%`,
          top: `${rect.y * 100}%`,
          width: `${rect.w * 100}%`,
          height: `${rect.h * 100}%`,
          boxShadow: "0 0 0 9999px rgba(15, 23, 42, 0.55)",
        }}
      />

      {/* Selection rectangle (interactive) */}
      <div
        onPointerDown={onPointerDown("move")}
        className="absolute cursor-move rounded-sm border-2 border-emerald-400 shadow-[0_0_0_1px_rgba(16,185,129,0.4)]"
        style={{
          left: `${rect.x * 100}%`,
          top: `${rect.y * 100}%`,
          width: `${rect.w * 100}%`,
          height: `${rect.h * 100}%`,
        }}
      >
        {(["nw", "ne", "sw", "se"] as const).map((corner) => (
          <span
            key={corner}
            onPointerDown={onPointerDown(corner)}
            className={`absolute h-4 w-4 rounded-full border-2 border-white bg-emerald-500 shadow ${
              corner === "nw"
                ? "-left-2 -top-2 cursor-nwse-resize"
                : corner === "ne"
                  ? "-right-2 -top-2 cursor-nesw-resize"
                  : corner === "sw"
                    ? "-left-2 -bottom-2 cursor-nesw-resize"
                    : "-right-2 -bottom-2 cursor-nwse-resize"
            }`}
          />
        ))}

        {reading && (
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-sm">
            <div className="reader-laser absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-300 to-transparent shadow-[0_0_18px_4px_rgba(16,185,129,0.85)]" />
          </div>
        )}
      </div>

      <style>{`
        .reader-laser { animation: readerLaser 1.4s ease-in-out infinite; }
        @keyframes readerLaser {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { top: 100%; opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}
