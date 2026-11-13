import { useEffect, useState } from 'react';
import { BookOpen, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import { EmptyState, LoadingLine, NoteCard, PageHeading, Pagination } from '../components/ui.jsx';
import { richTextToText } from '../components/RichTextEditor.jsx';

export default function NotesPage({ notify }) {
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  async function loadNotes(pageNumber = page) {
    setLoading(true);
    try {
      setResult(await api(`/notes?page=${pageNumber}&limit=8`));
    } catch (error) {
      notify(error.message, 'error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadNotes(page); }, [page]);

  const visibleNotes = (result?.data || []).filter((note) =>
    `${note.title} ${richTextToText(note.content)}`.toLowerCase().includes(query.toLowerCase()),
  );

  async function deleteNote(note) {
    if (!window.confirm(`Delete “${note.title}”? This can’t be undone.`)) return;
    try {
      await api(`/notes/${note._id}`, { method: 'DELETE' });
      notify('Note deleted.');
      await loadNotes(page);
    } catch (error) {
      notify(error.message, 'error');
    }
  }

  return (
    <>
      <PageHeading
        eyebrow="YOUR PERSONAL COLLECTION"
        title="My notes"
        description="A home for the little things you want to remember."
        action={<button className={"[min-height:40px] [padding:9px_14px] [border:1px_solid_transparent] [border-radius:7px] [display:inline-flex] [align-items:center] [justify-content:center] [gap:8px] [font-size:13px] [font-weight:600] [transition:background_.16s,_border-color_.16s,_color_.16s] [.lookup-form_&]:[min-height:35px] [.lookup-form_&]:[padding:7px_9px] [.lookup-form_&]:[font-size:10px] [background:var(--green)] [color:white] [&:hover:not(:disabled)]:[background:var(--green-dark)]"} onClick={() => navigate('/notes/new')}>+ New note</button>}
      />
      <section className={"[min-width:0] [background:var(--surface)] [border:1px_solid_var(--line)] [border-radius:9px] [padding:0_16px_6px] max-[560px]:[padding:0_10px_5px]"}>
        <div className={"[min-height:55px] [display:flex] [align-items:center] [justify-content:space-between] [gap:10px] [border-bottom:1px_solid_#edf0ed] max-[560px]:[min-height:52px]"}>
          <div className={"[display:flex] [align-items:center] [gap:8px] [color:#7e8981] [font-size:10px] [&_strong]:[color:#45534a] [&_strong]:[font-size:11px] max-[560px]:[gap:5px] max-[560px]:[font-size:9px]"}>
            <span className={"[width:28px] [height:28px] [display:inline-flex] [align-items:center] [justify-content:center] [color:#52765c] [background:#edf3ed] [border-radius:6px] max-[560px]:[width:25px] max-[560px]:[height:25px]"}><BookOpen size={17} /></span>
            <span><strong>{result?.total ?? '—'}</strong> {result?.total === 1 ? 'note' : 'notes'} saved</span>
          </div>
          <label className={"[min-width:0] [display:flex] [align-items:center] [gap:7px] [padding:0_9px] [color:#858f87] [background:#fff] [border:1px_solid_#e1e6e1] [border-radius:6px] [&_input]:[width:140px] [&_input]:[min-width:0] [&_input]:[padding:8px_0] [&_input]:[color:#3d4941] [&_input]:[background:transparent] [&_input]:[border:0] [&_input]:[outline:0] [&_input]:[font-size:10px] [&_input::placeholder]:[color:#98a198] [&:focus-within]:[border-color:#83a48b] [&:focus-within]:[box-shadow:0_0_0_3px_#58836312] [.interest-filter_&_input]:[width:120px] max-[560px]:[gap:5px] max-[560px]:[padding:0_7px] max-[560px]:[&_input]:[width:clamp(76px,_26vw,_120px)] max-[560px]:[&_input]:[font-size:9px] max-[560px]:[.interest-filter_&]:[flex:1] max-[560px]:[.interest-filter_&_input]:[width:100%]"}>
            <Search size={16} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a note…" aria-label="Search notes" />
          </label>
        </div>
        {loading ? <LoadingLine /> : visibleNotes.length ? (
          <div className={"[display:grid] [grid-template-columns:repeat(2,_minmax(0,_1fr))] [gap:10px] [padding:13px_0_8px] max-[560px]:[grid-template-columns:1fr] max-[560px]:[gap:8px] max-[560px]:[padding-top:9px]"}>
            {visibleNotes.map((note) => (
              <NoteCard key={note._id} note={note} onEdit={() => navigate(`/notes/${note._id}/edit`)} onDelete={() => deleteNote(note)} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={query ? Search : BookOpen}
            title={query ? 'No matching notes' : 'Your notebook is open'}
            text={query ? 'Try another word, or clear the search.' : 'Start with anything — a thought, a plan, or a reminder.'}
            action={!query ? <button className={"[min-height:40px] [padding:9px_14px] [border:1px_solid_transparent] [border-radius:7px] [display:inline-flex] [align-items:center] [justify-content:center] [gap:8px] [font-size:13px] [font-weight:600] [transition:background_.16s,_border-color_.16s,_color_.16s] [.lookup-form_&]:[min-height:35px] [.lookup-form_&]:[padding:7px_9px] [.lookup-form_&]:[font-size:10px] [color:#315d43] [background:#fff] [border-color:#dae5dc] [&:hover]:[background:#f5f9f5]"} onClick={() => navigate('/notes/new')}>+ Write your first note</button> : null}
          />
        )}
        <Pagination page={page} totalPages={result?.totalPages || 1} onPage={setPage} />
      </section>
    </>
  );
}
