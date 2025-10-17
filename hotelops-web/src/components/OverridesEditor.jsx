// props:
//   roomTypes: Array<{ id: string, name: string }>
//   draft: { date?: string, roomTypeId?: string, price?: number }
//   setDraft: (d: any) => void
//   overrides: Array<{ date: string, roomTypeId: string, price: number }>
//   onAdd: () => void
//   onRemove: (idx: number) => void

export default function OverridesEditor({
  roomTypes, draft, setDraft, overrides, onAdd, onRemove
}) {
  return (
    <>
      <div className="row" style={{ gap: 8 }}>
        <input
          className="input"
          type="date"
          value={draft.date ?? ""}
          onChange={e => setDraft({ ...draft, date: e.target.value })}
        />

        <select
          className="input"
          value={draft.roomTypeId ?? ""}
          onChange={e => setDraft({ ...draft, roomTypeId: e.target.value })}
        >
          <option value="">Select a room type</option>
          {roomTypes.map(rt => (
            <option key={rt.id} value={rt.id}>
              {rt.id} — {rt.name}
            </option>
          ))}
        </select>

        <input
          className="input"
          type="number"
          value={draft.price ?? ""}
          onChange={e => setDraft({ ...draft, price: Number(e.target.value || 0) })}
          placeholder="Price"
        />

        <button className="btn btn-primary" onClick={onAdd} disabled={!draft.date || !draft.roomTypeId}>
          Add
        </button>
      </div>

      {overrides.map((ov, idx) => (
        <div className="row" key={`${ov.date}|${ov.roomTypeId}|${idx}`} style={{ gap: 8 }}>
          <div style={{ width: 120, alignSelf: "center" }}>{ov.date}</div>
          <div style={{ width: 80,  alignSelf: "center" }}>{ov.roomTypeId}</div>
          <div style={{ width: 80,  alignSelf: "center" }}>{ov.price}</div>
          <button className="btn" onClick={() => onRemove(idx)}>Remove</button>
        </div>
      ))}
    </>
  );
}
