// DocumentInsightsPanel.tsx
// Three-tab Cloudinary showcase component embedded after each document upload:
//   1. Before/After — drag-to-compare original vs full AI pipeline
//   2. Pipeline     — four-stage enhancement strip with full-size preview
//   3. Quality      — score derived from upload metadata + actionable notes

import { useRef, useState } from 'react';
import type { CloudinaryUploadResult } from './UploadWidget';

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string;

// ── URL helper ────────────────────────────────────────────────────────────────

function cldUrl(publicId: string, transforms: string, w = 600): string {
  return (
    `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/` +
    `${transforms},w_${w},q_auto,f_jpg/${publicId}`
  );
}

// ── Enhancement stages ────────────────────────────────────────────────────────

const STAGES = [
  {
    label:      'Original',
    icon:       'photo_library',
    desc:       'Raw upload — no processing',
    transforms: 'c_fill',
  },
  {
    label:      'Exposure',
    icon:       'light_mode',
    desc:       'Auto brightness & contrast',
    transforms: 'c_fill,e_improve',
  },
  {
    label:      'Sharpen',
    icon:       'center_focus_strong',
    desc:       'Edge sharpening applied',
    transforms: 'c_fill,e_improve,e_sharpen:70',
  },
  {
    label:      'Full AI',
    icon:       'auto_fix_high',
    desc:       'Complete Cloudinary pipeline',
    transforms: 'c_fill,e_improve,e_sharpen:70,e_auto_contrast',
  },
] as const;

// ── Quality scoring ───────────────────────────────────────────────────────────

function getQuality(p: CloudinaryUploadResult) {
  let score = 100;
  const notes: string[] = [];

  const mp = (p.width * p.height) / 1_000_000;
  if (mp < 0.5)       { score -= 30; notes.push('Very low resolution — document may be rejected'); }
  else if (mp < 1.2)  { score -= 10; notes.push('Below recommended resolution (1 MP minimum)'); }

  const kb = p.bytes / 1024;
  if (kb < 30) { score -= 20; notes.push('File size unusually small — may indicate degraded quality'); }

  if (!['jpg', 'jpeg', 'png', 'webp', 'heif', 'heic'].includes(p.format.toLowerCase())) {
    score -= 10;
    notes.push('Unusual format — JPEG or PNG is preferred for government submission');
  }

  const s = Math.max(0, Math.min(100, score));
  return {
    score: s,
    label: s >= 80 ? 'Good' : s >= 55 ? 'Fair' : 'Poor',
    color: s >= 80 ? '#16a34a' : s >= 55 ? '#d97706' : '#dc2626',
    notes,
  };
}

// ── BeforeAfterSlider ─────────────────────────────────────────────────────────

function BeforeAfterSlider({ publicId }: { publicId: string }) {
  const [pct, setPct] = useState(50);
  const wrapRef   = useRef<HTMLDivElement>(null);
  const dragging  = useRef(false);
  const [origOk, setOrigOk] = useState(false);
  const [enhOk,  setEnhOk]  = useState(false);
  const ready = origOk && enhOk;

  const setFromX = (clientX: number) => {
    const el = wrapRef.current;
    if (!el) return;
    const { left, width } = el.getBoundingClientRect();
    setPct(Math.max(2, Math.min(98, ((clientX - left) / width) * 100)));
  };

  return (
    <div
      ref={wrapRef}
      className="ins-slider"
      onMouseMove={(e) => { if (dragging.current) setFromX(e.clientX); }}
      onMouseUp={() => { dragging.current = false; }}
      onMouseLeave={() => { dragging.current = false; }}
      onTouchMove={(e) => setFromX(e.touches[0].clientX)}
    >
      {!ready && <div className="ins-skeleton" />}

      {/* Back layer: AI-enhanced */}
      <img
        className="ins-slider__img"
        src={cldUrl(publicId, STAGES[3].transforms)}
        alt="Cloudinary enhanced"
        draggable={false}
        onLoad={() => setEnhOk(true)}
        style={{ opacity: ready ? 1 : 0 }}
      />

      {/* Front layer: original, clipped by slider position */}
      <img
        className="ins-slider__img ins-slider__img--front"
        src={cldUrl(publicId, STAGES[0].transforms)}
        alt="Original upload"
        draggable={false}
        onLoad={() => setOrigOk(true)}
        style={{ clipPath: `inset(0 ${100 - pct}% 0 0)`, opacity: ready ? 1 : 0 }}
      />

      {/* Divider handle */}
      <div
        className="ins-slider__divider"
        style={{ left: `${pct}%` }}
        onMouseDown={() => { dragging.current = true; }}
        onTouchStart={(e) => { e.preventDefault(); setFromX(e.touches[0].clientX); }}
      >
        <div className="ins-slider__knob">
          <span className="material-symbols-outlined">chevron_left</span>
          <span className="material-symbols-outlined">chevron_right</span>
        </div>
      </div>

      {ready && (
        <>
          <span className="ins-slider__label ins-slider__label--l">Original</span>
          <span className="ins-slider__label ins-slider__label--r">
            <span className="material-symbols-outlined" style={{ fontSize: '0.8rem' }}>
              auto_fix_high
            </span>
            {' '}Enhanced
          </span>
        </>
      )}
    </div>
  );
}

// ── Enhancement Pipeline ──────────────────────────────────────────────────────

