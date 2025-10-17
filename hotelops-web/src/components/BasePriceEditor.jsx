// props:
//   roomTypes: Array<{ id: string, name: string }>
//   basePrices: Record<string, number>
//   onChange: (roomTypeId: string, value: number) => void

export default function BasePriceEditor({ roomTypes, basePrices, onChange }) {
  if (!roomTypes?.length) {
    return <div style={{ opacity: .7 }}>No room types yet.</div>;
  }

  return (
    <div className="grid-col">
      {roomTypes.map(rt => (
        <div className="row" key={rt.id} style={{ gap: 8 }}>
          <div style={{ width: 80, alignSelf: "center" }}>{rt.id}</div>
          <input
            className="input"
            type="number"
            value={basePrices?.[rt.id] ?? ""}
            onChange={e => onChange(rt.id, Number(e.target.value || 0))}
            placeholder={`Base price for ${rt.id}`}
          />
        </div>
      ))}
    </div>
  );
}
