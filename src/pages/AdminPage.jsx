import { useEffect, useState } from 'react';
import { Check, FileText, LoaderCircle, Pencil, Plus, ShieldCheck, Trash2, Users } from 'lucide-react';
import { api, formatDate, toList } from '../api.js';
import { Avatar, EmptyState, Field, LoadingLine, Modal, PageHeading, Pagination } from '../components/ui.jsx';
import { richTextToText } from '../components/RichTextEditor.jsx';
import { tw } from '../tw.js';

export default function AdminPage({ user, notify }) {
  const [tab, setTab] = useState('users');
  const [users, setUsers] = useState(null);
  const [notes, setNotes] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [userDraft, setUserDraft] = useState(null);
  const [saving, setSaving] = useState(false);

  async function loadData(pageNumber = page, selectedTab = tab) {
    setLoading(true);
    try {
      if (selectedTab === 'users') setUsers(await api(`/users?page=${pageNumber}&limit=8`));
      else setNotes(await api(`/notes/all?page=${pageNumber}&limit=8`));
    } catch (error) {
      notify(error.message, 'error');
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { loadData(page, tab); }, [page, tab]);

  async function saveUser(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const body = {
      name: String(data.get('name') || '').trim(),
      email: String(data.get('email') || '').trim(),
      role: String(data.get('role') || 'user'),
      interests: toList(String(data.get('interests') || '')),
    };
    const password = String(data.get('password') || '');
    if (password) body.password = password;
    if (!userDraft._id && !password) {
      notify('Add a password for the new user.', 'error');
      return;
    }
    setSaving(true);
    try {
      await api(userDraft._id ? `/users/${userDraft._id}` : '/users', {
        method: userDraft._id ? 'PUT' : 'POST',
        body,
      });
      setUserDraft(null);
      notify(userDraft._id ? 'User details updated.' : 'User added.');
      await loadData(page, 'users');
    } catch (error) {
      notify(error.message, 'error');
    } finally {
      setSaving(false);
    }
  }

  async function deleteUser(target) {
    if (target._id === user._id) {
      notify('You cannot remove your own admin account.', 'error');
      return;
    }
    if (!window.confirm(`Remove ${target.name} and their notes and posts? This can’t be undone.`)) return;
    try {
      await api(`/users/${target._id}`, { method: 'DELETE' });
      notify(`${target.name} and their content were removed.`);
      await loadData(page, 'users');
    } catch (error) {
      notify(error.message, 'error');
    }
  }

  return (
    <>
      <PageHeading
        eyebrow="ADMINISTRATION"
        title="Admin tools"
        description="Manage user accounts and review saved notes."
        action={tab === 'users' ? <button className={"[min-height:40px] [padding:9px_14px] [border:1px_solid_transparent] [border-radius:7px] [display:inline-flex] [align-items:center] [justify-content:center] [gap:8px] [font-size:13px] [font-weight:600] [transition:background_.16s,_border-color_.16s,_color_.16s] [.lookup-form_&]:[min-height:35px] [.lookup-form_&]:[padding:7px_9px] [.lookup-form_&]:[font-size:10px] [background:var(--green)] [color:white] [&:hover:not(:disabled)]:[background:var(--green-dark)]"} onClick={() => setUserDraft({ name: '', email: '', role: 'user', interests: [] })}><Plus size={16} /> Add user</button> : null}
      />
      <div className={"[display:flex] [gap:4px] [margin-bottom:12px] [border-bottom:1px_solid_var(--line)] [&_button]:[display:flex] [&_button]:[align-items:center] [&_button]:[gap:7px] [&_button]:[padding:10px_11px] [&_button]:[color:#78837b] [&_button]:[background:transparent] [&_button]:[border:0] [&_button]:[border-bottom:2px_solid_transparent] [&_button]:[font-size:11px] [&_button.selected]:[color:#356447] [&_button.selected]:[border-bottom-color:#4f805e] [&_button.selected]:[font-weight:650] [&_button_>_span]:[padding:2px_6px] [&_button_>_span]:[color:#647064] [&_button_>_span]:[background:#f0f3ef] [&_button_>_span]:[border-radius:10px] [&_button_>_span]:[font-size:9px] max-[560px]:[&_button]:[padding:9px_7px] max-[560px]:[&_button]:[font-size:10px] max-[560px]:[&_button_svg]:[width:14px]"} role="tablist">
        <button className={tw(tab === 'users' && 'selected')} onClick={() => { setTab('users'); setPage(1); }} role="tab" aria-selected={tab === 'users'}>
          <Users size={16} /> Users <span>{users?.total ?? '—'}</span>
        </button>
        <button className={tw(tab === 'notes' && 'selected')} onClick={() => { setTab('notes'); setPage(1); }} role="tab" aria-selected={tab === 'notes'}>
          <FileText size={16} /> All notes
        </button>
      </div>
      <section className={"[min-width:0] [background:var(--surface)] [border:1px_solid_var(--line)] [border-radius:9px] [padding:4px_15px_6px] max-[560px]:[padding:3px_9px_5px]"}>
        {loading ? <LoadingLine /> : tab === 'users' ? (
          users?.data.length ? (
            <div className={"[display:grid]"}>
              {users.data.map((person) => (
                <div className={"[min-height:66px] [display:flex] [align-items:center] [gap:9px] [border-bottom:1px_solid_#edf0ed] max-[560px]:[gap:6px] max-[560px]:[min-height:63px] max-[560px]:[&_>_.avatar]:[width:29px] max-[560px]:[&_>_.avatar]:[height:29px] max-[360px]:[gap:4px]"} key={person._id}>
                  <Avatar name={person.name} />
                  <div className={"[min-width:0] [flex:1] [display:grid] [gap:3px] [&_strong]:[color:#435047] [&_strong]:[font-size:11px] [&_>_span]:[color:#78847b] [&_>_span]:[font-size:9px] [&_>_span]:[overflow-wrap:anywhere] [&_small]:[color:#929c94] [&_small]:[font-size:8px] [&_small]:[overflow:hidden] [&_small]:[text-overflow:ellipsis] [&_small]:[white-space:nowrap]"}>
                    <strong>{person.name}{person._id === user._id && <span className={"[margin-left:5px] [padding:2px_4px] [color:#496d4e] [background:#edf3ed] [border-radius:3px] [font-size:7px]"}>YOU</span>}</strong>
                    <span>{person.email}</span>
                    <small>{(person.interests || []).length ? person.interests.join(' · ') : 'No interests added'}</small>
                  </div>
                  <span className={tw('role-pill', person.role === 'admin' && 'role-admin')}>
                    {person.role === 'admin' ? <ShieldCheck size={13} /> : <Users size={13} />}{person.role}
                  </span>
                  <div className={"[display:flex] [gap:0] max-[560px]:[&_.icon-button]:[width:29px] max-[560px]:[&_.icon-button]:[height:29px] max-[360px]:[&_.icon-button]:[width:26px]"}>
                    <button className={"[width:36px] [height:36px] [flex:0_0_auto] [display:inline-flex] [align-items:center] [justify-content:center] [color:#738078] [background:transparent] [border:0] [border-radius:7px] [&:hover:not(:disabled)]:[color:#315d43] [&:hover:not(:disabled)]:[background:#f0f4f0] [&.danger-hover:hover]:[color:#a64e43] [&.danger-hover:hover]:[background:#fff0ee] [.pagination_&]:[border:1px_solid_#e5e9e5] max-[560px]:[.admin-row-actions_&]:[width:29px] max-[560px]:[.admin-row-actions_&]:[height:29px] max-[360px]:[.admin-row-actions_&]:[width:26px]"} onClick={() => setUserDraft(person)} aria-label={`Edit ${person.name}`} title="Edit"><Pencil size={15} /></button>
                    <button className={"[width:36px] [height:36px] [flex:0_0_auto] [display:inline-flex] [align-items:center] [justify-content:center] [color:#738078] [background:transparent] [border:0] [border-radius:7px] [&:hover:not(:disabled)]:[color:#315d43] [&:hover:not(:disabled)]:[background:#f0f4f0] [&.danger-hover:hover]:[color:#a64e43] [&.danger-hover:hover]:[background:#fff0ee] [.pagination_&]:[border:1px_solid_#e5e9e5] max-[560px]:[.admin-row-actions_&]:[width:29px] max-[560px]:[.admin-row-actions_&]:[height:29px] max-[360px]:[.admin-row-actions_&]:[width:26px] [.icon-button&:hover]:[color:#a64e43] [.icon-button&:hover]:[background:#fff0ee]"} onClick={() => deleteUser(person)} aria-label={`Delete ${person.name}`} title="Delete"><Trash2 size={15} /></button>
                  </div>
                </div>
              ))}
            </div>
          ) : <EmptyState icon={Users} title="No users on this page" text="Add a user to get started." />
        ) : notes?.data.length ? (
          <div className={"[display:grid]"}>
            {notes.data.map((note) => (
              <article className={"[min-height:68px] [display:flex] [align-items:center] [gap:9px] [border-bottom:1px_solid_#edf0ed] max-[560px]:[gap:6px] max-[560px]:[min-height:64px]"} key={note._id}>
                <span className={"[width:30px] [height:30px] [flex:0_0_auto] [display:grid] [place-items:center] [color:#527354] [background:#edf3ed] [border-radius:6px]"}><FileText size={17} /></span>
                <div className={"[min-width:0] [flex:1] [&_strong]:[color:#405047] [&_strong]:[font:15px_var(--serif)] [&_p]:[margin:3px_0_0] [&_p]:[color:#78847b] [&_p]:[overflow:hidden] [&_p]:[font-size:9px] [&_p]:[text-overflow:ellipsis] [&_p]:[white-space:nowrap] max-[560px]:[&_strong]:[font-size:14px]"}><strong>{note.title}</strong><p>{richTextToText(note.content) || 'No note content.'}</p></div>
                <div className={"[min-width:115px] [display:flex] [align-items:center] [gap:6px] [color:#59665c] [font-size:9px] [&_>_span:last-child]:[min-width:0] [&_>_span:last-child]:[display:grid] [&_>_span:last-child]:[gap:2px] [&_>_span:last-child]:[overflow:hidden] [&_>_span:last-child]:[text-overflow:ellipsis] [&_>_span:last-child]:[white-space:nowrap] [&_small]:[overflow:hidden] [&_small]:[color:#929c94] [&_small]:[font-size:8px] [&_small]:[text-overflow:ellipsis] max-[560px]:[min-width:29px] max-[560px]:[&_>_span:last-child]:[display:none]"}>
                  <Avatar name={note.userId?.name || 'Unknown'} small />
                  <span>{note.userId?.name || 'Deleted user'}<small>{note.userId?.email || '—'}</small></span>
                </div>
                <span className={"[color:#818c83] [font-size:9px] [white-space:nowrap] max-[560px]:[display:none]"}>{formatDate(note.createdAt)}</span>
              </article>
            ))}
          </div>
        ) : <EmptyState icon={FileText} title="No notes to show" text="There are no notes on this page." />}
        {tab === 'users' && users && <Pagination page={page} totalPages={users.totalPages || 1} onPage={setPage} />}
        {tab === 'notes' && notes && <Pagination page={page} totalPages={notes.totalPages || 1} onPage={setPage} />}
      </section>
      {userDraft && (
        <Modal
          title={userDraft._id ? 'Edit user' : 'Add user'}
          subtitle="Enter their account details and choose a role."
          onClose={() => setUserDraft(null)}
        >
          <form className={"[display:grid] [gap:13px] max-[560px]:[gap:11px]"} onSubmit={saveUser}>
            <Field label="Name" name="name" defaultValue={userDraft.name} placeholder="Full name" autoComplete="name" required autoFocus />
            <Field label="Email address" name="email" type="email" defaultValue={userDraft.email} placeholder="person@example.com" autoComplete="email" required />
            <label className={"[min-width:0] [display:grid] [gap:6px] [color:#455149] [font-size:12px] [font-weight:600] [&_input]:[width:100%] [&_input]:[min-width:0] [&_input]:[padding:10px_11px] [&_input]:[color:var(--ink)] [&_input]:[background:#fff] [&_input]:[border:1px_solid_#dfe5df] [&_input]:[border-radius:6px] [&_input]:[outline:none] [&_input]:[font-size:13px] [&_input]:[font-weight:400] [&_textarea]:[width:100%] [&_textarea]:[min-width:0] [&_textarea]:[padding:10px_11px] [&_textarea]:[color:var(--ink)] [&_textarea]:[background:#fff] [&_textarea]:[border:1px_solid_#dfe5df] [&_textarea]:[border-radius:6px] [&_textarea]:[outline:none] [&_textarea]:[font-size:13px] [&_textarea]:[font-weight:400] [&_select]:[width:100%] [&_select]:[min-width:0] [&_select]:[padding:10px_11px] [&_select]:[color:var(--ink)] [&_select]:[background:#fff] [&_select]:[border:1px_solid_#dfe5df] [&_select]:[border-radius:6px] [&_select]:[outline:none] [&_select]:[font-size:13px] [&_select]:[font-weight:400] [&_textarea]:[resize:vertical] [&_textarea]:[line-height:1.6] [&_input::placeholder]:[color:#a2aaa4] [&_textarea::placeholder]:[color:#a2aaa4] [&_input:focus]:[border-color:#7da389] [&_input:focus]:[box-shadow:0_0_0_3px_#58836317] [&_textarea:focus]:[border-color:#7da389] [&_textarea:focus]:[box-shadow:0_0_0_3px_#58836317] [&_select:focus]:[border-color:#7da389] [&_select:focus]:[box-shadow:0_0_0_3px_#58836317] [&_small]:[color:var(--soft)] [&_small]:[font-size:10px] [&_small]:[font-weight:400] [&_small]:[line-height:1.5]"}>
              <span>Role</span>
              <select name="role" defaultValue={userDraft.role}><option value="user">User</option><option value="admin">Admin</option></select>
            </label>
            <Field label="Interests" name="interests" defaultValue={(userDraft.interests || []).join(', ')} placeholder="Reading, design, cooking" hint="Separate interests with commas." />
            <Field
              label={userDraft._id ? 'New password (optional)' : 'Temporary password'}
              name="password"
              type="password"
              minLength={6}
              autoComplete="new-password"
              placeholder={userDraft._id ? 'Leave blank to keep current' : 'At least 6 characters'}
              required={!userDraft._id}
            />
            <div className={"[display:flex] [justify-content:flex-end] [gap:8px] [margin-top:3px] [padding-top:13px] [border-top:1px_solid_#edf0ed] max-[560px]:[position:sticky] max-[560px]:[bottom:-1px] max-[560px]:[padding:10px_0_0] max-[560px]:[background:#fff]"}>
              <button type="button" className={"[min-height:40px] [padding:9px_14px] [border:1px_solid_transparent] [border-radius:7px] [display:inline-flex] [align-items:center] [justify-content:center] [gap:8px] [font-size:13px] [font-weight:600] [transition:background_.16s,_border-color_.16s,_color_.16s] [.lookup-form_&]:[min-height:35px] [.lookup-form_&]:[padding:7px_9px] [.lookup-form_&]:[font-size:10px] [color:#657168] [background:white] [border-color:var(--line)] [&:hover]:[background:#f8faf8]"} onClick={() => setUserDraft(null)}>Cancel</button>
              <button className={"[min-height:40px] [padding:9px_14px] [border:1px_solid_transparent] [border-radius:7px] [display:inline-flex] [align-items:center] [justify-content:center] [gap:8px] [font-size:13px] [font-weight:600] [transition:background_.16s,_border-color_.16s,_color_.16s] [.lookup-form_&]:[min-height:35px] [.lookup-form_&]:[padding:7px_9px] [.lookup-form_&]:[font-size:10px] [background:var(--green)] [color:white] [&:hover:not(:disabled)]:[background:var(--green-dark)]"} disabled={saving}>
                {saving ? <LoaderCircle className={"animate-spin"} size={17} /> : <Check size={16} />}
                {userDraft._id ? 'Save changes' : 'Add user'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
