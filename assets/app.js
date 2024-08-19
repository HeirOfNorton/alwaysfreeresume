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
