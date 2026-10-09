/**
 * faber-cut Upload-Helfer (Google Apps Script, läuft in deinem Google-Konto).
 *
 * faber-cut schickt Ordner und Dateinamen eines fertigen Videos ("Final geschnittene Videos", "<Titel>.mp4"); der
 * Helfer legt den Unterordner in deinem Drive-Ordner an, falls er fehlt, und gibt eine einmalige Upload-Adresse
 * zurück, über die faber-cut das Video direkt dort hineinlädt (Drive-Upload in Stücken, ohne Größengrenze). Einrichten: siehe skill-onboarding,
 * "Upload-Helfer"; danach `npm run hochladen -- <video> "<Titel>"`.
 *
 * Die Web-App-Adresse ist wie ein Schlüssel: wer sie hat, kann Dateien in diesen einen Ordner legen (nur dort,
 * nichts lesen oder löschen). Nicht veröffentlichen.
 */
const ORDNER_ID = '1EJHsyhXaywk0FT9WG-lki5FWHDHs0sRp'; // dein Drive-Ordner (drive.id in faber-cut.json)

function doPost(e) {
  const p = JSON.parse(e.postData.contents);
  const parent = DriveApp.getFolderById(ORDNER_ID);
  const it = parent.getFoldersByName(p.ordner);
  const folder = it.hasNext() ? it.next() : parent.createFolder(p.ordner);
  const res = UrlFetchApp.fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable&fields=id,name,webViewLink',
    {
      method: 'post',
      contentType: 'application/json; charset=UTF-8',
      headers: { Authorization: 'Bearer ' + ScriptApp.getOAuthToken(), 'X-Upload-Content-Type': p.mime || 'video/mp4' },
      payload: JSON.stringify({ name: p.name, parents: [folder.getId()] }),
    },
  );
  return ContentService.createTextOutput(JSON.stringify({ upload: res.getHeaders()['Location'], ordner: folder.getUrl() }))
    .setMimeType(ContentService.MimeType.JSON);
}
