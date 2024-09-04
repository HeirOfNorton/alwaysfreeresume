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
    const defaultstyles = {
        document: {
            run: {

            },
            paragraph: {

            },
        },
        title: {
            run: {

            },
            paragraph: {

            },
        },
        heading1: {
            run: {

            },
            paragraph: {

            },
        },
        heading2: {
            run: {

            },
            paragraph: {

            },
        },
        heading3: {
            run: {

            },
            paragraph: {

            },
        },
        heading4: {
            run: {

            },
            paragraph: {

            },
        },
        listParagraph: {
            run: {

            },
            paragraph: {

            },
        }
    }
    const address = {
        id: 'Address',
        name: 'Address',
        basedOn: 'Normal',
        next: 'Address',
        quickStyle: true,
        run: {},
        paragraph: {},
    };
    const summary = {
        id: 'Summary',
        name: 'Summary',
        basedOn: 'Normal',
        next: 'Summary',
        quickStyle: true,
        run: {},
        paragraph: {},

    };
    const listitem = {
        id: 'ListItem',
        name: 'List Item',
        basedOn: 'ListParagraph',
        next: 'ListItem',
        quickStyle: true,
        run: {},
        paragraph: {},

    };
    const item_org = {
        id: 'Organization',
        name: 'Organization',
        basedOn: 'Normal',
        next: 'Organization',
        quickStyle: true,
        run: {},
        paragraph: {},

    };
    const item_date = {
        id: 'Date',
        name: 'Date',
        basedOn: 'Normal',
        next: 'Date',
        quickStyle: true,
        run: {},
        paragraph: {},

    };
    const item_subitem = {
        id: 'SubItems',
        name: 'Sub Items',
        basedOn: 'List Paragraph',
        next: 'SubItems',
        quickStyle: true,
        run: {},
        paragraph: {},

    };

    const list_numbering = {
        reference: "list-item",
        levels: [{
            level: 0,
            format: LevelFormat.BULLET,
            text: "-",
            alignment: AlignmentType.LEFT,
            style: {
                paragraph: {
                    indent: { left: convertInchesToTwip(0.5), hanging: convertInchesToTwip(0.25) },
                },
            },
        }],
    };

    const subitem_numbering = {
        reference: 'subitem',
        levels: [{
            level: 0,
            format: LevelFormat.BULLET,
            text: "-",
            alignment: AlignmentType.LEFT,
            style: {
                paragraph: {
                    indent: { left: convertInchesToTwip(0.5), hanging: convertInchesToTwip(0.25) },
                },
            },
        }],
    };

    const parastyles = [address, summary, item_org, listitem, item_subitem];
    const runstyles = [];

    if (classlist.contains('maingeorgia')){
        defaultstyles.document.run.font = "Georgia";
    }


    if (classlist.contains('headarial')){
        defaultstyles.heading1.run.font = "Arial";
        defaultstyles.heading2.run.font = "Arial";
        defaultstyles.heading3.run.font = "Arial";
    }

    if (classlist.contains('toparialblack')){
        defaultstyles.title.run.font = "Arial Black";
        address.run.font = 'Arial Black';
    }

    if (classlist.contains('fontlarge')) {

    } else if (classlist.contains('fontsmall')) {

    } else /* fontmedium */ {
        defaultstyles.document.run.size = 24;
        defaultstyles.title.run.size = 40;
        defaultstyles.heading1.run.size = 32;
    }

    if (classlist.contains('topcenter')) {
        defaultstyles.title.paragraph.alignment = 'center';
        defaultstyles.title.paragraph.spacing = {after: 360};
        address.paragraph.alignment = 'center';

    } else {

    }

    if (classlist.contains('headunderline')) {
        defaultstyles.heading1.run.bold = true;
        defaultstyles.heading1.run.underline = {};
    } else {

    }

    if (classlist.contains('listdisc')) {
        list_numbering.levels[0].text = "\u25CF";
        subitem_numbering.levels[0].text = "\u25CF";
    }
    
    if (classlist.contains('listcolumns')) {

    } else {

    }

    if (classlist.contains('itemstandard')) {

    } else {

    }

    const docstyles = {
        numbering: {config: [list_numbering, subitem_numbering]},
        styles: {
            default: defaultstyles,
            paragraphStyles: parastyles,
            characterStyles: runstyles,
        },
    }

    return docstyles;
}

