import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight, Globe2, Hash, LoaderCircle, Search } from 'lucide-react';
import { api, formatDate } from '../api.js';
import Avatar from '../components/Avatar.jsx';
import { EmptyState, Field, LoadingLine, Modal, PageHeading, Pagination, PostCard } from '../components/ui.jsx';
import RichTextEditor, { richTextToText } from '../components/RichTextEditor.jsx';

export default function CommunityPage({ user, notify }) {
  const [result, setResult] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [postDraft, setPostDraft] = useState(false);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState('');
  const [userPosts, setUserPosts] = useState(null);
  const [userPostPage, setUserPostPage] = useState(1);
  const [lookupBusy, setLookupBusy] = useState(false);
  const editorRef = useRef(null);

  async function loadPosts(pageNumber = page) {
    setLoading(true);
    try { setResult(await api(`/posts?page=${pageNumber}&limit=8`)); }
    catch (error) { notify(error.message, 'error'); }
    finally { setLoading(false); }
  }
  useEffect(() => { loadPosts(page); }, [page]);

  async function publish(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const body = { title: String(data.get('title') || '').trim(), body: editorRef.current?.getHTML() || '' };
    if (richTextToText(body.body).length > 5000) {
      notify('Posts can contain up to 5,000 characters.', 'error');
      return;
    }
    setSaving(true);
    try {
      await api('/posts', { method: 'POST', body });
      setPostDraft(false);
      notify('Post published.');
      if (page !== 1) setPage(1);
      await loadPosts(1);
    } catch (error) { notify(error.message, 'error'); }
    finally { setSaving(false); }
  }

  async function findUserPosts(event) {
    event.preventDefault();
    const id = userId.trim();
    if (!id) { notify('Enter a user ID to find their posts.', 'error'); return; }
    setLookupBusy(true);
    try {
      setUserPosts(await api(`/posts/user/${encodeURIComponent(id)}?page=1&limit=6`));
      setUserPostPage(1);
    } catch (error) { setUserPosts(null); notify(error.message, 'error'); }
    finally { setLookupBusy(false); }
  }

  async function pageUserPosts(nextPage) {
    setLookupBusy(true);
    try {
      setUserPosts(await api(`/posts/user/${encodeURIComponent(userId.trim())}?page=${nextPage}&limit=6`));
      setUserPostPage(nextPage);
    } catch (error) { notify(error.message, 'error'); }
    finally { setLookupBusy(false); }
  }

  return (
    <>
      <PageHeading
        eyebrow="PUBLIC POSTS"
        title="Community"
        description="Read and share posts with everyone."
        action={<button className={"[min-height:40px] [padding:9px_14px] [border:1px_solid_transparent] [border-radius:7px] [display:inline-flex] [align-items:center] [justify-content:center] [gap:8px] [font-size:13px] [font-weight:600] [transition:background_.16s,_border-color_.16s,_color_.16s] [.lookup-form_&]:[min-height:35px] [.lookup-form_&]:[padding:7px_9px] [.lookup-form_&]:[font-size:10px] [background:var(--green)] [color:white] [&:hover:not(:disabled)]:[background:var(--green-dark)]"} onClick={() => setPostDraft(true)}>+ Share a post</button>}
      />
      <section className={"[min-height:68px] [margin-bottom:14px] [padding:12px_14px] [display:flex] [align-items:center] [gap:10px] [background:#edf3ee] [border:1px_solid_#e2ebe3] [border-radius:7px] [&_strong]:[color:#405847] [&_strong]:[font:16px_var(--serif)] [&_p]:[margin:4px_0_0] [&_p]:[color:#728076] [&_p]:[font-size:10px] [&_p]:[line-height:1.5] max-[560px]:[align-items:flex-start] max-[560px]:[padding:10px] max-[560px]:[gap:8px] max-[560px]:[&_strong]:[font-size:14px] max-[560px]:[&_p]:[font-size:9px]"}>
        <span className={"[width:32px] [height:32px] [flex:0_0_auto] [display:inline-flex] [align-items:center] [justify-content:center] [color:#507557] [background:#dfeade] [border-radius:6px]"}><Globe2 size={20} /></span>
        <div><strong>Posts are public</strong><p>Your posts are visible to everyone. Your notes remain private.</p></div>
      </section>
      <div className={"[display:grid] [grid-template-columns:minmax(0,_1fr)_270px] [align-items:start] [gap:12px] max-[1000px]:[grid-template-columns:minmax(0,_1fr)_245px] max-[760px]:[grid-template-columns:1fr]"}>
        <section className={"[min-width:0] [display:grid] [gap:10px]"}>
          {loading ? <div className={"[min-width:0] [background:var(--surface)] [border:1px_solid_var(--line)] [border-radius:9px]"}><LoadingLine /></div> : result?.data.length ? (
            result.data.map((post) => <PostCard key={post._id} post={post} currentUser={user} />)
          ) : (
            <div className={"[min-width:0] [background:var(--surface)] [border:1px_solid_var(--line)] [border-radius:9px]"}>
              <EmptyState
                icon={Globe2}
                title="No posts yet"
                text="Share the first post with your community."
                action={<button className={"[min-height:40px] [padding:9px_14px] [border:1px_solid_transparent] [border-radius:7px] [display:inline-flex] [align-items:center] [justify-content:center] [gap:8px] [font-size:13px] [font-weight:600] [transition:background_.16s,_border-color_.16s,_color_.16s] [.lookup-form_&]:[min-height:35px] [.lookup-form_&]:[padding:7px_9px] [.lookup-form_&]:[font-size:10px] [background:var(--green)] [color:white] [&:hover:not(:disabled)]:[background:var(--green-dark)]"} onClick={() => setPostDraft(true)}>+ Write a post</button>}
              />
            </div>
          )}
          <Pagination page={page} totalPages={result?.totalPages || 1} onPage={setPage} />
        </section>
        <aside className={"[min-width:0] [background:var(--surface)] [border:1px_solid_var(--line)] [border-radius:9px] [position:sticky] [top:14px] [padding:15px] [&_h2]:[margin:5px_0] [&_h2]:[color:#38463c] [&_h2]:[font:19px_var(--serif)] [&_>_p]:[margin:0_0_11px] [&_>_p]:[color:#7c877e] [&_>_p]:[font-size:10px] [&_>_p]:[line-height:1.6] max-[760px]:[position:static]"}>
          <div className={"[width:29px] [height:29px] [margin-bottom:10px] [display:inline-flex] [align-items:center] [justify-content:center] [color:#5d725e] [background:#edf2eb] [border-radius:6px]"}><Hash size={18} /></div>
          <div className={"[color:#758179] [font-size:10px] [font-weight:650] [letter-spacing:1px] [.welcome-text_&]:[color:#64816b] [.page-heading_&]:[margin-bottom:6px] [.modal-header_&]:[font-size:9px] [.note-editor-heading_&]:mb-[6px] max-[560px]:[.section-title_&]:[font-size:8px]"}>FIND A MEMBER’S POSTS</div>
          <h2>Posts by user</h2>
          <p>Enter a user ID to see the posts they’ve shared.</p>
          <form onSubmit={findUserPosts} className={"[&_input]:[width:100%] [&_input]:[min-width:0] [&_input]:[padding:10px_11px] [&_input]:[color:var(--ink)] [&_input]:[background:#fff] [&_input]:[border:1px_solid_#dfe5df] [&_input]:[border-radius:6px] [&_input]:[outline:none] [&_input]:[font-size:13px] [&_input]:[font-weight:400] [&_input::placeholder]:[color:#a2aaa4] [&_input:focus]:[border-color:#7da389] [&_input:focus]:[box-shadow:0_0_0_3px_#58836317] [display:flex] [gap:6px] [&_input]:[padding:8px] [&_input]:[font-size:10px] [&_.button]:[min-height:35px] [&_.button]:[padding:7px_9px] [&_.button]:[font-size:10px]"}>
            <input value={userId} onChange={(event) => setUserId(event.target.value)} placeholder="User ID" aria-label="User ID" />
            <button className={"[min-height:40px] [padding:9px_14px] [border:1px_solid_transparent] [border-radius:7px] [display:inline-flex] [align-items:center] [justify-content:center] [gap:8px] [font-size:13px] [font-weight:600] [transition:background_.16s,_border-color_.16s,_color_.16s] [.lookup-form_&]:[min-height:35px] [.lookup-form_&]:[padding:7px_9px] [.lookup-form_&]:[font-size:10px] [color:#fff] [background:#303b34] [&:hover:not(:disabled)]:[background:#202c24]"} type="submit" disabled={lookupBusy}>
              {lookupBusy ? <LoaderCircle className={"animate-spin"} size={16} /> : <Search size={16} />} Find
            </button>
          </form>
          {userPosts && (
            <div className={"[margin-top:12px] [padding-top:10px] [border-top:1px_solid_#edf0ed]"}>
              <div className={"[display:flex] [align-items:center] [gap:6px] [color:#4b594f] [font-size:10px] [&_>_span:last-child]:[margin-left:auto] [&_>_span:last-child]:[color:#89938b] [&_>_span:last-child]:[font-size:8px]"}>
                <Avatar name={userPosts.user.name} small />
                <strong>{userPosts.user.name}</strong>
                <span>{userPosts.posts.length} posts</span>
              </div>
              {userPosts.posts.length ? userPosts.posts.map((post) => (
                <div className={"[display:flex] [flex-direction:column] [gap:3px] [padding:8px_0] [border-bottom:1px_solid_#f0f2f0] [&_strong]:[color:#46534a] [&_strong]:[font:13px_var(--serif)] [&_strong]:[overflow-wrap:anywhere] [&_span]:[color:#879189] [&_span]:[font-size:9px]"} key={post._id}><strong>{post.title}</strong><span>{formatDate(post.createdAt)}</span></div>
              )) : <p className={"[color:#879189] [font-size:9px]"}>No posts from this user yet.</p>}
              <div className={"[display:flex] [justify-content:space-between] [align-items:center] [margin-top:6px] [&_>_span]:[color:#879189] [&_>_span]:[font-size:9px] [&_.text-button]:[font-size:9px]"}>
                <button className={"[display:inline-flex] [align-items:center] [justify-content:center] [gap:4px] [padding:5px_0] [color:#3e704e] [background:none] [border:0] [font-size:10px] [font-weight:650] [white-space:nowrap] [&:hover:not(:disabled)]:[color:#244b34] [&:disabled]:[opacity:.45] [.lookup-pager_&]:[font-size:9px]"} disabled={userPostPage <= 1 || lookupBusy} onClick={() => pageUserPosts(userPostPage - 1)}><ChevronLeft size={14} /> Previous</button>
                <span>Page {userPostPage}</span>
                <button className={"[display:inline-flex] [align-items:center] [justify-content:center] [gap:4px] [padding:5px_0] [color:#3e704e] [background:none] [border:0] [font-size:10px] [font-weight:650] [white-space:nowrap] [&:hover:not(:disabled)]:[color:#244b34] [&:disabled]:[opacity:.45] [.lookup-pager_&]:[font-size:9px]"} disabled={userPosts.posts.length < 6 || lookupBusy} onClick={() => pageUserPosts(userPostPage + 1)}>Next <ChevronRight size={14} /></button>
              </div>
            </div>
          )}
        </aside>
      </div>
      {postDraft && (
        <Modal title="Share a post" subtitle="Posts are public. Keep personal notes in My notes." onClose={() => setPostDraft(false)}>
          <form className={"[display:grid] [gap:13px] max-[560px]:[gap:11px]"} onSubmit={publish}>
            <Field label="Title" name="title" placeholder="What would you like to share?" maxLength={120} required autoFocus />
            <div className={"[min-width:0] [display:grid] [gap:6px] [color:#455149] [font-size:12px] [font-weight:600] [&_input]:[width:100%] [&_input]:[min-width:0] [&_input]:[padding:10px_11px] [&_input]:[color:var(--ink)] [&_input]:[background:#fff] [&_input]:[border:1px_solid_#dfe5df] [&_input]:[border-radius:6px] [&_input]:[outline:none] [&_input]:[font-size:13px] [&_input]:[font-weight:400] [&_textarea]:[width:100%] [&_textarea]:[min-width:0] [&_textarea]:[padding:10px_11px] [&_textarea]:[color:var(--ink)] [&_textarea]:[background:#fff] [&_textarea]:[border:1px_solid_#dfe5df] [&_textarea]:[border-radius:6px] [&_textarea]:[outline:none] [&_textarea]:[font-size:13px] [&_textarea]:[font-weight:400] [&_select]:[width:100%] [&_select]:[min-width:0] [&_select]:[padding:10px_11px] [&_select]:[color:var(--ink)] [&_select]:[background:#fff] [&_select]:[border:1px_solid_#dfe5df] [&_select]:[border-radius:6px] [&_select]:[outline:none] [&_select]:[font-size:13px] [&_select]:[font-weight:400] [&_textarea]:[resize:vertical] [&_textarea]:[line-height:1.6] [&_input::placeholder]:[color:#a2aaa4] [&_textarea::placeholder]:[color:#a2aaa4] [&_input:focus]:[border-color:#7da389] [&_input:focus]:[box-shadow:0_0_0_3px_#58836317] [&_textarea:focus]:[border-color:#7da389] [&_textarea:focus]:[box-shadow:0_0_0_3px_#58836317] [&_select:focus]:[border-color:#7da389] [&_select:focus]:[box-shadow:0_0_0_3px_#58836317] [&_small]:[color:var(--soft)] [&_small]:[font-size:10px] [&_small]:[font-weight:400] [&_small]:[line-height:1.5]"}>
              <span>Your post</span>
              <RichTextEditor
                ref={editorRef}
                onError={(message) => notify(message, 'error')}
                placeholder="Write your post…"
              />
            </div>
            <div className={"[display:flex] [justify-content:flex-end] [gap:8px] [margin-top:3px] [padding-top:13px] [border-top:1px_solid_#edf0ed] max-[560px]:[position:sticky] max-[560px]:[bottom:-1px] max-[560px]:[padding:10px_0_0] max-[560px]:[background:#fff]"}>
              <button type="button" className={"[min-height:40px] [padding:9px_14px] [border:1px_solid_transparent] [border-radius:7px] [display:inline-flex] [align-items:center] [justify-content:center] [gap:8px] [font-size:13px] [font-weight:600] [transition:background_.16s,_border-color_.16s,_color_.16s] [.lookup-form_&]:[min-height:35px] [.lookup-form_&]:[padding:7px_9px] [.lookup-form_&]:[font-size:10px] [color:#657168] [background:white] [border-color:var(--line)] [&:hover]:[background:#f8faf8]"} onClick={() => setPostDraft(false)}>Cancel</button>
              <button className={"[min-height:40px] [padding:9px_14px] [border:1px_solid_transparent] [border-radius:7px] [display:inline-flex] [align-items:center] [justify-content:center] [gap:8px] [font-size:13px] [font-weight:600] [transition:background_.16s,_border-color_.16s,_color_.16s] [.lookup-form_&]:[min-height:35px] [.lookup-form_&]:[padding:7px_9px] [.lookup-form_&]:[font-size:10px] [background:var(--green)] [color:white] [&:hover:not(:disabled)]:[background:var(--green-dark)]"} disabled={saving}>
                {saving ? <LoaderCircle className={"animate-spin"} size={17} /> : <ArrowUpRight size={16} />} Publish post
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
