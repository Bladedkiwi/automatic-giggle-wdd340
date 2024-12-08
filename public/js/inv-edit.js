const form = document.querySelector('#editForm')
form.addEventListener('change', (e) => {
    const editBtn = document.querySelector('button')
    editBtn.removeAttribute('disabled');
});