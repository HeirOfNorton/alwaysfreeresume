// Site code goes here


document.addEventListener('alpine:init', () => {
    Alpine.store('mylocalkey', Alpine.$persist('Nothing here yet.').as('mylocalkey'));
});
