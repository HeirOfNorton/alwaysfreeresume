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

function delItem(list, idx) {
    list.items.splice(idx, 1);
}

function blankList(title, preskip) {
    var lst = {
        skipped: preskip,
        title: title,
        items: [''],
    };
    return lst;
}

function addFullItem(list) {
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
        subitems: ['']
    };
    list.items.push(newitem);
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
        //date: '',
        data: 'data:image/jpeg;base64,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',
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

function nodesToList(elems) {
    var t = Array.from(elems).filter(a => a.tagName == "DIV").map(a => a.textContent);
    if (t.length > 0) {
        return t;
    } else {
        return [''];
    }
}

function listToNodes(list) {
    return list.map(a => '<div>' + a + '</div>').reduce((old, i) => old + i, '');
}


function getCursorNode(parent, node, stat) {
    if (stat.done || parent.childNodes.length == 0) return stat;
    let currentNode = null;
    for (let i = 0; i < parent.childNodes.length && !stat.done; i++) {
        currentNode = parent.childNodes[i];
        stat.pos.push(i);
        if (currentNode === node) {
            stat.done = true;
        } else {
            getCursorNode(currentNode, node, stat);
        }
        if (stat.done) {
            return stat;
        } else {
            stat.pos.pop();
        }

    }
    return stat;
}

function setCursorNode(parent, pos) {
    let currentNode = parent;
    for (let i = 0; i < pos.length; i++) {
        currentNode = currentNode.childNodes[pos[i]]
    }
    return currentNode;
}

const months = {
    '01': 'January',
    '02': 'February',
    '03': 'March',
    '04': 'April',
    '05': 'May',
    '06': 'June',
    '07': 'July',
    '08': 'August',
    '09': 'September',
    '10': 'October',
    '11': 'November',
    '12': 'December'
}

function dateString(instring) {
    const parts = instring.split('-');
    return months[parts[1]] + ', ' + parts[0];
}

document.addEventListener('alpine:init', () => {
    Alpine.bind('listable', () => ({
        'contenteditable': true,
        '@input': '$el._x_model.set(nodesToList($el.children))',
        'x-init': `$nextTick(() => {
            $el.innerHTML = listToNodes($el._x_model.get())
            $watch($el.attributes["x-model"].nodeValue, (v) => {
                const sel = window.getSelection()
                const node = sel.focusNode;
                const offset = sel.focusOffset;
                const stat = getCursorNode($el, node, {pos: [], done: false})

                $el.innerHTML = listToNodes(v);

                sel.removeAllRanges();
                const range = document.createRange();
                range.setStart(setCursorNode($el, stat.pos), offset);
                range.collapse(true);
                sel.addRange(range);
            })
}       )`,
    }));
});
