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
        items: [''],
    };
//    addListItem(lst, 0);
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

function nodesToList(elems) {
    var t = elems.filter(a => a.tagName == "DIV").map(a => a.textContent);
    if (t.length > 0) {
        return t;
    } else {
        return [''];
    }
}

function listToNodes(list) {
    return list.map(a => '<div>' + a + '</div>').reduce((old, i) => old + i, '');
}

// Saving and resetting cursor position, found on StackOverflow:
// https://stackoverflow.com/a/70800591

function getCursor (parent, node, offset, stat) {
    if (stat.done) return stat;
    let currentNode = null;
    if (parent.childNodes.length == 0) {
        stat.pos += parent.textContent.length;
    } else {
        for (let i = 0; i < parent.childNodes.length && !stat.done; i++) {
            currentNode = parent.childNodes[i];
            if (currentNode === node) {
                stat.pos += offset;
                stat.done = true;
                return stat;
            } else getCursor(currentNode, node, offset, stat);
        }
    }
    return stat;
}

function setCursor (parent, range, stat) {
    if (stat.done) return range;
    if (parent.childNodes.length == 0) {
        if (parent.textContent.length >= stat.pos) {
            range.setStart(parent, stat.pos);
            stat.done = true;
        } else {
            stat.pos = stat.pos - parent.textContent.length;
        }
    } else {
        for (let i = 0; i < parent.childNodes.length && !stat.done; i++) {
            currentNode = parent.childNodes[i];
            setCursor(currentNode, range, stat);
        }
    }
    return range;
}

document.addEventListener('alpine:init', () => {
    Alpine.bind('listable', () => ({
        'contenteditable': true,
        '@input': '$el._x_model.set(nodesToList($el.childNodes))',
        'x-init': `$nextTick(() => {
            $el.innerHTML = listToNodes($el._x_model.get())
            $watch($el.attributes["x-model"].nodeValue, (v) => {
                const sel = window.getSelection()
                const node = sel.focusNode;
                const offset = sel.focusOffset;
                const pos = getCursor($el, node, offset, {pos: 0, done: false})
                if (offset===0) pos.pos += 0.5;
                $el.innerHTML = listToNodes(v);
                sel.removeAllRanges();
                const range = setCursor($el, document.createRange(), {pos: pos.pos, done: false});
                range.collapse(true);
                sel.addRange(range);
            })
}       )`,
    }));
});
