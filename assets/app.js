// Site code goes here

function createRandomString(length) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function blankContact() {
    return {
        skipped: false,
        title: 'Contact',
        fullname: '',
        address: {
            line1: '',
            line2: '',
            city: '',
            state: '',
            zip: ''
        },
        phone: '',
        email: '',
        website: ''
    };
}

function blankSummary() {
    return {
        skipped: false,
        title: 'Summary',
        contents: ''
    };
}



document.addEventListener('alpine:init', () => {
    //Alpine.store('mylocalkey', {
    //    txt: Alpine.$persist({inner: 'Blank'}).as('mylocalkey'),
    //})
});
