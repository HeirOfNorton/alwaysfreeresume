// Site code goes here


document.addEventListener('alpine:init', () => {
    Alpine.store('mylocalkey', {
        txt: Alpine.$persist({inner: 'Blank'}).as('mylocalkey'),
    })
});
