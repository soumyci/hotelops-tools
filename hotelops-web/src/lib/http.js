export async function jget(url) {
  const r = await fetch(url, { headers: { "Accept": "application/json" } });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}
export async function jpost(url, body) {
  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}
export async function jput(url, body) {
  const r = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}
export async function jdel(url) {
  const r = await fetch(url, { method: "DELETE" });
  if (!r.ok) throw new Error(await r.text());
}