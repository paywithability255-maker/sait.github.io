const qs = (s, root=document) => root.querySelector(s);
const qsa = (s, root=document) => [...root.querySelectorAll(s)];

/* Маска телефона */
function maskPhone(input){
  function format(value){
    const digits = value.replace(/\D/g, '');
    const base = digits.startsWith('7') ? digits : ('7' + digits);
    const a = base.slice(1, 4);
    const b = base.slice(4, 7);
    const c = base.slice(7, 9);
    const d = base.slice(9, 11);
    let out = '+7';
    out += a ? ` (${a}` : ' (';
    out += a && a.length===3 ? ')' : '';
    out += b ? ` ${b}` : ' ';
    out += c ? `-${c}` : '-';
    out += d ? `-${d}` : '-';
    return out;
  }
  input.addEventListener('input', () => {
    const pos = input.selectionStart || input.value.length;
    input.value = format(input.value);
    input.setSelectionRange(pos, pos);
  });
  input.addEventListener('focus', () => { if(!input.value.trim()) input.value = '+7 ('; });
  input.addEventListener('blur', () => { if(input.value.replace(/\D/g,'').length < 11) input.value = ''; });
}

/* Валидация форм */
function setupForm(form){
  if(!form) return;
  const errorsEl = qs('.form__errors', form) || document.createElement('div');
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    errorsEl.textContent = '';
    let ok = true;
    qsa('input[required], select[required], textarea[required]', form).forEach(el=>{
      if((el.type==='checkbox' && !el.checked) || !el.value.trim()){
        ok = false; el.setAttribute('aria-invalid','true');
      } else { el.removeAttribute('aria-invalid'); }
    });
    if(!ok){ errorsEl.textContent = 'Проверьте обязательные поля.'; return; }
    console.log('[analytics] form submit', form.id);
    const success = qs('.form__success', form);
    if(success){ success.hidden = false; }
    form.reset();
  });
}

/* FAQ: аккордеон */
function setupFAQ(){
  const items = qsa('.faq-item');
  items.forEach(item=>{
    const btn = qs('.faq-item__btn', item);
    btn.addEventListener('click', ()=>{
      items.forEach(i=>{
        if(i!==item){ i.removeAttribute('open'); i.removeAttribute('data-open'); qs('.faq-item__btn', i).setAttribute('aria-expanded','false'); }
      });
      const open = item.hasAttribute('open') || item.hasAttribute('data-open');
      if(open){ item.removeAttribute('open'); item.removeAttribute('data-open'); btn.setAttribute('aria-expanded','false'); }
      else{ item.setAttribute('data-open',''); btn.setAttribute('aria-expanded','true'); }
    });
  });
}

/* Before/After — (в этой версии секция интерьера без ползунков) */

/* Калькулятор */
function setupCalc(){
  const btn = qs('#btnGetQuote');
  const wrap = qs('#calcContact');
  const form = qs('#calcForm');
  if(!btn || !wrap || !form) return;
  btn.addEventListener('click', ()=>{
    wrap.hidden = false;
    const zone = qs('select[name="zone"]', form).value;
    const bone = qs('select[name="bone"]', form).value;
    const speed = qs('select[name="speed"]', form).value;
    let price = 19900;
    if(bone==='graft') price += 15000;
    if(speed==='express') price += 10000;
    if(zone==='front') price += 5000;
    console.log('[quote] ориентировочно от', price, '₽');
    window.scrollTo({top:wrap.getBoundingClientRect().top + window.pageYOffset - 100, behavior:'smooth'});
  });
}

/* Аналитика */
function setupAnalytics(){
  qsa('[data-analytics]').forEach(el=>{
    el.addEventListener('click', ()=>console.log('[analytics] click', el.dataset.analytics));
  });
}

document.addEventListener('DOMContentLoaded', ()=>{
  qsa('input[type="tel"]').forEach(maskPhone);
  setupForm(qs('#contactForm'));
  setupForm(qs('#calcForm'));
  setupFAQ();
  setupCalc();
  setupAnalytics();
});
