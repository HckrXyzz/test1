const FILES = ['M1.json','M2.json','B1.json','B2.json','B3.json','B4.json','B5.json','K1.json','J1.json','T1.json'];
const TARGET_STATUS = 'ALREADY FOLLOW UP';
let records = [];
let allRows = [];

const $ = (id) => document.getElementById(id);
const normalize = (value) => String(value ?? '').trim().toUpperCase();
const safeText = (value) => String(value ?? '').trim();

function money(value) {
  const raw = safeText(value);
  const n = Number(raw.replace(/,/g, ''));
  return raw && Number.isFinite(n) ? n.toLocaleString(undefined, { maximumFractionDigits: 2 }) : (raw || '—');
}

function fieldLabel(value) { return String(value ?? '').trim() || 'Unnamed field'; }
function makeCell(text, cls='') { const el=document.createElement('td'); el.className=cls; el.textContent=text; return el; }

function renderRows() {
  const query = $('searchInput').value.trim().toLowerCase();
  const visible = records.filter(r => !query || [r.reference, r.amount, r.source, r.status].some(v => safeText(v).toLowerCase().includes(query)));
  const body = $('tableBody'); body.replaceChildren();

  visible.forEach((r) => {
    const tr = document.createElement('tr'); 
    tr.className = 'transition hover:bg-white/[.025]';

    // Index Cell
    tr.append(makeCell(String(r.index ?? '—'), 'px-6 py-4 text-slate-500 tabular-nums'));

    // Reference No Cell with class "tx" and Copy Button
    const refCell = document.createElement('td');
    refCell.className = 'px-6 py-4 font-medium text-white tx';
    
    const refContainer = document.createElement('div');
    refContainer.className = 'flex items-center gap-2';
    
    const refText = document.createElement('span');
    refText.textContent = safeText(r.reference) || '—';
    refContainer.append(refText);

    if (r.reference) {
      const copyBtn = document.createElement('button');
      copyBtn.type = 'button';
      copyBtn.className = 'rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-medium text-slate-300 transition hover:bg-white/20 hover:text-white';
      copyBtn.textContent = 'Copy';
      copyBtn.title = 'Copy Reference No';
      copyBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(safeText(r.reference));
        copyBtn.textContent = 'Copied!';
        setTimeout(() => { copyBtn.textContent = 'Copy'; }, 1500);
      });
      refContainer.append(copyBtn);
    }
    refCell.append(refContainer);
    tr.append(refCell);

    // Amount Cell (Text align right & custom color)
    tr.append(makeCell(money(r.amount), 'px-6 py-4 text-right font-semibold text-emerald-400 tabular-nums'));

    // Image Link Cell
    const imgCell = document.createElement('td'); 
    imgCell.className = 'px-6 py-4';
    if (r.image && /^https?:\/\//i.test(String(r.image))) { 
      const a = document.createElement('a'); 
      a.href = String(r.image); 
      a.target = '_blank'; 
      a.rel = 'noopener noreferrer'; 
      a.textContent = 'View image ↗'; 
      a.className = 'font-medium text-indigo-300 transition hover:text-indigo-200'; 
      imgCell.append(a); 
    } else { 
      const s = document.createElement('span'); 
      s.textContent = '—'; 
      s.className = 'text-slate-600'; 
      imgCell.append(s); 
    } 
    tr.append(imgCell);

    // Status Cell
    const status = makeCell(TARGET_STATUS, 'px-6 py-4'); 
    status.innerHTML = '<span class="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/15 bg-emerald-400/[.07] px-2.5 py-1 text-[11px] font-semibold tracking-wide text-emerald-300"><span class="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>ALREADY FOLLOW UP</span>'; 
    tr.append(status);

    // Details Button Cell
    const action = document.createElement('td'); 
    action.className = 'px-6 py-4 text-right'; 
    const button = document.createElement('button'); 
    button.className = 'rounded-lg border border-white/[.09] bg-white/[.03] px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:border-indigo-400/30 hover:bg-indigo-400/[.08] hover:text-indigo-200'; 
    button.textContent = 'Details'; 
    button.addEventListener('click', () => openDetails(r)); 
    action.append(button); 
    tr.append(action);

    body.append(tr);
  });

  $('resultCount').textContent = visible.length ? `Showing ${visible.length} of ${records.length} transactions` : '0 transactions';
  $('emptyState').classList.toggle('hidden', visible.length !== 0);
  if (!visible.length && records.length && query) { 
    $('emptyTitle').textContent = 'No matching transactions';$('emptyText').textContent = 'Try a different reference number or amount.'; 
  } else if (!records.length) { 
    $('emptyTitle').textContent = 'No follow-up transactions found';$('emptyText').textContent = allRows.length ? 'The source files loaded, but none have the required status.' : 'Add the JSON files beside this page, then refresh.'; 
  }
}

