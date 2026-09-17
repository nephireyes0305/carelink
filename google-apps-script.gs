/**
 * Carelink Google Apps Script backend starter.
 * Deploy as Web App after connecting this script to the Carelink Google Sheet.
 * IMPORTANT: Use a real authentication provider / password hashing strategy in production.
 */
const SS = SpreadsheetApp.getActive();

function json(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const body = JSON.parse(e.postData.contents || "{}");
  switch (body.action) {
    case "validateCode": return json(validateRegistrationCode(body.code));
    case "registerMember": return json(registerMember(body));
    case "addDependent": return json(addDependent(body.memberId, body.dependent));
    default: return json({ok:false, error:"Unknown action"});
  }
}

function validateRegistrationCode(code) {
  const sh = SS.getSheetByName("Registration Codes");
  const rows = sh.getDataRange().getValues();
  for (let i=1;i<rows.length;i++) {
    if (String(rows[i][0]).trim().toUpperCase() === String(code).trim().toUpperCase()) {
      return {ok: rows[i][2] === "Active" && !rows[i][3], row:i+1};
    }
  }
  return {ok:false};
}

function registerMember(data) {
  const check = validateRegistrationCode(data.code);
  if (!check.ok) return {ok:false,error:"Invalid or used registration code"};

  const members = SS.getSheetByName("Members");
  const memberId = "CL-" + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyyMMddHHmmss");
  const registered = new Date();

  members.appendRow([
    memberId, data.username, data.name, data.address, data.phone, data.phone2 || "",
    data.email, data.birthdate, data.gender, data.code, registered,
    new Date(registered.getTime()+30*86400000),
    new Date(registered.getTime()+120*86400000),
    new Date(registered.getTime()+180*86400000),
    "Active"
  ]);

  const codes = SS.getSheetByName("Registration Codes");
  codes.getRange(check.row, 4).setValue(true);
  codes.getRange(check.row, 5).setValue(memberId);
  codes.getRange(check.row, 6).setValue(new Date());

  (data.dependents || []).forEach(dep => addDependent(memberId, dep));
  return {ok:true, memberId:memberId};
}

function addDependent(memberId, dep) {
  // Date Added is always generated server-side and is never accepted from the member.
  const sh = SS.getSheetByName("Dependents");
  const added = new Date();
  const dependentId = "DEP-" + Utilities.getUuid().slice(0,8).toUpperCase();
  sh.appendRow([
    dependentId, memberId, dep.name, dep.relationship, dep.birthdate, dep.gender,
    added,
    new Date(added.getTime()+30*86400000),
    new Date(added.getTime()+120*86400000),
    new Date(added.getTime()+180*86400000),
    "Active"
  ]);
  return {ok:true, dependentId:dependentId};
}

/* OTP sending is intentionally not implemented here yet.
   SMS requires an SMS provider. Email OTP can be added using MailApp/GmailApp,
   with expiring OTP records stored in the OTP Logs sheet. */
