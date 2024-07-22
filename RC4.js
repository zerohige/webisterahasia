function saveNote() {
    var note = document.getElementById("noteInput").value;
    var fileName = prompt("Masukkan nama file (dengan format txt):");
    if (fileName) {
        var encryptedNote = RC4Encrypt(note, "yourSecretKey"); 
        var blob = new Blob([encryptedNote], {type: "text/plain;charset=utf-8"}); 
        saveAs(blob, fileName); 
        document.getElementById("message").innerText = "Catatan disimpan sebagai " + fileName; 
    }
}

function viewNote() {
    var fileInput = document.createElement("input"); 
    fileInput.type = "file"; 
    fileInput.accept = ".txt"; 
    fileInput.addEventListener("change", function(event) {
        var file = event.target.files[0]; 
        var reader = new FileReader(); 
        reader.onload = function() { 
            var encryptedNote = reader.result;
            var decryptedNote = RC4Decrypt(encryptedNote, "yourSecretKey"); 
            alert("Pesan yang didekripsi:\n" + decryptedNote); 
        };
        reader.readAsText(file); 
    });
    fileInput.click(); 
}

function RC4Encrypt(plaintext, key) {
    var S = [];
    var K = [];
    var ciphertext = '';
    var keyLength = key.length;

    for (var i = 0; i < 256; i++) {
        S[i] = i;
        K[i] = key.charCodeAt(i % keyLength);
    }

    var j = 0;
    for (var i = 0; i < 256; i++) {
        j = (j + S[i] + K[i]) % 256;
        // Tukar S[i] dan S[j]
        var temp = S[i];
        S[i] = S[j];
        S[j] = temp;
    }

    var i = 0;
    var j = 0;
    for (var k = 0; k < plaintext.length; k++) {
        i = (i + 1) % 256;
        j = (j + S[i]) % 256;
        var temp = S[i];
        S[i] = S[j];
        S[j] = temp;
        var keystreamIndex = (S[i] + S[j]) % 256;
        var keystreamChar = S[keystreamIndex];
        ciphertext += String.fromCharCode(plaintext.charCodeAt(k) ^ keystreamChar);
    }

    return ciphertext;
}

function RC4Decrypt(ciphertext, key) {
    var S = [];
    var K = [];
    var plaintext = '';
    var keyLength = key.length;

    for (var i = 0; i < 256; i++) {
        S[i] = i;
        K[i] = key.charCodeAt(i % keyLength);
    }

    var j = 0;
    for (var i = 0; i < 256; i++) {
        j = (j + S[i] + K[i]) % 256;
        var temp = S[i];
        S[i] = S[j];
        S[j] = temp;
    }


    var i = 0;
    var j = 0;
    for (var k = 0; k < ciphertext.length; k++) {
        i = (i + 1) % 256;
        j = (j + S[i]) % 256;
        var temp = S[i];
        S[i] = S[j];
        S[j] = temp;
        var keystreamIndex = (S[i] + S[j]) % 256;
        var keystreamChar = S[keystreamIndex];
        plaintext += String.fromCharCode(ciphertext.charCodeAt(k) ^ keystreamChar);
    }

    return plaintext;
}

var saveAs = function(blob, filename) {
    var link = document.createElement("a");
    if (typeof link.download === "string") {
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } else {
        window.open(blob);
    }
};
