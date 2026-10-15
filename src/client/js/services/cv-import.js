// =========================================================================
// CV IMPORT & EXTRACTION ENGINE (DUAL-TIER: ALTCHUNK DOCX + OPENXML + JSON)
// =========================================================================

function extractHtmlFromAltChunkDocx(buffer) {
  try {
    var u8 = new Uint8Array(buffer);
    var pos = 0;
    var rawMht = '';
    while (pos < u8.length - 30) {
      if (u8[pos] === 0x50 && u8[pos+1] === 0x4B && u8[pos+2] === 0x03 && u8[pos+3] === 0x04) {
        var compSize = (u8[pos + 18]) | (u8[pos + 19] << 8) | (u8[pos + 20] << 16) | (u8[pos + 21] << 24);
        var fnLen = u8[pos + 26] | (u8[pos + 27] << 8);
        var extraLen = u8[pos + 28] | (u8[pos + 29] << 8);
        var filename = '';
        for (var i = 0; i < fnLen; i++) filename += String.fromCharCode(u8[pos + 30 + i]);
        var dataStart = pos + 30 + fnLen + extraLen;
        if (filename.includes('afchunk.mht') || filename.includes('document.html') || filename.includes('afchunk')) {
          var slice = u8.subarray(dataStart, dataStart + compSize);
          rawMht = new TextDecoder('utf-8').decode(slice);
          break;
        }
        pos = dataStart + compSize;
      } else {
        pos++;
      }
    }

    if (rawMht) {
      var htmlStart = rawMht.indexOf('<!DOCTYPE html>');
      if (htmlStart === -1) htmlStart = rawMht.indexOf('<html');
      if (htmlStart !== -1) {
        return rawMht.substring(htmlStart).replace(/=\r?\n/g, '').replace(/=3D/gi, '=');
      }
    }
  } catch (err) {
    console.warn('extractHtmlFromAltChunkDocx error:', err);
  }
  return '';
}

function handleImportFileUpload() {
  var fileInput = document.getElementById('cvFileInput');
  if (!fileInput || !fileInput.files || !fileInput.files[0]) {
    alert('Vui lòng chọn tệp tin .JSON hoặc .DOCX để bắt đầu trích xuất!');
    return;
  }
  
  var file = fileInput.files[0];
  var fileName = file.name.toLowerCase();

  var reader = new FileReader();
  reader.onload = function(e) {
    var buffer = e.target.result;

    // 1. Tệp .json
    if (fileName.endsWith('.json')) {
      try {
        var str = new TextDecoder("utf-8").decode(buffer);
        var parsed = JSON.parse(str);
        window.parsedImportDataCache = parsed;
        openImportPreviewModal(parsed);
        return;
      } catch(err) {
        alert('Không thể đọc cấu trúc tệp tin JSON: ' + err.message);
        return;
      }
    }

    // 2. Tệp .docx (Kiểm tra mã Magic Zip PK\x03\x04)
    var uint8 = new Uint8Array(buffer.slice(0, 4));
    var isPkZip = (uint8[0] === 0x50 && uint8[1] === 0x4B && uint8[2] === 0x03 && uint8[3] === 0x04);

    if (isPkZip) {
      // 2.1 Kiểm tra xem file có khối AltChunk HTML chuẩn (afchunk.mht) không
      var altChunkHtml = extractHtmlFromAltChunkDocx(buffer);
      if (altChunkHtml && altChunkHtml.length > 50) {
        var parsed = parseCvFromHtml(altChunkHtml, file.name);
        window.parsedImportDataCache = parsed;
        openImportPreviewModal(parsed);
        return;
      }

      // 2.2 Nếu là file docx chuẩn OpenXML desktop (có word/document.xml) -> Dùng mammoth
      if (typeof mammoth !== 'undefined') {
        mammoth.convertToHtml({ arrayBuffer: buffer }).then(function(result) {
          var htmlVal = result && result.value ? result.value.trim() : '';
          if (htmlVal && htmlVal.length > 30) {
            var parsed = parseCvFromHtml(htmlVal, file.name);
            window.parsedImportDataCache = parsed;
            openImportPreviewModal(parsed);
            return;
          }
          fallbackDecode(buffer, file.name);
        }).catch(function(err) {
          console.warn('Mammoth báo lỗi, thử giải mã UTF-8 trực tiếp:', err);
          fallbackDecode(buffer, file.name);
        });
        return;
      }
    }
    fallbackDecode(buffer, file.name);
  };

  function fallbackDecode(buf, originalName) {
    try {
      var decoder = new TextDecoder("utf-8");
      var textContent = decoder.decode(buf);

      var trimmed = textContent.trim();
      if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
        try {
          var jParsed = JSON.parse(trimmed);
          if (jParsed.thongTinCoBan || jParsed.basicInfo || jParsed.quaTrinhDaoTao) {
            window.parsedImportDataCache = jParsed;
            openImportPreviewModal(jParsed);
            return;
          }
        } catch(e) {}
      }

      var parsed = parseCvFromHtml(textContent, originalName);
      window.parsedImportDataCache = parsed;
      openImportPreviewModal(parsed);
    } catch(err) {
      console.error('Lỗi giải mã file:', err);
      var fb = createFallbackParsedData(originalName);
      window.parsedImportDataCache = fb;
      openImportPreviewModal(fb);
    }
  }

  reader.readAsArrayBuffer(file);
}
