function loadPrac(pracId) {
    const pracContainer = document.getElementById('prac-container');
    pracContainer.innerHTML = '';

    switch (pracId) {
        case '1-2':
            import('./prac1-2.js').then(module => {
                module.startPrac1_2(pracContainer);
            });
            break;
        case '3':
            import('./prac3.js').then(module => {
                module.startPrac3(pracContainer);
            });
            break;
        case '4':
            import('./prac4.js').then(module => {
                module.startPrac4(pracContainer);
            });
            break;
        case '5':
            import('./prac5.js').then(module => {
                module.startPrac5(pracContainer);
            });
            break;
        case '6':
            import('./prac6.js').then(module => {
                module.startPrac6(pracContainer);
            });
            break;
        case '7':
            import('./prac7.js').then(module => {
                module.startPrac7(pracContainer);
            });
            break;
        case '8':
            import('./prac8.js').then(module => {
                module.startPrac8(pracContainer);
            });
            break;
        case '9':
            import('./prac9.js').then(module => {
                module.startPrac9(pracContainer);
            });
            break;
        case '10':
            import('./prac10.js').then(module => {
                module.startPrac10(pracContainer);
            });
            break;
        case '11':
            import('./prac11.js').then(module => {
                module.startPrac11(pracContainer);
            });
            break;
        default:
            console.error('Prac not found');
    }
}