function openDetails(r) {
  $('dialogTitle').textContent = `${safeText(r.reference) || 'Transaction'} · ${r.source}`;
  const grid = $('detailGrid'); grid.replaceChildren();
  r.fields.forEach(([key, value]) => {
    const card = document.createElement('div'); 
    card.className = 'min-w-0 rounded-xl border border-white/[.06] bg-white/[.025] p-3.5';
    const label = document.createElement('div'); 
    label.className = 'mb-1.5 text-[10px] font-semibold uppercase tracking-[.12em] text-slate-500'; 
    label.textContent = fieldLabel(key);
    const val = document.createElement('div'); 
    val.className = 'break-words text-sm leading-5 text-slate-200';
    const str = safeText(value); 
    if (/^https?:\/\//i.test(str)) { 
      const a = document.createElement('a'); 
      a.href = str; 
      a.target = '_blank'; 
      a.rel = 'noopener noreferrer'; 
      a.textContent = str; 
      a.className = 'text-indigo-300 underline decoration-indigo-300/30 underline-offset-2 hover:text-indigo-200'; 
      val.append(a); 
    } else val.textContent = str || '—';
    card.append(label, val); 
    grid.append(card);
  });
  $('detailsDialog').showModal();
}

async function loadData() {
  $('refreshBtn').disabled = true; 
  $('refreshIcon').classList.add('animate-spin');$('resultCount').textContent = 'Loading records…';

  const results = await Promise.all(FILES.map(async file => {
    try { 
      const response = await fetch(file, { cache: 'no-store' }); 
      if (!response.ok) throw new Error(`HTTP ${response.status}`); 
      const json = await response.json(); 
      if (!Array.isArray(json)) throw new Error('Expected a JSON array'); 
      return { file, json, error: null }; 
    } catch (error) { 
      return { file, json: [], error: error.message }; 
    }
  }));

  records = []; allRows = []; let loaded = 0;

  for (const result of results) {
    if (result.error) continue; 
    loaded++;
    const entries = result.json; 
    const header = entries.find(item => Number(item?.index) === 1) || entries[0];
    const headers = Array.isArray(header?.rowData) ? header.rowData : [];
    const statusIndex = headers.findIndex(h => normalize(h) === 'STATUS');
    if (statusIndex < 0) continue;

    for (const item of entries) {
      if (!Array.isArray(item?.rowData) || item === header) continue;
      const row = item.rowData;
      const fields = headers.map((name, i) => [fieldLabel(name), row[i] ?? '']);
      allRows.push({ source: result.file, index: item.index, fields });

      if (normalize(row[statusIndex]) !== TARGET_STATUS) continue;
      const at = (name) => { const i = headers.findIndex(h => normalize(h) === name); return i < 0 ? '' : row[i] ?? ''; };
      records.push({
        source: result.file,
        index: item.index,
        fields,
        reference: at('REFERENCE NO'),
        amount: at('AMOUNT'),
        image: at('IMAGE LINK'),
        status: at('STATUS')
      });
    }
  }

  $('countStat').textContent = records.length.toLocaleString();
  const total = records.reduce((sum, r) => { const n = Number(String(r.amount).replace(/,/g, '')); return sum + (Number.isFinite(n) ? n : 0); }, 0);
  $('amountStat').textContent = total.toLocaleString(undefined, { maximumFractionDigits: 2 });$('sourceStat').textContent = `${loaded} / ${FILES.length}`;
  $('sourceNote').textContent = loaded === FILES.length ? 'all JSON files loaded' : `${FILES.length - loaded} file${FILES.length - loaded === 1 ? '' : 's'} unavailable`;
  $('lastUpdated').textContent = `Updated ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  $('refreshBtn').disabled = false; 
  $('refreshIcon').classList.remove('animate-spin'); 
  renderRows();
}

$('refreshBtn').addEventListener('click', loadData);
$('searchInput').addEventListener('input', renderRows);$('closeDialog').addEventListener('click', () => $('detailsDialog').close());$('doneDialog').addEventListener('click', () => $('detailsDialog').close());$('detailsDialog').addEventListener('click', e => { if (e.target === $('detailsDialog'))$('detailsDialog').close(); });

loadData();
