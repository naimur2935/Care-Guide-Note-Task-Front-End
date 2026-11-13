import { useEffect } from 'react';
import { ChevronLeft, ChevronRight, LoaderCircle, MoreHorizontal, Pencil, Trash2, X } from 'lucide-react';
import { formatDate } from '../api.js';
import BrandMark from './BrandMark.jsx';
import Avatar from './Avatar.jsx';
import { RichTextContent } from './RichTextEditor.jsx';
import { tw } from '../tw.js';

export { Avatar, BrandMark };

export function Field({ label, hint, ...props }) {
  return (
    <label className={"[min-width:0] [display:grid] [gap:6px] [color:#455149] [font-size:12px] [font-weight:600] [&_input]:[width:100%] [&_input]:[min-width:0] [&_input]:[padding:10px_11px] [&_input]:[color:var(--ink)] [&_input]:[background:#fff] [&_input]:[border:1px_solid_#dfe5df] [&_input]:[border-radius:6px] [&_input]:[outline:none] [&_input]:[font-size:13px] [&_input]:[font-weight:400] [&_textarea]:[width:100%] [&_textarea]:[min-width:0] [&_textarea]:[padding:10px_11px] [&_textarea]:[color:var(--ink)] [&_textarea]:[background:#fff] [&_textarea]:[border:1px_solid_#dfe5df] [&_textarea]:[border-radius:6px] [&_textarea]:[outline:none] [&_textarea]:[font-size:13px] [&_textarea]:[font-weight:400] [&_select]:[width:100%] [&_select]:[min-width:0] [&_select]:[padding:10px_11px] [&_select]:[color:var(--ink)] [&_select]:[background:#fff] [&_select]:[border:1px_solid_#dfe5df] [&_select]:[border-radius:6px] [&_select]:[outline:none] [&_select]:[font-size:13px] [&_select]:[font-weight:400] [&_textarea]:[resize:vertical] [&_textarea]:[line-height:1.6] [&_input::placeholder]:[color:#a2aaa4] [&_textarea::placeholder]:[color:#a2aaa4] [&_input:focus]:[border-color:#7da389] [&_input:focus]:[box-shadow:0_0_0_3px_#58836317] [&_textarea:focus]:[border-color:#7da389] [&_textarea:focus]:[box-shadow:0_0_0_3px_#58836317] [&_select:focus]:[border-color:#7da389] [&_select:focus]:[box-shadow:0_0_0_3px_#58836317] [&_small]:[color:var(--soft)] [&_small]:[font-size:10px] [&_small]:[font-weight:400] [&_small]:[line-height:1.5]"}>
      <span>{label}</span>
      <input {...props} />
      {hint && <small>{hint}</small>}
    </label>
  );
}

