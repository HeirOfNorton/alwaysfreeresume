// Site code goes here

function createRandomString(length) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function blankContact(title, preskip) {
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

function blankSummary(title, preskip) {
    return {
        skipped: preskip,
        title: title,
        contents: ''
    };
}

function addListItem(list, idx) {
    list.items.splice(idx, 0, {
        contents: '',
        key: createRandomString(20)
    });
}

function delItem(list, idx) {
    list.items.splice(idx, 1);
}

function blankList(title, preskip) {
    var lst = {
        skipped: preskip,
        title: title,
        items: [],
    };
    addListItem(lst, 0);
    return lst;
}

function addFullItem(list, idx) {
    var newitem = {
        key: createRandomString(20),
        title: '',
        org: '',
        loc: '',
        dates: {
            start: '',
            end: '',
            current: false
        },
        subitems: [{
            contents: '',
            key: createRandomString(20)
        }]
    };
    list.items.push(newitem);
}

function addSubItem(list, itemidx, subidx) {
    list.items[itemidx].subitems.splice(
        subidx, 0, {
            contents: '',
            key: createRandomString(20)
        }
    );
}

function delSubItem(list, itemidx, subidx) {
    list.items[itemidx].subitems.splice(subidx, 1);
}

function blankItems(title, preskip, subtitle) {
    var itemlist = {
        skipped: preskip,
        title: title,
        subtitle: subtitle,
        items: []
    }
    addFullItem(itemlist);
    return itemlist;
}

function blankPhoto(title, preskip) {
    return {
        skipped: preskip,
        title: title,
    };
}

function blankForm(title, preskip, subtitle='') {
    switch (title) {
        case 'Contact':
            return blankContact(title, preskip);
            break;
        case 'Summary':
            return blankSummary(title, preskip);
            break;
        case 'Photograph':
            return blankPhoto(title, preskip);
            break;
        case 'Skills':
        case 'Languages':
            return blankList(title, preskip);
            break;
        case 'Experience':
        case 'Education':
        case 'Professional Skills':
        case 'Projects':
        case 'Activities':
        case 'Certifications':
        case 'Awards':
            return blankItems(title, preskip, subtitle);
        default:
            alert('Something went wrong here');
    }
}

document.addEventListener('alpine:init', () => {
    //Alpine.store('mylocalkey', {
    //    txt: Alpine.$persist({inner: 'Blank'}).as('mylocalkey'),
    //})
});
