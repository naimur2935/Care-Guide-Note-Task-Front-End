import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check, LoaderCircle } from 'lucide-react';
import { api } from '../api.js';
import RichTextEditor, { richTextToText } from '../components/RichTextEditor.jsx';
import { Field } from '../components/ui.jsx';

export default function NoteEditorPage({ notify }) {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const editorRef = useRef(null);
  const [note, setNote] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(Boolean(noteId));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!noteId) return undefined;
    let active = true;
    api(`/notes/${noteId}`)
      .then((result) => {
        if (active) setNote({ title: result.title || '', content: result.content || '' });
      })
      .catch((error) => {
        if (!active) return;
        notify(error.message, 'error');
        navigate('/notes', { replace: true });
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [noteId, navigate, notify]);

  async function saveNote(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const body = {
      title: String(data.get('title') || '').trim(),
      content: editorRef.current?.getHTML() || note.content || '',
    };
    if (!body.title) return;
    if (richTextToText(body.content).length > 10000) {
      notify('Notes can contain up to 10,000 characters.', 'error');
      return;
    }

    setSaving(true);
    try {
      await api(noteId ? `/notes/${noteId}` : '/notes', {
        method: noteId ? 'PUT' : 'POST',
        body,
      });
      notify(noteId ? 'Your note has been updated.' : 'Note saved.');
      navigate('/notes');
    } catch (error) {
      notify(error.message, 'error');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className={"[.note-editor-page_&]:h-auto [.note-editor-page_&]:min-h-[240px] [height:100vh] [display:flex] [align-items:center] [justify-content:center] [gap:9px] [color:#68756c] [font-size:12px]"}><LoaderCircle className={"animate-spin"} size={22} />Loading note…</div>;
  }

  return (
    <section className={"mx-auto min-w-0 w-full max-w-full overflow-x-clip md:max-w-[860px] [&_.screen-loader]:h-auto [&_.screen-loader]:min-h-[240px]"}>
      <button className={"inline-flex items-center gap-[7px] border-0 bg-transparent py-[6px] text-xs text-[#5f7064] [&:hover]:text-[#315d43]"} type="button" onClick={() => navigate('/notes')}>
        <ArrowLeft size={16} /> Back to notes
      </button>
      <div className={"mb-[19px] mt-[17px] [&_.eyebrow]:mb-[6px] [&_h1]:m-0 [&_h1]:text-[32px] [&_h1]:leading-[1.2] [&_h1]:text-[#2d3b32] [&_h1]:[font-family:var(--font-serif)] [&_p]:mt-[6px] [&_p]:text-[11px] [&_p]:leading-[1.55] [&_p]:text-[#758078]"}>
        <div>
          <div className={"[color:#758179] [font-size:10px] [font-weight:650] [letter-spacing:1px] [.welcome-text_&]:[color:#64816b] [.page-heading_&]:[margin-bottom:6px] [.modal-header_&]:[font-size:9px] [.note-editor-heading_&]:mb-[6px] max-[560px]:[.section-title_&]:[font-size:8px]"}>YOUR PERSONAL COLLECTION</div>
          <h1>{noteId ? 'Edit note' : 'New note'}</h1>
          <p>Keep a thought, a plan, or a reminder in your private space.</p>
        </div>
      </div>
      <form className={"grid min-w-0 max-w-full gap-[17px] overflow-hidden rounded-[9px] border border-line bg-white p-[clamp(16px,3vw,25px)]"} onSubmit={saveNote}>
        <Field
          label="Title"
          name="title"
          value={note.title}
          onChange={(event) => setNote((current) => ({ ...current, title: event.target.value }))}
          placeholder="What’s on your mind?"
          maxLength={120}
          required
          autoFocus
        />
        <div className={"[min-width:0] [display:grid] [gap:6px] [color:#455149] [font-size:12px] [font-weight:600] [&_input]:[width:100%] [&_input]:[min-width:0] [&_input]:[padding:10px_11px] [&_input]:[color:var(--ink)] [&_input]:[background:#fff] [&_input]:[border:1px_solid_#dfe5df] [&_input]:[border-radius:6px] [&_input]:[outline:none] [&_input]:[font-size:13px] [&_input]:[font-weight:400] [&_textarea]:[width:100%] [&_textarea]:[min-width:0] [&_textarea]:[padding:10px_11px] [&_textarea]:[color:var(--ink)] [&_textarea]:[background:#fff] [&_textarea]:[border:1px_solid_#dfe5df] [&_textarea]:[border-radius:6px] [&_textarea]:[outline:none] [&_textarea]:[font-size:13px] [&_textarea]:[font-weight:400] [&_select]:[width:100%] [&_select]:[min-width:0] [&_select]:[padding:10px_11px] [&_select]:[color:var(--ink)] [&_select]:[background:#fff] [&_select]:[border:1px_solid_#dfe5df] [&_select]:[border-radius:6px] [&_select]:[outline:none] [&_select]:[font-size:13px] [&_select]:[font-weight:400] [&_textarea]:[resize:vertical] [&_textarea]:[line-height:1.6] [&_input::placeholder]:[color:#a2aaa4] [&_textarea::placeholder]:[color:#a2aaa4] [&_input:focus]:[border-color:#7da389] [&_input:focus]:[box-shadow:0_0_0_3px_#58836317] [&_textarea:focus]:[border-color:#7da389] [&_textarea:focus]:[box-shadow:0_0_0_3px_#58836317] [&_select:focus]:[border-color:#7da389] [&_select:focus]:[box-shadow:0_0_0_3px_#58836317] [&_small]:[color:var(--soft)] [&_small]:[font-size:10px] [&_small]:[font-weight:400] [&_small]:[line-height:1.5]"}>
          <span>Your note</span>
          <RichTextEditor
            ref={editorRef}
            content={note.content}
            onError={(message) => notify(message, 'error')}
            placeholder="Start anywhere…"
          />
        </div>
        <div className={"flex justify-end gap-2 border-t border-[#edf0ed] pt-[13px]"}>
          <button type="button" className={"[min-height:40px] [padding:9px_14px] [border:1px_solid_transparent] [border-radius:7px] [display:inline-flex] [align-items:center] [justify-content:center] [gap:8px] [font-size:13px] [font-weight:600] [transition:background_.16s,_border-color_.16s,_color_.16s] [.lookup-form_&]:[min-height:35px] [.lookup-form_&]:[padding:7px_9px] [.lookup-form_&]:[font-size:10px] [color:#657168] [background:white] [border-color:var(--line)] [&:hover]:[background:#f8faf8]"} onClick={() => navigate('/notes')}>Cancel</button>
          <button type="submit" className={"[min-height:40px] [padding:9px_14px] [border:1px_solid_transparent] [border-radius:7px] [display:inline-flex] [align-items:center] [justify-content:center] [gap:8px] [font-size:13px] [font-weight:600] [transition:background_.16s,_border-color_.16s,_color_.16s] [.lookup-form_&]:[min-height:35px] [.lookup-form_&]:[padding:7px_9px] [.lookup-form_&]:[font-size:10px] [background:var(--green)] [color:white] [&:hover:not(:disabled)]:[background:var(--green-dark)]"} disabled={saving}>
            {saving ? <LoaderCircle className={"animate-spin"} size={17} /> : <Check size={16} />}
            {noteId ? 'Save changes' : 'Save note'}
          </button>
        </div>
      </form>
    </section>
  );
}
