import { Check, CircleHelp, X } from 'lucide-react';
import { tw } from '../tw.js';

export default function Toast({ notice, onDismiss }) {
  if (!notice) return null;

  return (
    <div className={tw('toast', notice.type === 'error' && 'toast-error')} key={notice.key} role="status">
      {notice.type === 'error' ? <CircleHelp size={18} /> : <Check size={18} />}
      <span>{notice.message}</span>
      <button className={"[width:36px] [height:36px] [flex:0_0_auto] [display:inline-flex] [align-items:center] [justify-content:center] [color:#738078] [background:transparent] [border:0] [border-radius:7px] [&:hover:not(:disabled)]:[color:#315d43] [&:hover:not(:disabled)]:[background:#f0f4f0] [&.danger-hover:hover]:[color:#a64e43] [&.danger-hover:hover]:[background:#fff0ee] [.pagination_&]:[border:1px_solid_#e5e9e5] max-[560px]:[.admin-row-actions_&]:[width:29px] max-[560px]:[.admin-row-actions_&]:[height:29px] max-[360px]:[.admin-row-actions_&]:[width:26px] [width:28px] [height:28px] [margin:-4px_-4px_-4px_auto]"} onClick={onDismiss} aria-label="Dismiss">
        <X size={16} />
      </button>
    </div>
  );
}