function EnhancementPipeline({ publicId }: { publicId: string }) {
  const [active, setActive] = useState(3);

  return (
    <div className="ins-pipeline">
      {/* Stage selector strip */}
      <div className="ins-pipeline__strip">
        {STAGES.map((stage, i) => (
          <button
            key={stage.label}
            type="button"
            className={`ins-pipeline__step${active === i ? ' is-active' : ''}`}
            onClick={() => setActive(i)}
            title={stage.desc}
          >
            <div className="ins-pipeline__thumb-wrap">
              <img
                src={cldUrl(publicId, stage.transforms, 160)}
                alt={stage.label}
                loading="lazy"
              />
            </div>
            <span className="material-symbols-outlined">{stage.icon}</span>
            <strong>{stage.label}</strong>
            {i < STAGES.length - 1 && (
              <span className="ins-pipeline__arrow" aria-hidden="true">›</span>
            )}
          </button>
        ))}
      </div>

      {/* Full-size preview */}
      <div className="ins-pipeline__main">
        <img
          key={active}
          className="ins-pipeline__full"
          src={cldUrl(publicId, STAGES[active].transforms, 520)}
          alt={`${STAGES[active].label} preview`}
        />
        <div className="ins-pipeline__caption">
          <span className="material-symbols-outlined">{STAGES[active].icon}</span>
          <strong>{STAGES[active].label}</strong>
          <span>·</span>
          <span>{STAGES[active].desc}</span>
        </div>
      </div>
    </div>
  );
}

// ── Quality Tab ───────────────────────────────────────────────────────────────

function QualityTab({ photo, q }: { photo: CloudinaryUploadResult; q: ReturnType<typeof getQuality> }) {
  const stats = [
    { icon: 'aspect_ratio', label: 'Resolution', value: `${photo.width} × ${photo.height}` },
    { icon: 'sd_storage',   label: 'File Size',  value: `${Math.round(photo.bytes / 1024)} KB` },
    { icon: 'image',        label: 'Format',     value: photo.format.toUpperCase() },
    {
      icon:  q.score >= 80 ? 'verified' : q.score >= 55 ? 'warning' : 'error',
      label: 'Assessment',
      value: q.label,
      color: q.color,
    },
  ];

  return (
    <div className="ins-quality">
      {/* Score bar */}
      <div className="ins-quality__score">
        <div className="ins-quality__score-top">
          <span>Document Quality Score</span>
          <strong style={{ color: q.color }}>{q.score} / 100 — {q.label}</strong>
        </div>
        <div className="ins-quality__bar-bg">
          <div
            className="ins-quality__bar-fill"
            style={{ width: `${q.score}%`, background: q.color }}
          />
        </div>
      </div>

      {/* Stats grid */}
      <div className="ins-quality__stats">
        {stats.map((s) => (
          <div key={s.label} className="ins-quality__stat">
            <span
              className="material-symbols-outlined"
              style={s.color ? { color: s.color } : undefined}
            >
              {s.icon}
            </span>
            <strong style={s.color ? { color: s.color } : undefined}>{s.value}</strong>
            <span>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Notes or all-clear */}
      {q.notes.length > 0 ? (
        <ul className="ins-quality__notes">
          {q.notes.map((n) => (
            <li key={n}>
              <span className="material-symbols-outlined">warning</span>
              {n}
            </li>
          ))}
        </ul>
      ) : (
        <div className="ins-quality__ok">
          <span className="material-symbols-outlined">check_circle</span>
          Document meets all quality requirements for government submission.
        </div>
      )}
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

interface DocumentInsightsPanelProps {
  photo: CloudinaryUploadResult;
  label?: string;
}

export function DocumentInsightsPanel({ photo, label = 'Document' }: DocumentInsightsPanelProps) {
  const [tab, setTab] = useState<'compare' | 'pipeline' | 'quality'>('compare');
  const q = getQuality(photo);

  const TABS = [
    { id: 'compare'  as const, icon: 'compare',      label: 'Before / After' },
    { id: 'pipeline' as const, icon: 'account_tree', label: 'Pipeline'       },
    { id: 'quality'  as const, icon: 'analytics',    label: 'Quality'        },
  ];

  return (
    <div className="ins-panel">
      {/* Header */}
      <div className="ins-panel__head">
        <span className="material-symbols-outlined ins-panel__hicon">auto_fix_high</span>
        <div className="ins-panel__htitle">
          <strong>Cloudinary Document Intelligence</strong>
          <span>
            {label} · {photo.width}×{photo.height} · {Math.round(photo.bytes / 1024)} KB
            {' · '}{photo.format.toUpperCase()}
          </span>
        </div>
        <span
          className="ins-panel__qchip"
          style={{ color: q.color, borderColor: q.color }}
        >
          {q.label}
        </span>
      </div>

      {/* Tab bar */}
      <div className="ins-panel__tabs" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            className={tab === t.id ? 'is-active' : ''}
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
          >
            <span className="material-symbols-outlined">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab body */}
      <div className="ins-panel__body">
        {tab === 'compare' && (
          <>
            <p className="ins-hint">
              Drag the handle left and right to compare your original upload against
              Cloudinary's full AI enhancement pipeline.
            </p>
            <BeforeAfterSlider publicId={photo.public_id} />
          </>
        )}

        {tab === 'pipeline' && (
          <>
            <p className="ins-hint">
              Your document is processed through a multi-stage Cloudinary transformation
              pipeline. Click each stage to preview the effect.
            </p>
            <EnhancementPipeline publicId={photo.public_id} />
          </>
        )}

        {tab === 'quality' && (
          <QualityTab photo={photo} q={q} />
        )}
      </div>
    </div>
  );
}