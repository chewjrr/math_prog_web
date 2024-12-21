export function startPrac3(container) {
    container.innerHTML = `
        <div class="prac-boxes">
            <div class="prac-box" id="encrypt-box">
                <h2>Зашифровать</h2>
                <label for="input-text-encrypt">Ввод сообщения для зашифровки:</label>
                <input type="text" id="input-text-encrypt" />
                <div class="shift-container">
                    <label for="shift-encrypt">Сдвиг:</label>
                    <input type="number" id="shift-encrypt" style="width: 50px;" />
                </div>
                <button id="encrypt-button">Зашифровать</button>
                <label for="encrypted-text">Зашифрованное сообщение:</label>
                <input type="text" id="encrypted-text" readonly />
            </div>
            <div class="prac-box" id="decrypt-box">
                <h2>Расшифровать</h2>
                <label for="input-text-decrypt">Ввод сообщения для расшифровки:</label>
                <input type="text" id="input-text-decrypt" />
                <div class="shift-container">
                    <label for="shift-decrypt">Сдвиг:</label>
                    <input type="number" id="shift-decrypt" style="width: 50px;" />
                </div>
                <button id="decrypt-button">Расшифровать</button>
                <label for="decrypted-text">Расшифрованное сообщение:</label>
                <input type="text" id="decrypted-text" readonly />
            </div>
        </div>
    `;

    const inputTextEncrypt = document.getElementById('input-text-encrypt');
    const shiftEncrypt = document.getElementById('shift-encrypt');
    const encryptButton = document.getElementById('encrypt-button');
    const encryptedText = document.getElementById('encrypted-text');

    const inputTextDecrypt = document.getElementById('input-text-decrypt');
    const shiftDecrypt = document.getElementById('shift-decrypt');
    const decryptButton = document.getElementById('decrypt-button');
    const decryptedText = document.getElementById('decrypted-text');

    function caesarCipher(text, shift) {
        return text.split('').map(char => {
            if (char.match(/[а-яА-Я]/)) {
                const isUpperCase = char === char.toUpperCase();
                const base = isUpperCase ? 'А'.charCodeAt(0) : 'а'.charCodeAt(0);
                return String.fromCharCode((char.charCodeAt(0) - base + shift) % 32 + base);
            } else if (char.match(/[a-zA-Z]/)) {
                const isUpperCase = char === char.toUpperCase();
                const base = isUpperCase ? 'A'.charCodeAt(0) : 'a'.charCodeAt(0);
                return String.fromCharCode((char.charCodeAt(0) - base + shift) % 26 + base);
            }
            return char;
        }).join('');
    }

    encryptButton.addEventListener('click', () => {
        const text = inputTextEncrypt.value;
        const shift = parseInt(shiftEncrypt.value, 10);
        encryptedText.value = caesarCipher(text, shift);
    });

    decryptButton.addEventListener('click', () => {
        const text = inputTextDecrypt.value;
        const shift = parseInt(shiftDecrypt.value, 10);
        decryptedText.value = caesarCipher(text, -shift);
    });
}
