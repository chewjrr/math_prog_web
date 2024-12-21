export function startPrac4(container) {
    container.innerHTML = `
        <div class="calc-box">
            <div class="display" id="display"></div>
                <button class="button" onclick="onButtonClick('DEC')">DEC</button>
                <button class="button" onclick="onButtonClick('OCT')">OCT</button>
                <button class="button" onclick="onButtonClick('HEX')">HEX</button>
                <button class="button" onclick="onButtonClick('BIN')">BIN</button>

                <button class="button" onclick="onButtonClick('sin')">sin</button>
                <button class="button" onclick="onButtonClick('cos')">cos</button>
                <button class="button" onclick="onButtonClick('tan')">tan</button>
                <button class="button" onclick="onButtonClick('π')">π</button>

                <button class="button" onclick="onButtonClick('sin⁻¹')">sin⁻¹</button>
                <button class="button" onclick="onButtonClick('cos⁻¹')">cos⁻¹</button>
                <button class="button" onclick="onButtonClick('tan⁻¹')">tan⁻¹</button>
                <button class="button" onclick="onButtonClick('e')">e</button>

                <button class="button" onclick="onButtonClick('10^x')">10^x</button>
                <button class="button" onclick="onButtonClick('x²')">x²</button>
                <button class="button" onclick="onButtonClick('x³')">x³</button>
                <button class="button" onclick="onButtonClick('shift')">a^x</button>
                
                <button class="button" onclick="onButtonClick('1')">1</button>
                <button class="button" onclick="onButtonClick('2')">2</button>
                <button class="button" onclick="onButtonClick('3')">3</button>
                <button class="button" onclick="onButtonClick('+')">+</button>

                <button class="button" onclick="onButtonClick('4')">4</button>
                <button class="button" onclick="onButtonClick('5')">5</button>
                <button class="button" onclick="onButtonClick('6')">6</button>
                <button class="button" onclick="onButtonClick('-')">-</button>
            
                <button class="button" onclick="onButtonClick('7')">7</button>
                <button class="button" onclick="onButtonClick('8')">8</button>
                <button class="button" onclick="onButtonClick('9')">9</button>
                <button class="button" onclick="onButtonClick('*')">*</button>

                <button class="button" onclick="onButtonClick('MR')">MR</button>
                <button class="button" onclick="onButtonClick('0')">0</button>    
                <button class="button" onclick="onButtonClick('CE')">CE</button>
                <button class="button" onclick="onButtonClick('.')">.</button>

                <button class="button" onclick="onButtonClick('=')" style="grid-column: span 2; grid-row: span 2;">=</button>
                <button class="button" onclick="onButtonClick('deg')">deg</button>                   
                <button class="button" onclick="onButtonClick('gra')">gra</button>
                <button class="button" onclick="onButtonClick('M+')">M+</button>
                <button class="button" onclick="onButtonClick('M-')">M-</button>
        </div>
    `;

    let expression = "";
    let memory = [0, 0, 0];
    let currentMemory = 0;
    let angleMode = 'deg';

    const display = document.getElementById('display');

    window.onButtonClick = function (char) {
        if (char === '=') {
            try {
                expression = eval(expression).toString();
            } catch (e) {
                alert("Error: " + e.message);
                expression = "";
            }
        } else if (char === 'M+') {
            memory[currentMemory] += eval(expression);
        } else if (char === 'M-') {
            memory[currentMemory] -= eval(expression);
        } else if (char === 'MR') {
            expression = memory[currentMemory].toString();
        } else if (char === 'AC') {
            expression = "";
        } else if (char === 'shift') {
            expression += '**';
        } else if (char === 'deg' || char === 'rad' || char === 'gra') {
            angleMode = char;
        } else if (['sin', 'cos', 'tan', 'sin⁻¹', 'cos⁻¹', 'tan⁻¹', 'ln', 'log', 'x²', '10^x', 'x³', 'sqrt', 'inv'].includes(char)) {
            expression = handleFunctions(char);
        } else {
            expression += char;
        }

        display.textContent = expression;
    };

    function handleFunctions(functionChar) {
        try {
            let value = eval(expression);
            if (functionChar === 'sin') {
                return mathFunction(value, Math.sin, angleMode);
            } else if (functionChar === 'cos') {
                return mathFunction(value, Math.cos, angleMode);
            } else if (functionChar === 'tan') {
                return mathFunction(value, Math.tan, angleMode);
            } else if (functionChar === 'sin⁻¹') {
                return Math.asin(value).toString();
            } else if (functionChar === 'cos⁻¹') {
                return Math.acos(value).toString();
            } else if (functionChar === 'tan⁻¹') {
                return Math.atan(value).toString();
            } else if (functionChar === 'ln') {
                return Math.log(value).toString();
            } else if (functionChar === 'log') {
                return Math.log10(value).toString();
            } else if (functionChar === 'x²') {
                return Math.pow(value, 2).toString();
            } else if (functionChar === '10^x') {
                return Math.pow(10, value).toString();
            } else if (functionChar === 'x³') {
                return Math.pow(value, 3).toString();
            } else if (functionChar === 'sqrt') {
                return Math.sqrt(value).toString();
            } else if (functionChar === 'inv') {
                return (1 / value).toString();
            } else if (functionChar === 'π') {
                return Math.PI.toString();
            } else if (functionChar === 'e') {
                return Math.E.toString();
            }
        } catch (e) {
            alert("Error: " + e.message);
            return "";
        }
    }

    function mathFunction(value, func, mode) {
        if (mode === 'deg') {
            return func(value * Math.PI / 180).toString();
        } else if (mode === 'gra') {
            return func(value * Math.PI / 200).toString();
        } else {
            return func(value).toString();
        }
    }
}
