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
        type: 'contact',
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
        type: 'summary',
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
        type: 'list',
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
        type: 'items',
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
        data: '',
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

function resetOrder(order) {
    if (order === 'education') {
        return [
            'contact',
            'summary',
            'education',
            'projects',
            'activities',
            'experience',
            'certifications',
            'skills',
            'proskills',
            'awards',
            'languages'
        ];
    } else if (order === 'functional') {
        return [
            'contact',
            'summary',
            'skills',
            'proskills',
            'experience',
            'certifications',
            'education',
            'projects',
            'activities',
            'awards',
            'languages'
        ];
    } else {
        return [
            'contact',
            'summary',
            'experience',
            'certifications',
            'education',
            'projects',
            'activities',
            'skills',
            'proskills',
            'awards',
            'languages'
        ];
    }
}

function showprint() {
    window.print();
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

function makeDocxStyles (classlist) {
    const tempStyles = {};

    const docstyles = {
        default: [

        ],
        paragraphStyles: [

        ],
        characterStyles: [

        ],
    }

    return docstyles;
}

function makeDocxFlags (classlist) {
    const flags = {};

    return flags
}

function makeDocxStack () {
    return {
        sectionstack: [
            {
                properties: {
                    type: SectionType.CONTINUOUS,
                },
                children: []
            }
        ],
        currentsection: 0,
        


    };
}

function makeDocxContacts (stack, elem) {

}

function makeDocxHeading (elem) {

}

function makeDocxSummary (stack, elem) {

}

function makeDocxList (stack, elem) {

}

function makeDocxItems (stack, elem) {

}

function saveWordDoc (elem) {
    console.log("Hello from saveWordDoc.");

    // Create the Styles and set flags/variables for anything needed later
    const styles = makeDocxStyles(elem.classList);
    const flags = makeDocxFlags(elem.classList);
    const properties = {};
    const stack = makeDocxStack();

    stack.setPage(flags.pagesize, flags.margins);

    for (const sect of elem.children) {
        if (sect.nodeName === "SECTION" && window.getComputedStyle(elem, null).display != "none" ) {
            for (const inner of sect.children) {
                if (inner.nodeName === "DIV") {
                    stack.addSection(inner);
                }
            }
        }
    }

    // combine the styles, doc metadata, and document stack into a final word doc a download it
}