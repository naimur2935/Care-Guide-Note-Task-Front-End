import { useEffect, useState } from 'react';
import { Hash, Search, Tags } from 'lucide-react';
import { api, initials } from '../api.js';
import { EmptyState, LoadingLine, PageHeading } from '../components/ui.jsx';

export default function InterestGroupsPage({ notify }) {
  const [groups, setGroups] = useState([]);
  const [interest, setInterest] = useState('');
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);

  async function loadGroups(pageNumber = page, selectedInterest = filter) {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: pageNumber, limit: 12 });
      if (selectedInterest) params.set('interest', selectedInterest);
      const result = await api(`/users/grouped-by-interests?${params}`);
      setGroups((current) => pageNumber === 1 ? result.data : [...current, ...result.data]);
      setHasMore(result.data.length === 12);
    } catch (error) {
      notify(error.message, 'error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadGroups(page, filter); }, [page, filter]);

  function applyFilter(event) {
    event.preventDefault();
    setPage(1);
    setFilter(interest.trim());
  }

  function clearFilter() {
    setInterest('');
    setFilter('');
    setPage(1);
  }

  return (
    <>
      <PageHeading
        eyebrow="COMMUNITY DIRECTORY"
        title="Interests"
        description="Find people who enjoy the same things you do."
      />
      <section className={"[min-height:132px] [margin-bottom:13px] [padding:18px_20px] [display:flex] [align-items:center] [gap:18px] [background:#f0f2ed] [border:1px_solid_#e7ebe4] [border-radius:8px] [&_h2]:[margin:5px_0_3px] [&_h2]:[color:#465441] [&_h2]:[font:20px_var(--serif)] [&_p]:[max-width:310px] [&_p]:[margin:0] [&_p]:[color:#788274] [&_p]:[font-size:10px] [&_p]:[line-height:1.5] max-[560px]:[min-height:0] max-[560px]:[padding:13px_11px] max-[560px]:[flex-wrap:wrap] max-[560px]:[gap:7px] max-[560px]:[&_>_div:nth-child(2)]:[flex:1] max-[560px]:[&_h2]:[font-size:17px] max-[560px]:[&_p]:[font-size:9px]"}>
        <div className={"[width:65px] [height:65px] [flex:0_0_auto] [position:relative] [display:grid] [place-items:center] [&_i]:[position:absolute] [&_i]:[width:8px] [&_i]:[height:8px] [&_i]:[top:1px] [&_i]:[left:29px] [&_i]:[background:#bdab85] [&_i]:[border-radius:50%] [&_i:nth-child(2)]:[top:47px] [&_i:nth-child(2)]:[left:6px] [&_i:nth-child(2)]:[background:#9e9aab] [&_i:nth-child(3)]:[top:50px] [&_i:nth-child(3)]:[left:50px] [&_i:nth-child(3)]:[background:#7f9b83] [&::before]:[position:absolute] [&::before]:[width:57px] [&::before]:[height:37px] [&::before]:[border:1px_dashed_#cbd4c8] [&::before]:[border-radius:50%] [&::before]:[content:\"\"] [&::after]:[position:absolute] [&::after]:[width:57px] [&::after]:[height:37px] [&::after]:[border:1px_dashed_#cbd4c8] [&::after]:[border-radius:50%] [&::after]:[content:\"\"] [&::before]:[transform:rotate(35deg)] [&::after]:[transform:rotate(-35deg)] max-[560px]:[width:50px] max-[560px]:[height:50px] max-[560px]:[transform:scale(.78)] max-[560px]:[transform-origin:left_center] max-[560px]:[margin-right:-10px]"}><div className={"[z-index:2] [width:39px] [height:39px] [display:grid] [place-items:center] [color:#577454] [background:#e1e9dc] [border-radius:50%]"}><Tags size={22} /></div><i /><i /><i /></div>
        <div className={"interest-intro-copy"}>
          <div className={"[color:#758179] [font-size:10px] [font-weight:650] [letter-spacing:1px] [.welcome-text_&]:[color:#64816b] [.page-heading_&]:[margin-bottom:6px] [.modal-header_&]:[font-size:9px] [.note-editor-heading_&]:mb-[6px] max-[560px]:[.section-title_&]:[font-size:8px]"}>SHARED INTERESTS</div>
          <h2>Find common ground</h2>
          <p>Groups are based on the interests people add to their profiles.</p>
        </div>
        <form className={"[margin-left:auto] [display:flex] [align-items:center] [gap:6px] [&_.search-field_input]:[width:120px] max-[560px]:[width:100%] max-[560px]:[margin-left:0] max-[560px]:[&_.search-field]:[flex:1] max-[560px]:[&_.search-field_input]:[width:100%]"} onSubmit={applyFilter}>
          <label className={"[min-width:0] [display:flex] [align-items:center] [gap:7px] [padding:0_9px] [color:#858f87] [background:#fff] [border:1px_solid_#e1e6e1] [border-radius:6px] [&_input]:[width:140px] [&_input]:[min-width:0] [&_input]:[padding:8px_0] [&_input]:[color:#3d4941] [&_input]:[background:transparent] [&_input]:[border:0] [&_input]:[outline:0] [&_input]:[font-size:10px] [&_input::placeholder]:[color:#98a198] [&:focus-within]:[border-color:#83a48b] [&:focus-within]:[box-shadow:0_0_0_3px_#58836312] [.interest-filter_&_input]:[width:120px] max-[560px]:[gap:5px] max-[560px]:[padding:0_7px] max-[560px]:[&_input]:[width:clamp(76px,_26vw,_120px)] max-[560px]:[&_input]:[font-size:9px] max-[560px]:[.interest-filter_&]:[flex:1] max-[560px]:[.interest-filter_&_input]:[width:100%]"}>
            <Search size={16} />
            <input value={interest} onChange={(event) => setInterest(event.target.value)} placeholder="Filter interests" aria-label="Filter by interest" />
          </label>
          <button className={"[min-height:40px] [padding:9px_14px] [border:1px_solid_transparent] [border-radius:7px] [display:inline-flex] [align-items:center] [justify-content:center] [gap:8px] [font-size:13px] [font-weight:600] [transition:background_.16s,_border-color_.16s,_color_.16s] [.lookup-form_&]:[min-height:35px] [.lookup-form_&]:[padding:7px_9px] [.lookup-form_&]:[font-size:10px] [color:#fff] [background:#303b34] [&:hover:not(:disabled)]:[background:#202c24]"}>Search</button>
          {filter && <button className={"[padding:4px] [color:#62735f] [background:none] [border:0] [font-size:9px]"} type="button" onClick={clearFilter}>Clear</button>}
        </form>
      </section>
      {loading && !groups.length ? (
        <section className={"[min-width:0] [background:var(--surface)] [border:1px_solid_var(--line)] [border-radius:9px]"}><LoadingLine /></section>
      ) : groups.length ? (
        <div className={"[display:grid] [grid-template-columns:repeat(3,_minmax(0,_1fr))] [gap:10px] max-[560px]:[grid-template-columns:repeat(2,_minmax(0,_1fr))] max-[560px]:[gap:7px] max-[360px]:[grid-template-columns:1fr]"}>
          {groups.map((group, index) => (
            <article className={"[min-width:0] [background:var(--surface)] [border:1px_solid_var(--line)] [border-radius:9px] [min-width:0] [padding:13px] [&_h3]:[margin:10px_0] [&_h3]:[color:#435044] [&_h3]:[font:18px_var(--serif)] [&_h3]:[overflow-wrap:anywhere] max-[560px]:[padding:10px] max-[560px]:[&_h3]:[margin:8px_0] max-[560px]:[&_h3]:[font-size:16px]"} key={`${group._id}-${index}`}>
              <div className={"[display:flex] [justify-content:space-between] [align-items:center]"}>
                <span className={"[width:28px] [height:28px] [display:grid] [place-items:center] [color:#577454] [background:#edf3ec] [border-radius:6px] [.interest-tone-1_&]:[color:#577454] [.interest-tone-1_&]:[background:#edf3ec] [.interest-tone-2_&]:[color:#577454] [.interest-tone-2_&]:[background:#edf3ec] [.interest-tone-3_&]:[color:#577454] [.interest-tone-3_&]:[background:#edf3ec]"}><Hash size={15} /></span>
                <span className={"[color:#818c83] [font-size:9px] max-[560px]:[font-size:8px]"}>{group.count} {group.count === 1 ? 'person' : 'people'}</span>
              </div>
              <h3>{group._id}</h3>
              <div className={"[display:flex] [align-items:center]"}>
                {group.users.slice(0, 5).map((person) => (
                  <span className={"[width:24px] [height:24px] [margin-right:-4px] [display:inline-flex] [align-items:center] [justify-content:center] [color:#42644b] [background:#e7efe7] [border:2px_solid_#fff] [border-radius:50%] [font-size:7px] [font-weight:700] [&:nth-child(n+2)]:[color:#5b685a] [&:nth-child(n+2)]:[background:#eef0e9]"} title={person.name} key={person._id}>{initials(person.name)}</span>
                ))}
                {group.users.length > 5 && <span className={"[width:24px] [height:24px] [margin-right:-4px] [display:inline-flex] [align-items:center] [justify-content:center] [color:#42644b] [background:#e7efe7] [border:2px_solid_#fff] [border-radius:50%] [font-size:7px] [font-weight:700] [color:#637064] [background:#f1f3f0] [font-size:8px]"}>+{group.users.length - 5}</span>}
              </div>
              <div className={"[min-height:24px] [margin-top:8px] [color:#7c877e] [font-size:9px] [line-height:1.5]"}>
                {group.users.slice(0, 4).map((person) => person.name).join(', ')}
                {group.users.length > 4 ? ` and ${group.users.length - 4} more` : ''}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <section className={"[min-width:0] [background:var(--surface)] [border:1px_solid_var(--line)] [border-radius:9px]"}>
          <EmptyState
            icon={Tags}
            title={filter ? 'No matching interest' : 'No interests yet'}
            text={filter ? `No one has added “${filter}” yet. Try another search.` : 'Interest groups will appear as people add interests to their profiles.'}
            action={filter ? <button className={"[display:inline-flex] [align-items:center] [justify-content:center] [gap:4px] [padding:5px_0] [color:#3e704e] [background:none] [border:0] [font-size:10px] [font-weight:650] [white-space:nowrap] [&:hover:not(:disabled)]:[color:#244b34] [&:disabled]:[opacity:.45] [.lookup-pager_&]:[font-size:9px]"} onClick={clearFilter}>Show all interests</button> : null}
          />
        </section>
      )}
      {loading && groups.length > 0 && <div className={"[display:flex] [justify-content:center] [margin-top:14px]"}><LoadingLine /></div>}
      {!loading && hasMore && (
        <div className={"[display:flex] [justify-content:center] [margin-top:14px]"}>
          <button className={"[min-height:40px] [padding:9px_14px] [border:1px_solid_transparent] [border-radius:7px] [display:inline-flex] [align-items:center] [justify-content:center] [gap:8px] [font-size:13px] [font-weight:600] [transition:background_.16s,_border-color_.16s,_color_.16s] [.lookup-form_&]:[min-height:35px] [.lookup-form_&]:[padding:7px_9px] [.lookup-form_&]:[font-size:10px] [color:#315d43] [background:#fff] [border-color:#dae5dc] [&:hover]:[background:#f5f9f5]"} onClick={() => setPage((value) => value + 1)}>Show more</button>
        </div>
      )}
    </>
  );
}
