const buttons = document.querySelectorAll('.plan button')
console.log(buttons);

buttons.forEach(button => {
    console.log(button);
    button.addEventListener('click', () => {
        window.location.href = "./index.html";
    })
});