export default function Dashboard(){
  return (
    <div>
      <h1>Dashboard</h1>

      <p style={{color:"#444"}}>Welcome! Use these quick steps to demo the system:</p>

      <ol style={{lineHeight:1.9}}>
        <li>Go to <b>Admin → Room Types</b> and click <i>Seed DLX/SUI</i> (or add your own).</li>
        <li>Go to <b>Admin → Rate Plans</b> and click <i>Seed BAR</i> (or create a plan).</li>
        <li>Open <b>Corporate</b>, pick dates, and <i>Search</i> to see prices (BAR or contract).</li>
        <li>Click <i>Book</i> on any row to create a reservation.</li>
      </ol>

      <div style={{marginTop:20, padding:12, border:"1px solid #eee", borderRadius:8}}>
        <b>Session</b>
        <div>Status: Not authenticated (demo mode)</div>
        <div>Use the <i>Admin/Hotel/Corporate/JWT</i> buttons in the header to switch persona.</div>
      </div>
    </div>
  );
}
