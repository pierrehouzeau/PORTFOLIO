// Lightweight HTML includes: replace elements with data-include
(function(){
  async function loadIncludes(){
    const nodes = Array.from(document.querySelectorAll('[data-include]'));
    await Promise.all(nodes.map(async (el) => {
      const url = el.getAttribute('data-include');
      try{
        const res = await fetch(url, {cache:'no-cache'});
        if(!res.ok) throw new Error(res.status + ' ' + res.statusText);
        const html = await res.text();
        const tpl = document.createElement('template');
        tpl.innerHTML = html.trim();
        el.replaceWith(tpl.content.cloneNode(true));
      }catch(err){
        console.error('Include failed:', url, err);
      }
    }));
    document.dispatchEvent(new Event('includes-loaded'));
  }
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', loadIncludes);
  }else{
    loadIncludes();
  }
})();