function makeDocxFlags (classlist) {
    const flags = {};

    if (classlist.contains('pageletter')) {
        flags.pagesize = {
            width: 12240,
            height: 15840,
        };
        if (classlist.contains('mgmedium')) {
            flags.margin = 1080;
        } else if (classlist.contains('mgnarrow')) {
            flags.margin = 720;
        } else if (classlist.contains('mgwide')) {
            flags.margin = 1440;
        }
    }
    if (classlist.contains('pagea4')) {
        flags.pagesize = {
            width: 11906,
            height: 16838,
        };
        if (classlist.contains('mgmedium')) {
            flags.margin = 1134;
        } else if (classlist.contains('mgnarrow')) {
            flags.margin = 794;
        } else if (classlist.contains('mgwide')) {
            flags.margin = 1361;
        }
    }
    if ( classlist.contains('topcenter')) {
        flags.run_address_together = true;
    }
    if (classlist.contains('listcolumns')) {
        flags.listcolumns = 3;
    }
    if (classlist.contains('itemstandard')) {
        flags.item_org_run_together = true;
        flags.item_date_tab_right = true;
        flags.item_skip_subtitle = true;
    }

    return flags;
}

function makeDocxStack () {
    return {
        sectionstack: [
            {
                properties: {
                    type: docx.SectionType.CONTINUOUS,
                },
                children: []
            }
        ],
        currentsection: 0,
        add: function (elem) {
            if (Array.isArray(elem)) {
                this.sectionstack[this.currentsection].children.push(...elem);
            } else {
                this.sectionstack[this.currentsection].children.push(elem);
            }
        },
        setPage: function (pgsize, mg) {
            const page = {
                size: {
                    width: pgsize.width,
                    height: pgsize.height
                },
                margin: {
                    top: mg,
                    left: mg,
                    bottom: mg,
                    right: mg
                }
            }
            this.sectionstack[0].properties.page = page;
        },
        changeColumns: function (numcols) {
            this.sectionstack.push({
                properties: {
                    type: docx.SectionType.CONTINUOUS,
                    column: {
                        count: numcols,
                        equalWidth: true,
                        separate: false,
                        space: numcols > 1 ? 360 : 0,
                    }
                },
                children: []
            });
            this.currentsection++;
        }




    };
}

function makeDocxContacts (stack, elem, flags) {
    stack.add(new docx.Paragraph('This is a test'));
    return 'Temp Name';
}

function makeDocxHeading (elem) {

}

function makeDocxSummary (stack, elem, flags) {

}

function makeDocxList (stack, elem, flags) {

}

function makeDocxItems (stack, elem, flags) {

}

function saveWordDoc (elemid) {
    const elem = document.getElementById(elemid);

    // Create the Styles and set flags/variables for anything needed later
    const styles = makeDocxStyles(elem.classList);
    const flags = makeDocxFlags(elem.classList);
    const properties = {};
    const stack = makeDocxStack();

    stack.setPage(flags.pagesize, flags.margin);

    for (const sect of elem.children) {
        if (sect.nodeName === "SECTION" && window.getComputedStyle(sect, null).display != "none" ) {
            for (const inner of sect.children) {
                if (inner.nodeName === "DIV") {
                    switch (inner.className) {
                        case 'contact':
                            var name = makeDocxContacts(stack, inner, flags);
                            properties.creator = name;
                            properties.title = name + "'s Resume";
                            console.log(properties);
                            break;
                        case 'summary':
                            makeDocxSummary(stack, inner, flags);
                            break;
                        case 'list':
                            makeDocxList(stack, inner, flags);
                            break;
                        case 'items':
                            makeDocxItems(stack, inner, flags);
                            break;
                    }
                }
            }
        }
    }

    // combine the styles, doc metadata, and document stack into a final word doc a download it
    
    const docfile = new docx.Document({
        ...properties,
        styles: styles.styles,
        numbering: styles.numbering,
        sections: stack.sectionstack,
    });
    docx.Packer.toBlob(docfile).then((blob) => {
        saveAs(blob, "resume.docx");
    });
}