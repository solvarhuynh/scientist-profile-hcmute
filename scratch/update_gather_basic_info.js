const fs = require('fs');
const filePath = 'd:\\khanh\\Index.html';

let content = fs.readFileSync(filePath, 'utf8');

// Update gatherBasicInfoFromDOM
const oldGatherRegex = /function gatherBasicInfoFromDOM\(\) \{[\s\S]*?if \(boMonSel\) appData\.basicInfo\.donViBoMon = boMonSel\.value;\s*\}/;

const newGather = `function gatherBasicInfoFromDOM() {
    if (!appData.basicInfo) appData.basicInfo = {};
    var nameEl = document.getElementById('nameInput');
    if (nameEl) appData.basicInfo.name = nameEl.value.trim();

    var radNam = document.getElementById('genderNam');
    var radNu = document.getElementById('genderNu');
    if (radNam && radNu) {
        appData.basicInfo.genderNam = radNam.checked;
        appData.basicInfo.genderNu = radNu.checked;
        if (radNam.checked) appData.basicInfo.gioiTinh = 'Nam';
        else if (radNu.checked) appData.basicInfo.gioiTinh = 'Nữ';
        else appData.basicInfo.gioiTinh = '';
    }

    var fields = ['dob', 'noiSinh', 'queQuan', 'danToc', 'chucVu', 'donVi', 'diaChi', 'cq', 'nr', 'dd', 'fax', 'cccd', 'ngayCap', 'noiCap'];
    fields.forEach(function(f) {
        var el = document.getElementById(f + 'Input');
        if (el) appData.basicInfo[f] = el.value.trim();
    });

    var emailEl = document.getElementById('emailInput');
    if (emailEl && emailEl.value.trim()) appData.basicInfo.email = emailEl.value.trim();

    var truongSel = document.getElementById('donViTruongSelect');
    var khoaSel = document.getElementById('donViKhoaSelect');
    var boMonSel = document.getElementById('donViBoMonSelect');
    if (truongSel && truongSel.value) appData.basicInfo.donViTruong = truongSel.value;
    if (khoaSel && khoaSel.value) {
        appData.basicInfo.donViKhoa = khoaSel.value;
        appData.basicInfo.khoa = khoaSel.value;
    }
    if (boMonSel && boMonSel.value) {
        appData.basicInfo.donViBoMon = boMonSel.value;
        appData.basicInfo.boMon = boMonSel.value;
    }
}`;

if (!oldGatherRegex.test(content)) {
  console.error("oldGatherRegex not matched!");
  process.exit(1);
}
content = content.replace(oldGatherRegex, newGather);
console.log("Updated gatherBasicInfoFromDOM successfully!");

// Update toggleEditSave
const oldToggleEditSaveRegex = /function toggleEditSave\(\) \{[\s\S]*?isEditing = false;\s*\}\s*\}/;

const newToggleEditSave = `function toggleEditSave() {
      var form = document.getElementById('basic-info-form');
      var basicInputs = form ? form.querySelectorAll('input') : document.querySelectorAll('.basic-info-input');
      var selects = form ? form.querySelectorAll('select') : document.querySelectorAll('#thong-tin-co-ban select');
      var editBtn = document.getElementById('editBtn');
      var editBtnText = document.getElementById('editBtnText');
      var editIcon = document.getElementById('editIcon');
      
      if (!isEditing) {
        for(var i=0; i<basicInputs.length; i++) {
            if (basicInputs[i].type === 'radio') basicInputs[i].removeAttribute('disabled'); 
            else if (basicInputs[i].id !== 'emailInput') basicInputs[i].removeAttribute('readonly');
        }
        for(var s=0; s<selects.length; s++) selects[s].removeAttribute('disabled');
        
        if (editBtnText) editBtnText.innerText = "Lưu";
        if (editIcon) editIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>';
        if (editBtn) {
            editBtn.classList.remove('bg-amber-400', 'hover:bg-amber-500', 'text-slate-900');
            editBtn.classList.add('bg-emerald-600', 'hover:bg-emerald-700', 'text-white');
        }
        isEditing = true;
      } else {
        gatherBasicInfoFromDOM();
        saveToDatabase();
        updateWelcomeMessage();
        if (typeof renderUserOverview === 'function') renderUserOverview();
        showToast("Đã lưu thông tin cơ bản!", "success");
        if (typeof google !== 'undefined' && google.script && google.script.run) {
             var em = document.getElementById('emailInput') ? document.getElementById('emailInput').value : '';
             if (em) google.script.run.syncAllDataToSheets(em, appData, true);
        }
        for(var j=0; j<basicInputs.length; j++) {
            if (basicInputs[j].type === 'radio') basicInputs[j].setAttribute('disabled', 'true'); 
            else basicInputs[j].setAttribute('readonly', 'true');
        }
        for(var k=0; k<selects.length; k++) selects[k].setAttribute('disabled', 'true');
        
        if (editBtnText) editBtnText.innerText = "Chỉnh sửa";
        if (editIcon) editIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>';
        if (editBtn) {
            editBtn.classList.remove('bg-emerald-600', 'hover:bg-emerald-700', 'text-white');
            editBtn.classList.add('bg-amber-400', 'hover:bg-amber-500', 'text-slate-900');
        }
        isEditing = false;
      }
    }`;

if (!oldToggleEditSaveRegex.test(content)) {
  console.error("oldToggleEditSaveRegex not matched!");
  process.exit(1);
}
content = content.replace(oldToggleEditSaveRegex, newToggleEditSave);
console.log("Updated toggleEditSave successfully!");

fs.writeFileSync(filePath, content, 'utf8');
console.log("Saved all updates!");