export function PageHeading({ eyebrow, title, description, action }) {
  return (
    <div className={"[display:flex] [align-items:end] [justify-content:space-between] [gap:16px] [margin:3px_0_20px] [&_.eyebrow]:[margin-bottom:6px] [&_h1]:[margin:0] [&_h1]:[color:#2d3b32] [&_h1]:[font:32px/1.2_var(--serif)] [&_h1]:[letter-spacing:-.3px] [&_p]:[margin:6px_0_0] [&_p]:[color:#758078] [&_p]:[font-size:11px] [&_p]:[line-height:1.55] max-[560px]:[align-items:flex-start] max-[560px]:[flex-direction:column] max-[560px]:[gap:11px] max-[560px]:[margin:2px_0_16px] max-[560px]:[&_h1]:[font-size:28px] max-[560px]:[&_p]:[font-size:10px]"}>
      <div>
        <div className={"[color:#758179] [font-size:10px] [font-weight:650] [letter-spacing:1px] [.welcome-text_&]:[color:#64816b] [.page-heading_&]:[margin-bottom:6px] [.modal-header_&]:[font-size:9px] [.note-editor-heading_&]:mb-[6px] max-[560px]:[.section-title_&]:[font-size:8px]"}>{eyebrow}</div>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatCard({ icon: Icon, label, value, detail, tint }) {
  return (
    <div className={"[min-width:0] [min-height:78px] [display:flex] [align-items:center] [gap:11px] [padding:13px] [background:#fff] [border:1px_solid_var(--line)] [border-radius:8px] [&_>_div]:[min-width:0] [&_>_div]:[display:grid] [&_>_div]:[gap:2px] max-[560px]:[min-height:63px] max-[560px]:[padding:9px_11px]"}>
      <span className={tw('stat-icon', `tint-${tint}`)}><Icon size={19} /></span>
      <div>
        <span className={"[color:#879189] [font-size:8px] [font-weight:650] [letter-spacing:.7px]"}>{label}</span>
        <strong className={"[color:#354239] [font:20px/1.2_var(--serif)] max-[560px]:[font-size:18px]"}>{value}</strong>
        <span className={"[overflow:hidden] [color:#8a948c] [font-size:9px] [text-overflow:ellipsis] [white-space:nowrap]"}>{detail}</span>
      </div>
    </div>
  );
}

export function SectionTitle({ eyebrow, title, action }) {
  return (
    <div className={"[display:flex] [align-items:center] [justify-content:space-between] [gap:10px] [margin-bottom:11px] [&_h2]:[margin:4px_0_0] [&_h2]:[color:#344239] [&_h2]:[font:19px/1.3_var(--serif)] max-[560px]:[&_h2]:[font-size:17px] max-[560px]:[&_.eyebrow]:[font-size:8px]"}>
      <div><div className={"[color:#758179] [font-size:10px] [font-weight:650] [letter-spacing:1px] [.welcome-text_&]:[color:#64816b] [.page-heading_&]:[margin-bottom:6px] [.modal-header_&]:[font-size:9px] [.note-editor-heading_&]:mb-[6px] max-[560px]:[.section-title_&]:[font-size:8px]"}>{eyebrow}</div><h2>{title}</h2></div>
      {action}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, text, action }) {
  return (
    <div className={"[min-height:138px] [padding:20px] [display:flex] [flex-direction:column] [align-items:center] [justify-content:center] [text-align:center] [&_>_strong]:[color:#425047] [&_>_strong]:[font:17px_var(--serif)] [&_>_p]:[max-width:300px] [&_>_p]:[margin:5px_0_10px] [&_>_p]:[color:#7e8981] [&_>_p]:[font-size:10px] [&_>_p]:[line-height:1.55]"}>
      <span className={"[width:36px] [height:36px] [margin-bottom:9px] [display:inline-flex] [align-items:center] [justify-content:center] [color:#54745a] [background:#edf3ed] [border-radius:8px]"}><Icon size={22} /></span>
      <strong>{title}</strong>
      <p>{text}</p>
      {action}
    </div>
  );
}

export function LoadingLine() {
  return (
    <div className={"[min-height:120px] [display:flex] [justify-content:center] [align-items:center] [gap:8px] [color:#78857b] [font-size:11px]"}>
      <LoaderCircle className={"animate-spin"} size={20} />
      Loading your space…
    </div>
  );
}

export function Pagination({ page, totalPages, onPage }) {
  if (totalPages <= 1) return null;
  return (
    <div className={"[min-height:44px] [display:flex] [justify-content:space-between] [align-items:center] [border-top:1px_solid_#edf0ed] [color:#77827a] [font-size:10px] [&_strong]:[color:#3f4e44] [&_>_div]:[display:flex] [&_>_div]:[gap:3px] [&_.icon-button]:[border:1px_solid_#e5e9e5]"}>
      <span>Page <strong>{page}</strong> of {totalPages}</span>
      <div>
        <button className={"[width:36px] [height:36px] [flex:0_0_auto] [display:inline-flex] [align-items:center] [justify-content:center] [color:#738078] [background:transparent] [border:0] [border-radius:7px] [&:hover:not(:disabled)]:[color:#315d43] [&:hover:not(:disabled)]:[background:#f0f4f0] [&.danger-hover:hover]:[color:#a64e43] [&.danger-hover:hover]:[background:#fff0ee] [.pagination_&]:[border:1px_solid_#e5e9e5] max-[560px]:[.admin-row-actions_&]:[width:29px] max-[560px]:[.admin-row-actions_&]:[height:29px] max-[360px]:[.admin-row-actions_&]:[width:26px]"} disabled={page <= 1} onClick={() => onPage(page - 1)} aria-label="Previous page">
          <ChevronLeft size={18} />
        </button>
        <button className={"[width:36px] [height:36px] [flex:0_0_auto] [display:inline-flex] [align-items:center] [justify-content:center] [color:#738078] [background:transparent] [border:0] [border-radius:7px] [&:hover:not(:disabled)]:[color:#315d43] [&:hover:not(:disabled)]:[background:#f0f4f0] [&.danger-hover:hover]:[color:#a64e43] [&.danger-hover:hover]:[background:#fff0ee] [.pagination_&]:[border:1px_solid_#e5e9e5] max-[560px]:[.admin-row-actions_&]:[width:29px] max-[560px]:[.admin-row-actions_&]:[height:29px] max-[360px]:[.admin-row-actions_&]:[width:26px]"} disabled={page >= totalPages} onClick={() => onPage(page + 1)} aria-label="Next page">
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

export function Modal({ title, subtitle, onClose, children }) {
  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <div className={"[position:fixed] [inset:0] [z-index:10] [padding:18px] [display:flex] [align-items:center] [justify-content:center] [background:#18251e80] max-[560px]:[padding:10px]"} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className={"[width:min(100%,_500px)] [max-height:min(90vh,_720px)] [overflow:auto] [padding:22px] [background:#fff] [border:1px_solid_var(--line)] [border-radius:10px] [box-shadow:0_14px_45px_#17291f2c] max-[560px]:[max-height:calc(100dvh_-_20px)] max-[560px]:[padding:17px_14px] max-[560px]:[border-radius:8px]"} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className={"[display:flex] [align-items:flex-start] [justify-content:space-between] [gap:12px] [margin-bottom:18px] [&_.eyebrow]:[font-size:9px] [&_h2]:[margin:5px_0] [&_h2]:[color:#2f3d33] [&_h2]:[font:24px_var(--serif)] [&_p]:[margin:0] [&_p]:[color:#7a857d] [&_p]:[font-size:10px] [&_p]:[line-height:1.55] max-[560px]:[&_h2]:[font-size:21px]"}>
          <div>
            <span className={"[color:#758179] [font-size:10px] [font-weight:650] [letter-spacing:1px] [.welcome-text_&]:[color:#64816b] [.page-heading_&]:[margin-bottom:6px] [.modal-header_&]:[font-size:9px] [.note-editor-heading_&]:mb-[6px] max-[560px]:[.section-title_&]:[font-size:8px]"}>A MOMENT FOR YOU</span>
            <h2 id="modal-title">{title}</h2>
            <p>{subtitle}</p>
          </div>
          <button className={"[width:36px] [height:36px] [flex:0_0_auto] [display:inline-flex] [align-items:center] [justify-content:center] [color:#738078] [background:transparent] [border:0] [border-radius:7px] [&:hover:not(:disabled)]:[color:#315d43] [&:hover:not(:disabled)]:[background:#f0f4f0] [&.danger-hover:hover]:[color:#a64e43] [&.danger-hover:hover]:[background:#fff0ee] [.pagination_&]:[border:1px_solid_#e5e9e5] max-[560px]:[.admin-row-actions_&]:[width:29px] max-[560px]:[.admin-row-actions_&]:[height:29px] max-[360px]:[.admin-row-actions_&]:[width:26px]"} onClick={onClose} aria-label="Close dialog"><X size={19} /></button>
        </div>
        {children}
      </section>
    </div>
  );
}

export function NoteCard({ note, onEdit, onDelete }) {
  return (
    <article className={tw('note-card')}>
      <div className={"[display:flex] [align-items:center] [justify-content:space-between]"}>
        <span className={"[display:flex] [align-items:center] [gap:6px] [color:#879189] [font-size:9px]"}><span className={"[width:6px] [height:6px] [background:#709277] [border-radius:50%]"} />{formatDate(note.createdAt)}</span>
        <div className={"[display:flex] [gap:1px] max-[560px]:[opacity:1]"}>
          <button className={"[width:36px] [height:36px] [flex:0_0_auto] [display:inline-flex] [align-items:center] [justify-content:center] [color:#738078] [background:transparent] [border:0] [border-radius:7px] [&:hover:not(:disabled)]:[color:#315d43] [&:hover:not(:disabled)]:[background:#f0f4f0] [&.danger-hover:hover]:[color:#a64e43] [&.danger-hover:hover]:[background:#fff0ee] [.pagination_&]:[border:1px_solid_#e5e9e5] max-[560px]:[.admin-row-actions_&]:[width:29px] max-[560px]:[.admin-row-actions_&]:[height:29px] max-[360px]:[.admin-row-actions_&]:[width:26px]"} onClick={onEdit} aria-label={`Edit ${note.title}`} title="Edit"><Pencil size={15} /></button>
          <button className={"[width:36px] [height:36px] [flex:0_0_auto] [display:inline-flex] [align-items:center] [justify-content:center] [color:#738078] [background:transparent] [border:0] [border-radius:7px] [&:hover:not(:disabled)]:[color:#315d43] [&:hover:not(:disabled)]:[background:#f0f4f0] [&.danger-hover:hover]:[color:#a64e43] [&.danger-hover:hover]:[background:#fff0ee] [.pagination_&]:[border:1px_solid_#e5e9e5] max-[560px]:[.admin-row-actions_&]:[width:29px] max-[560px]:[.admin-row-actions_&]:[height:29px] max-[360px]:[.admin-row-actions_&]:[width:26px] [.icon-button&:hover]:[color:#a64e43] [.icon-button&:hover]:[background:#fff0ee]"} onClick={onDelete} aria-label={`Delete ${note.title}`} title="Delete"><Trash2 size={15} /></button>
        </div>
      </div>
      <h3>{note.title}</h3>
      {note.content ? <RichTextContent content={note.content} /> : <p>A small note, with room for more.</p>}
      <div className={"[display:flex] [justify-content:space-between] [align-items:center] [margin-top:auto] [padding-top:10px] [color:#879189] [&_>_span]:[font-size:8px] [&_>_span]:[font-weight:650] [&_>_span]:[letter-spacing:.75px]"}><span>PRIVATE NOTE</span><MoreHorizontal size={17} /></div>
    </article>
  );
}

export function PostCard({ post, currentUser }) {
  const author = post.userId?.name || 'A community member';
  return (
    <article className={"[min-width:0] [background:var(--surface)] [border:1px_solid_var(--line)] [border-radius:9px] [&_.rich-content]:[margin:8px_0] [&_.rich-content]:[color:#68756c] [&_.rich-content]:[font-size:12px] [padding:15px] [&_h2]:[margin:12px_0_5px] [&_h2]:[color:#37473c] [&_h2]:[font:20px/1.3_var(--serif)] [&_h2]:[overflow-wrap:anywhere] [&_>_p]:[margin:0] [&_>_p]:[color:#758078] [&_>_p]:[font-size:11px] [&_>_p]:[line-height:1.7] [&_>_p]:[white-space:pre-wrap] [&_>_p]:[overflow-wrap:anywhere] max-[560px]:[padding:12px] max-[560px]:[&_h2]:[font-size:18px]"}>
      <div className={"[display:flex] [align-items:center] [gap:8px]"}>
        <Avatar name={author} />
        <div className={"[min-width:0] [flex:1] [display:grid] [gap:3px] [&_strong]:[color:#405047] [&_strong]:[font-size:11px] [&_>_span]:[color:#849087] [&_>_span]:[font-size:8px] [&_>_span]:[font-weight:600] [&_>_span]:[letter-spacing:.3px]"}>
          <strong>{author}</strong>
          <span>{author === currentUser.name ? 'YOU' : 'COMMUNITY MEMBER'} · {formatDate(post.createdAt)}</span>
        </div>
      </div>
      <h2>{post.title}</h2>
      {post.body ? <RichTextContent content={post.body} /> : <p>A thought shared with the community.</p>}
      <div className={"[display:flex] [justify-content:space-between] [align-items:center] [margin-top:12px] [padding-top:9px] [color:#8a948c] [border-top:1px_solid_#edf0ed] [&_span]:[display:inline-flex] [&_span]:[align-items:center] [&_span]:[gap:5px] [&_span]:[font-size:9px]"}><span>Shared with everyone</span></div>
    </article>
  );
}
