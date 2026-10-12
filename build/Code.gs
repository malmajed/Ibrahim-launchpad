// Ibrahim's Launchpad — Google Sheet backend (v5: single user, adapted from Launchpad v4)
// The secret is NOT stored in this file. Set it once in the Apps Script editor:
//   Project Settings → Script properties → Add property:  SECRET = <your secret>
// After any code change: Deploy → New deployment (editing an existing deployment does not pick up new code).
const PHOTO_FOLDER = "Ibrahim's Launchpad Photos";
const CHUNK = 40000; // a Sheets cell holds at most 50,000 characters

function secret() { return PropertiesService.getScriptProperties().getProperty('SECRET') || ''; }
function authed(k) { const s = secret(); return s && k === s; }

function doGet(e) {
  if (!e.parameter || !authed(e.parameter.key)) return out({ error: 'bad key' });
  return out({ state: readState() });
}

function doPost(e) {
  let body;
  try { body = JSON.parse(e.postData.contents); } catch (err) { return out({ error: 'bad json' }); }
  if (!authed(body.key)) return out({ error: 'bad key' });

  // --- photo upload from the mission notebook
  if (body.photo) {
    const m = body.photo.match(/^data:(image\/\w+);base64,(.+)$/);
    if (!m) return out({ error: 'bad image' });
    const name = Utilities.formatDate(new Date(), 'Asia/Riyadh', 'yyyy-MM-dd HH-mm') + ' ' + (body.name || body.mission || 'photo') + '.jpg';
    const file = getFolder().createFile(Utilities.newBlob(Utilities.base64Decode(m[2]), m[1], name));
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    logSheet().appendRow([new Date(), 'photo', body.mission || '', file.getUrl()]);
    return out({ ok: true, url: file.getUrl(), id: file.getId() });
  }

  // --- progress state
  const lock = LockService.getScriptLock();
  lock.waitLock(8000);
  try {
    const st = body.state || {};
    writeState(st, body.device);
    const props = PropertiesService.getScriptProperties();
    const last = Number(props.getProperty('last_log') || 0);
    const fresh = (st.log || []).filter(x => x.t > last);
    if (fresh.length) {
      const log = logSheet();
      log.getRange(log.getLastRow() + 1, 1, fresh.length, 4).setValues(fresh.map(x => [new Date(x.t), x.type, x.mod, x.detail || '']));
      props.setProperty('last_log', String(Math.max.apply(null, fresh.map(x => x.t))));
    }
    writeSummary(st);
  } finally { lock.releaseLock(); }
  return out({ ok: true });
}

// ---- state stored as chunks down column A of the "state" sheet
function writeState(st, device) {
  const sh = sheet('state');
  const s = JSON.stringify(st);
  const parts = [];
  for (let i = 0; i < s.length; i += CHUNK) parts.push([s.slice(i, i + CHUNK)]);
  sh.clear();
  sh.getRange(1, 1, parts.length, 1).setValues(parts);
  sh.getRange('B1').setValue(new Date());
  sh.getRange('C1').setValue(device || '');
}
function readState() {
  const sh = sheet('state');
  const n = sh.getLastRow();
  if (!n) return null;
  const vals = sh.getRange(1, 1, n, 1).getValues().map(r => r[0]).join('');
  try { return vals ? JSON.parse(vals) : null; } catch (e) { return null; }
}

// ---- human-readable summary of missions (for looking at the Sheet directly)
function writeSummary(st) {
  const sum = sheet('summary');
  sum.clear();
  const rows = [['Mission', 'Status', 'Best score %', 'Attempts', 'XP', 'Time (min)', 'Last activity']];
  Object.keys(st.progress || {}).sort().forEach(id => {
    const p = st.progress[id];
    rows.push([id, p.status, Math.round((p.best || 0) * 100), p.attempts || 0, p.xp || 0, Math.round(((st.time || {})[id] || 0) / 60), p.updated ? new Date(p.updated) : '']);
  });
  sum.getRange(1, 1, rows.length, rows[0].length).setValues(rows);
}

function logSheet() {
  const log = sheet('activity');
  if (log.getLastRow() === 0) log.appendRow(['Time', 'Type', 'Mission', 'Detail']);
  return log;
}
function getFolder() {
  const it = DriveApp.getFoldersByName(PHOTO_FOLDER);
  return it.hasNext() ? it.next() : DriveApp.createFolder(PHOTO_FOLDER);
}
function sheet(name) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName(name) || ss.insertSheet(name);
}
function out(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
