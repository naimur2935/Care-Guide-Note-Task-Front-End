import { useEffect, useState } from 'react';
import { ArrowRight, ArrowUpRight, BookOpen, ChevronRight, FileText, Globe2, Lightbulb, ShieldCheck, UserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api, formatDate } from '../api.js';
import Avatar from '../components/Avatar.jsx';
import { EmptyState, LoadingLine, SectionTitle, StatCard } from '../components/ui.jsx';
import { richTextToText } from '../components/RichTextEditor.jsx';
import { tw } from '../tw.js';

export default function OverviewPage({ user, notify }) {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.all([api('/notes?page=1&limit=4'), api('/posts?page=1&limit=3')])
      .then(([noteResult, postResult]) => {
        if (active) {
          setNotes(noteResult);
          setPosts(postResult);
        }
      })
      .catch((error) => { if (active) notify(error.message, 'error'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <>
      <section className={"[min-height:174px] [padding:25px_29px] [display:flex] [align-items:center] [overflow:hidden] [background:#edf3ee] [border:1px_solid_#e4ebe4] [border-radius:9px] max-[560px]:[min-height:155px] max-[560px]:[padding:19px_16px]"}>
        <div className={"[position:relative] [z-index:1] [&_.eyebrow]:[color:#64816b] [&_h1]:[margin:12px_0_6px] [&_h1]:[color:#2f4536] [&_h1]:[font:400_clamp(27px,_3vw,_36px)/1.2_var(--serif)] [&_h1]:[letter-spacing:-.3px] [&_p]:[margin:0_0_14px] [&_p]:[color:#69786d] [&_p]:[font-size:12px] max-[560px]:[&_h1]:[max-width:100%] max-[560px]:[&_h1]:[font-size:30px] max-[560px]:[&_p]:[font-size:10px] max-[560px]:[&_p]:[line-height:1.5]"}>
          <div className={"[color:#758179] [font-size:10px] [font-weight:650] [letter-spacing:1px] [.welcome-text_&]:[color:#64816b] [.page-heading_&]:[margin-bottom:6px] [.modal-header_&]:[font-size:9px] [.note-editor-heading_&]:mb-[6px] max-[560px]:[.section-title_&]:[font-size:8px]"}><span className={"[width:6px] [height:6px] [display:inline-block] [margin-right:5px] [background:#63906d] [border-radius:50%]"} /> YOUR QUIET CORNER</div>
          <h1>{greeting}, {user.name.split(' ')[0]}</h1>
          <p>What would you like to remember today?</p>
          <button className={"[min-height:40px] [padding:9px_14px] [border:1px_solid_transparent] [border-radius:7px] [display:inline-flex] [align-items:center] [justify-content:center] [gap:8px] [font-size:13px] [font-weight:600] [transition:background_.16s,_border-color_.16s,_color_.16s] [.lookup-form_&]:[min-height:35px] [.lookup-form_&]:[padding:7px_9px] [.lookup-form_&]:[font-size:10px] [color:#315d43] [background:#fff] [border-color:#dae5dc] [&:hover]:[background:#f5f9f5]"} onClick={() => navigate('/notes/new')}>+ New note</button>
        </div>
      </section>
      <div className={"[display:grid] [grid-template-columns:repeat(3,_minmax(0,_1fr))] [gap:12px] [margin:14px_0] max-[560px]:[grid-template-columns:1fr] max-[560px]:[gap:7px] max-[560px]:[margin:10px_0]"}>
        <StatCard icon={FileText} label="YOUR NOTES" value={loading ? '—' : notes.total} detail="Saved in your private space" tint="mint" />
        <StatCard icon={Globe2} label="COMMUNITY POSTS" value={loading ? '—' : posts.total} detail="Shared by the community" tint="lavender" />
        <StatCard icon={user.role === 'admin' ? ShieldCheck : UserRound} label="ACCOUNT" value={user.role === 'admin' ? 'Admin' : 'Private'} detail={user.role === 'admin' ? 'Administrator access' : 'Your notes stay private'} tint="peach" />
      </div>
      <div className={"[display:grid] [grid-template-columns:minmax(0,_1.1fr)_minmax(0,_.9fr)] [gap:13px] max-[1000px]:[grid-template-columns:1fr] max-[560px]:[gap:9px]"}>
        <section className={"[min-width:0] [background:var(--surface)] [border:1px_solid_var(--line)] [border-radius:9px] [min-width:0] [padding:16px] max-[560px]:[padding:13px_11px]"}>
          <SectionTitle eyebrow="YOUR NOTES" title="Recently saved" action={<button className={"[display:inline-flex] [align-items:center] [justify-content:center] [gap:4px] [padding:5px_0] [color:#3e704e] [background:none] [border:0] [font-size:10px] [font-weight:650] [white-space:nowrap] [&:hover:not(:disabled)]:[color:#244b34] [&:disabled]:[opacity:.45] [.lookup-pager_&]:[font-size:9px]"} onClick={() => navigate('/notes')}>See all <ArrowRight size={15} /></button>} />
          {loading ? <LoadingLine /> : notes.data.length ? (
            <div className={"recent-notes"}>
              {notes.data.slice(0, 3).map((note, index) => (
                <button className={"[min-height:55px] [width:100%] [display:flex] [align-items:center] [gap:9px] [padding:8px_0] [border:0] [border-top:1px_solid_#eff2ef] [background:transparent] [text-align:left]"} key={note._id} onClick={() => navigate('/notes')}>
                  <span className={tw('note-marker', index === 1 && 'marker-1', index === 2 && 'marker-2')}><FileText size={17} /></span>
                  <span className={"[min-width:0] [flex:1] [display:grid] [gap:3px] [&_strong]:[overflow:hidden] [&_strong]:[text-overflow:ellipsis] [&_strong]:[white-space:nowrap] [&_small]:[overflow:hidden] [&_small]:[text-overflow:ellipsis] [&_small]:[white-space:nowrap] [&_strong]:[color:#46534a] [&_strong]:[font-size:11px] [&_small]:[color:#89938b] [&_small]:[font-size:9px]"}><strong>{note.title}</strong><small>{richTextToText(note.content) || 'No note content'}</small></span>
                  <span className={"[color:#929c94] [font-size:9px] [white-space:nowrap] max-[560px]:[display:none]"}>{formatDate(note.createdAt)}</span>
                  <ChevronRight className={"[flex:0_0_auto] [color:#97a198]"} size={17} />
                </button>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={BookOpen}
              title="No notes yet"
              text="Write down a thought, a plan, or a reminder."
              action={<button className={"[display:inline-flex] [align-items:center] [justify-content:center] [gap:4px] [padding:5px_0] [color:#3e704e] [background:none] [border:0] [font-size:10px] [font-weight:650] [white-space:nowrap] [&:hover:not(:disabled)]:[color:#244b34] [&:disabled]:[opacity:.45] [.lookup-pager_&]:[font-size:9px]"} onClick={() => navigate('/notes')}>Create a note <ArrowRight size={15} /></button>}
            />
          )}
        </section>
        <section className={"[min-width:0] [background:var(--surface)] [border:1px_solid_var(--line)] [border-radius:9px] [min-width:0] [padding:16px] max-[560px]:[padding:13px_11px]"}>
          <SectionTitle eyebrow="PUBLIC POSTS" title="From the community" action={<button className={"[display:inline-flex] [align-items:center] [justify-content:center] [gap:4px] [padding:5px_0] [color:#3e704e] [background:none] [border:0] [font-size:10px] [font-weight:650] [white-space:nowrap] [&:hover:not(:disabled)]:[color:#244b34] [&:disabled]:[opacity:.45] [.lookup-pager_&]:[font-size:9px]"} onClick={() => navigate('/community')}>Explore <ArrowRight size={15} /></button>} />
          {loading ? <LoadingLine /> : posts.data.length ? (
            <div className={"mini-posts"}>
              {posts.data.map((post) => (
                <article className={"[padding:10px_0] [border-top:1px_solid_#eff2ef] [&_h3]:[margin:7px_0_3px] [&_h3]:[color:#46534a] [&_h3]:[font:16px/1.3_var(--serif)] [&_p]:[display:-webkit-box] [&_p]:[margin:0] [&_p]:[overflow:hidden] [&_p]:[color:#79857c] [&_p]:[font-size:10px] [&_p]:[line-height:1.55] [&_p]:[-webkit-box-orient:vertical] [&_p]:[-webkit-line-clamp:2]"} key={post._id}>
                  <div className={"[display:flex] [align-items:center] [gap:6px] [color:#879189] [font-size:9px]"}><Avatar name={post.userId?.name || 'Member'} small /><span>{post.userId?.name || 'A member'}</span><span>·</span><span>{formatDate(post.createdAt)}</span></div>
                  <h3>{post.title}</h3><p>{richTextToText(post.body) || 'A thought shared with the community.'}</p>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Globe2}
              title="No posts yet"
              text="Be the first to share something with everyone."
              action={<button className={"[display:inline-flex] [align-items:center] [justify-content:center] [gap:4px] [padding:5px_0] [color:#3e704e] [background:none] [border:0] [font-size:10px] [font-weight:650] [white-space:nowrap] [&:hover:not(:disabled)]:[color:#244b34] [&:disabled]:[opacity:.45] [.lookup-pager_&]:[font-size:9px]"} onClick={() => navigate('/community')}>Visit community <ArrowRight size={15} /></button>}
            />
          )}
        </section>
      </div>
      <div className={"[margin-top:13px] [padding:10px_12px] [display:flex] [align-items:center] [gap:9px] [background:#f2f3ed] [border-radius:7px] [&_>_span]:[width:27px] [&_>_span]:[height:27px] [&_>_span]:[flex:0_0_auto] [&_>_span]:[display:inline-flex] [&_>_span]:[align-items:center] [&_>_span]:[justify-content:center] [&_>_span]:[color:#68744f] [&_>_span]:[background:#e7eadd] [&_>_span]:[border-radius:6px] [&_>_div]:[min-width:0] [&_>_div]:[flex:1] [&_strong]:[color:#56604b] [&_strong]:[font-size:10px] [&_p]:[margin:3px_0_0] [&_p]:[color:#788071] [&_p]:[font-size:9px] [&_p]:[line-height:1.45] max-[560px]:[padding:9px] max-[560px]:[gap:7px] max-[560px]:[&_p]:[font-size:8px]"}>
        <span><Lightbulb size={17} /></span>
        <div><strong>Need to remember something?</strong><p>Your notes are private and only visible to you.</p></div>
        <button className={"[width:36px] [height:36px] [flex:0_0_auto] [display:inline-flex] [align-items:center] [justify-content:center] [color:#738078] [background:transparent] [border:0] [border-radius:7px] [&:hover:not(:disabled)]:[color:#315d43] [&:hover:not(:disabled)]:[background:#f0f4f0] [&.danger-hover:hover]:[color:#a64e43] [&.danger-hover:hover]:[background:#fff0ee] [.pagination_&]:[border:1px_solid_#e5e9e5] max-[560px]:[.admin-row-actions_&]:[width:29px] max-[560px]:[.admin-row-actions_&]:[height:29px] max-[360px]:[.admin-row-actions_&]:[width:26px]"} onClick={() => navigate('/notes/new')} aria-label="Create a note"><ArrowUpRight size={19} /></button>
      </div>
    </>
  );
}
