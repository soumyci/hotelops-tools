const API = import.meta.env.VITE_API_BASE || "http://localhost:5212"; // adjust to yours

export async function uploadFile(file){
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch(`${API}/api/files/upload`, {
    method: "POST",
    body: fd
  });
  if(!res.ok) throw new Error("Upload failed");
  return res.json(); // { url: "/uploads/..." }
}
