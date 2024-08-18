// Site code goes here

function createRandomString(length) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function blankContact(title, preskip=false) {
    return {
        skipped: preskip,
        title: title,
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

function blankSummary(title, preskip=false) {
    return {
        skipped: preskip,
        title: title,
        contents: ''
    };
}

function blankList(title, preskip=false) {
    var lst = {
        skipped: preskip,
        title: title,
        items: [],
        addItem: function (idx=-1) {
            this.items.splice(idx, 0, {
                contents: '',
                key: createRandomString(20)
            });
        },
        delItem: function (idx) {
            this.items.splice(idx, 1);
        }
    };
    lst.addItem();
    return lst;
}

function blankItems(title, preskip=false) {
    return {
        skipped: preskip,
        title: title,
    };
}

function blankPhoto(title, preskip=false) {
    return {
        skipped: preskip,
        title: title,
    };
}

document.addEventListener('alpine:init', () => {
    //Alpine.store('mylocalkey', {
    //    txt: Alpine.$persist({inner: 'Blank'}).as('mylocalkey'),
    //})
});
