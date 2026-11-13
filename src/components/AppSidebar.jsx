import { NavLink, Link } from 'react-router-dom';
import { FileText, Globe2, LayoutDashboard, LogOut, ShieldCheck, Tags } from 'lucide-react';
import Avatar from './Avatar.jsx';
import BrandMark from './BrandMark.jsx';
import { tw } from '../tw.js';

const links = [
  { to: '/overview', label: 'Overview', shortLabel: 'Home', icon: LayoutDashboard },
  { to: '/notes', label: 'My notes', shortLabel: 'Notes', icon: FileText },
  { to: '/community', label: 'Community', shortLabel: 'Community', icon: Globe2 },
  { to: '/interests', label: 'Interests', shortLabel: 'Interests', icon: Tags },
];

export default function AppSidebar({ user, onSignOut }) {
  const items = user.role === 'admin'
    ? [...links, { to: '/admin', label: 'Admin tools', shortLabel: 'Admin', icon: ShieldCheck }]
    : links;

  return (
    <aside className={"[position:sticky] [top:0] [height:100vh] [min-height:480px] [padding:22px_13px_13px] [display:flex] [flex-direction:column] [background:#fff] [border-right:1px_solid_var(--line)] [z-index:3] max-[760px]:[position:fixed] max-[760px]:[inset:auto_0_0] max-[760px]:[width:100%] max-[760px]:[height:auto] max-[760px]:[min-height:0] max-[760px]:[padding:5px_5px_max(5px,_env(safe-area-inset-bottom))] max-[760px]:[background:#fff] max-[760px]:[border:0] max-[760px]:[border-top:1px_solid_var(--line)] max-[760px]:[box-shadow:0_-3px_12px_#2033290a]"}>
      <Link className={"[display:flex] [align-items:center] [gap:9px] [padding:0_8px] [color:#2b382f] [background:none] [border:0] [text-align:left] [font-size:15px] [font-weight:700] [&_>_span:last-child]:[display:grid] [&_>_span:last-child]:[gap:3px] [&_small]:[color:#929c94] [&_small]:[font-size:8px] [&_small]:[font-weight:600] [&_small]:[letter-spacing:.9px] max-[760px]:[display:none]"} to="/overview" aria-label="Go to overview">
        <BrandMark />
        <span>Note & Activity Tracker<small>NOTES & ACTIVITY</small></span>
      </Link>
      <div className={"[margin:37px_9px_10px] [color:#929c94] [font-size:9px] [font-weight:650] [letter-spacing:1px] max-[760px]:[display:none]"}>YOUR SPACE</div>
      <nav className={"[display:grid] [gap:3px] [&_ul]:m-0 [&_ul]:list-none [&_ul]:p-0 [&_a]:no-underline max-[760px]:[display:flex] max-[760px]:[justify-content:stretch] max-[760px]:[gap:2px] max-[760px]:[margin:0]"} aria-label="Main navigation">
        {items.map(({ to, label, shortLabel, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end
            className={({ isActive }) => tw('nav-link', isActive && 'active')}
            title={label}
          >
            <Icon size={18} strokeWidth={1.8} />
            <span className={"max-[760px]:[display:none]"}>{label}</span>
            <span className={"[display:none] max-[760px]:[display:block]"}>{shortLabel}</span>
          </NavLink>
        ))}
      </nav>
      <div className={"[margin-top:auto] max-[760px]:[display:none]"}>
        <div className={"[display:flex] [align-items:center] [gap:9px] [padding:12px_3px_2px] [border-top:1px_solid_#edf0ed]"}>
          <Avatar name={user.name} />
          <div className={"[min-width:0] [flex:1] [display:grid] [gap:3px] [&_strong]:[overflow:hidden] [&_strong]:[text-overflow:ellipsis] [&_strong]:[white-space:nowrap] [&_span]:[overflow:hidden] [&_span]:[text-overflow:ellipsis] [&_span]:[white-space:nowrap] [&_strong]:[color:#354239] [&_strong]:[font-size:11px] [&_span]:[color:#8b958e] [&_span]:[font-size:9px]"}>
            <strong>{user.name}</strong>
            <span>{user.role === 'admin' ? 'Administrator' : user.email}</span>
          </div>
          <button className={"[width:36px] [height:36px] [flex:0_0_auto] [display:inline-flex] [align-items:center] [justify-content:center] [color:#738078] [background:transparent] [border:0] [border-radius:7px] [&:hover:not(:disabled)]:[color:#315d43] [&:hover:not(:disabled)]:[background:#f0f4f0] [&.danger-hover:hover]:[color:#a64e43] [&.danger-hover:hover]:[background:#fff0ee] [.pagination_&]:[border:1px_solid_#e5e9e5] max-[560px]:[.admin-row-actions_&]:[width:29px] max-[560px]:[.admin-row-actions_&]:[height:29px] max-[360px]:[.admin-row-actions_&]:[width:26px] profile-menu"} onClick={onSignOut} title="Sign out" aria-label="Sign out">
            <LogOut size={17} />
          </button>
        </div>
      </div>
    </aside>
  );
}
