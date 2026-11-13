const classes = {
  "active": "[.nav-link&]:[color:#315d43] [.nav-link&]:[background:var(--green-soft)] [.nav-link&]:[font-weight:650] [.nav-link&::before]:[position:absolute] [.nav-link&::before]:[top:9px] [.nav-link&::before]:[bottom:9px] [.nav-link&::before]:[left:0] [.nav-link&::before]:[width:2px] [.nav-link&::before]:[border-radius:2px] [.nav-link&::before]:[background:#548064] [.nav-link&::before]:[content:\"\"] [.editor-tool&]:[color:#315d43] [.editor-tool&]:[background:#eaf2eb] max-[760px]:[.nav-link&::before]:[display:none]",
  "avatar": "[width:34px] [height:34px] [flex:0_0_auto] [display:inline-flex] [align-items:center] [justify-content:center] [border-radius:50%] [color:#345b43] [background:#e8efe9] [font-size:11px] [font-weight:700] max-[560px]:[.admin-user-row_>_&]:[width:29px] max-[560px]:[.admin-user-row_>_&]:[height:29px]",
  "avatar-small": "[width:30px] [height:30px] [font-size:10px]",
  "editor-tool": "[width:29px] [height:29px] [display:inline-flex] [align-items:center] [justify-content:center] [color:#627067] [background:transparent] [border:0] [border-radius:5px] [&:hover:not(:disabled)]:[color:#315d43] [&:hover:not(:disabled)]:[background:#eaf2eb] [&.active]:[color:#315d43] [&.active]:[background:#eaf2eb] [&:disabled]:[cursor:not-allowed] [&:disabled]:[opacity:.4]",
  "marker-1": "[color:#716989] [background:#f0eff5]",
  "marker-2": "[color:#917550] [background:#f5f1e9]",
  "nav-link": "[position:relative] [min-height:40px] [display:flex] [align-items:center] [gap:10px] [padding:0_10px] [color:#68746c] [background:transparent] [border:0] [border-radius:6px] [text-align:left] [font-size:12px] [&:hover]:[color:#315d43] [&:hover]:[background:#f6f8f6] [&.active]:[color:#315d43] [&.active]:[background:var(--green-soft)] [&.active]:[font-weight:650] [&.active::before]:[position:absolute] [&.active::before]:[top:9px] [&.active::before]:[bottom:9px] [&.active::before]:[left:0] [&.active::before]:[width:2px] [&.active::before]:[border-radius:2px] [&.active::before]:[background:#548064] [&.active::before]:[content:\"\"] [&_>_span]:[min-width:0] max-[760px]:[min-width:0] max-[760px]:[min-height:48px] max-[760px]:[flex:1] max-[760px]:[flex-direction:column] max-[760px]:[justify-content:center] max-[760px]:[gap:3px] max-[760px]:[padding:3px_2px] max-[760px]:[border-radius:5px] max-[760px]:[font-size:9px] max-[760px]:[&.active::before]:[display:none] max-[760px]:[&_>_span]:[white-space:nowrap] max-[560px]:[min-height:46px] max-[560px]:[font-size:8px] max-[560px]:[&_svg]:[width:17px] max-[560px]:[&_svg]:[height:17px] max-[360px]:[font-size:7px]",
  "note-card": "[min-width:0] [min-height:160px] [padding:12px] [display:flex] [flex-direction:column] [background:#fff] [border:1px_solid_#e6ebe6] [border-radius:7px] [transition:border-color_.15s,_box-shadow_.15s] [&:hover]:[border-color:#cbd9ce] [&:hover]:[box-shadow:0_3px_10px_#253b2d0b] [&_h3]:[margin:10px_0_5px] [&_h3]:[color:#3f4e44] [&_h3]:[font:18px/1.3_var(--serif)] [&_h3]:[overflow-wrap:anywhere] [&_>_p]:[display:-webkit-box] [&_>_p]:[margin:0] [&_>_p]:[overflow:hidden] [&_>_p]:[color:#78847b] [&_>_p]:[font-size:10px] [&_>_p]:[line-height:1.6] [&_>_p]:[white-space:pre-wrap] [&_>_p]:[overflow-wrap:anywhere] [&_>_p]:[-webkit-box-orient:vertical] [&_>_p]:[-webkit-line-clamp:4] [&_.rich-content]:[max-height:100px] [&_.rich-content]:[overflow:hidden] max-[560px]:[min-height:140px]",
  "note-card-1": "[background:#fff]",
  "note-card-2": "[background:#fff]",
  "note-card-3": "[background:#fff]",
  "note-marker": "[width:29px] [height:29px] [flex:0_0_auto] [display:inline-flex] [align-items:center] [justify-content:center] [color:#52775b] [background:#edf4ee] [border-radius:6px]",
  "role-admin": "[color:#526a54] [background:#edf3ed]",
  "role-pill": "[display:inline-flex] [align-items:center] [gap:4px] [padding:4px_7px] [border-radius:12px] [color:#647064] [background:#f2f4f1] [font-size:9px] [text-transform:capitalize] max-[560px]:[padding:4px_6px] max-[560px]:[font-size:8px] max-[560px]:[&_svg]:[display:none] max-[360px]:[padding:3px_5px]",
  "selected": "[.admin-tabs_button&]:[color:#356447] [.admin-tabs_button&]:[border-bottom-color:#4f805e] [.admin-tabs_button&]:[font-weight:650]",
  "stat-icon": "[width:34px] [height:34px] [flex:0_0_auto] [display:inline-flex] [justify-content:center] [align-items:center] [border-radius:7px] max-[560px]:[width:31px] max-[560px]:[height:31px]",
  "tint-lavender": "[color:#6b7086] [background:#f0f1f5]",
  "tint-mint": "[color:#477153] [background:#edf4ee]",
  "tint-peach": "[color:#8d765a] [background:#f5f1e9]",
  "toast": "[position:fixed] [right:18px] [bottom:18px] [z-index:20] [max-width:min(420px,_calc(100vw_-_28px))] [display:flex] [align-items:center] [gap:8px] [padding:10px_11px] [color:#3c6346] [background:#fff] [border:1px_solid_#dfe8df] [border-radius:7px] [box-shadow:0_5px_18px_#253b2d14] [font-size:11px] max-[560px]:[right:10px] max-[560px]:[bottom:calc(65px_+_env(safe-area-inset-bottom))]",
  "toast-error": "[color:#a34a40] [border-color:#f0d9d4]"
};

export function tw(...values) {
  return values
    .flatMap((value) => typeof value === 'string' ? value.split(/\s+/) : [])
    .filter(Boolean)
    .flatMap((name) => classes[name] ? classes[name].split(/\s+/) : [name])
    .join(' ');
}
