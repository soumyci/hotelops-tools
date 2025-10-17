
const HintBubble = (()=>{
  const active = new Map();
  function show(targetId, html, opts={}){
    const el = document.getElementById(targetId);
    if (!el) return;
    dismiss(targetId);
    el.setAttribute('data-bs-toggle','popover');
    el.setAttribute('data-bs-html','true');
    el.setAttribute('data-bs-content', html);
    el.setAttribute('data-bs-placement', 'top');
    const pop = new bootstrap.Popover(el);
    pop.show();
    active.set(targetId, pop);
    if (opts.autohide){
      setTimeout(()=>dismiss(targetId), 3000);
    }
  }
  function dismiss(targetId){
    const pop = active.get(targetId);
    if (pop){ pop.dispose(); active.delete(targetId); }
  }
  return { show, dismiss };
})();
