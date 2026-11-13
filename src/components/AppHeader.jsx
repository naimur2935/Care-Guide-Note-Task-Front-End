import { ChevronRight, LogOut } from 'lucide-react';
import Avatar from './Avatar.jsx';
import { useLocation } from 'react-router-dom';

const pageTitles = {
  '/overview': 'Overview',
  '/notes': 'My notes',
  '/community': 'Community',
  '/interests': 'Interests',
  '/admin': 'Admin tools',
};

export default function AppHeader({ user, onSignOut }) {
  const { pathname } = useLocation();

  return (
    <header className={"[height:60px] [flex:0_0_auto] [display:flex] [justify-content:space-between] [align-items:center] [border-bottom:1px_solid_var(--line)] max-[760px]:[height:54px]"}>
      <div className={"[display:flex] [align-items:center] [gap:7px] [color:#879189] [font-size:11px] [&_strong]:[color:#46534a] [&_strong]:[font-weight:600] max-[560px]:[gap:4px] max-[560px]:[font-size:9px]"}>
        <span>Your space</span>
        <ChevronRight size={14} />
        <strong>{pageTitles[pathname] || (pathname.startsWith('/notes/') ? 'My notes' : 'Overview')}</strong>
      </div>
      <div className={"[display:flex] [align-items:center] [gap:9px] max-[560px]:[gap:3px]"}>
        <span className={"[padding:6px_9px] [color:#717d74] [background:#fff] [border:1px_solid_var(--line)] [border-radius:5px] [font-size:10px] max-[760px]:[display:none]"}>
          {new Intl.DateTimeFormat(undefined, { weekday: 'short', month: 'short', day: 'numeric' }).format(new Date())}
        </span>
        <Avatar name={user.name} small />
        <button className={"[width:36px] [height:36px] [flex:0_0_auto] [display:inline-flex] [align-items:center] [justify-content:center] [color:#738078] [background:transparent] [border:0] [border-radius:7px] [&:hover:not(:disabled)]:[color:#315d43] [&:hover:not(:disabled)]:[background:#f0f4f0] [&.danger-hover:hover]:[color:#a64e43] [&.danger-hover:hover]:[background:#fff0ee] [.pagination_&]:[border:1px_solid_#e5e9e5] max-[560px]:[.admin-row-actions_&]:[width:29px] max-[560px]:[.admin-row-actions_&]:[height:29px] max-[360px]:[.admin-row-actions_&]:[width:26px] [display:none] max-[760px]:[display:inline-flex] max-[760px]:[width:32px] max-[760px]:[height:32px]"} onClick={onSignOut} title="Sign out" aria-label="Sign out">
          <LogOut size={17} />
        </button>
      </div>
    </header>
  );
}
