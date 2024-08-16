// Site code goes here


document.addEventListener('alpine:init', () => {
    Alpine.store('mylocalkey', {
        txt: Whaa?; //Alpine.$persist('Nothing here yet.').as('mylocalkey');
    })
});
