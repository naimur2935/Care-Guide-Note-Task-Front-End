import AppHeader from './AppHeader.jsx';
import AppSidebar from './AppSidebar.jsx';
import { Outlet } from 'react-router-dom';

export default function DashboardLayout({ user, onSignOut }) {
  return (
    <div className={"[min-height:100vh] [display:grid] [grid-template-columns:224px_minmax(0,_1fr)] [background:#f7f8f6] max-[1000px]:[grid-template-columns:200px_minmax(0,_1fr)] max-[760px]:[display:block] max-[760px]:[padding-bottom:calc(60px_+_env(safe-area-inset-bottom))] max-[560px]:[padding-bottom:calc(58px_+_env(safe-area-inset-bottom))]"}>
      <AppSidebar user={user} onSignOut={onSignOut} />
      <main className={"[min-width:0] [min-height:100vh] [padding:0_clamp(20px,_4vw,_58px)] [display:flex] [flex-direction:column] max-[1000px]:[padding-right:24px] max-[1000px]:[padding-left:24px] max-[760px]:[min-height:calc(100vh_-_60px)] max-[760px]:[padding:0_19px] max-[560px]:[min-height:calc(100vh_-_58px)] max-[560px]:[padding:0_14px] max-[360px]:[padding-right:10px] max-[360px]:[padding-left:10px]"}>
        <AppHeader user={user} onSignOut={onSignOut} />
        <div className={"[width:min(100%,_1080px)] [margin:0_auto] [padding:30px_0_42px] [flex:1] min-[1500px]:[padding-top:40px] max-[760px]:[padding:23px_0_30px] max-[560px]:[padding:19px_0_25px]"}><Outlet /></div>
      </main>
    </div>
  );
}
