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
        id: 'SubItem',
        name: 'Sub Item',
        basedOn: 'List Paragraph',
        next: 'SubItem',
        quickStyle: true,
        run: {},
        paragraph: {},

    };

    const list_numbering = {
        reference: "list-item",
        levels: [{
            level: 0,
            format: docx.LevelFormat.BULLET,
            text: "-",
            alignment: docx.AlignmentType.LEFT,
            style: {
                paragraph: {
                    indent: { left: docx.convertInchesToTwip(0.5), hanging: docx.convertInchesToTwip(0.25) },
                },
            },
        }],
    };

    const subitem_numbering = {
        reference: 'subitem',
        levels: [{
            level: 0,
            format: docx.LevelFormat.BULLET,
            text: "-",
            alignment: docx.AlignmentType.LEFT,
            style: {
                paragraph: {
                    indent: { left: docx.convertInchesToTwip(0.5), hanging: docx.convertInchesToTwip(0.25) },
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
        item_date.run.font = defaultstyles.document.run.font;
        item_date.paragraph = null;
        runstyles.push(item_date);

        item_org.run.italics = true;

        defaultstyles.heading2.run.bold = true;
        defaultstyles.heading2.paragraph.tabStops = [{
            type: docx.TabStopType.RIGHT,
            position: docx.TabStopPosition.MAX,
        }];
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

function makeDocxSection (pgsize, margins) {
    return {
        properties: {
            type: docx.SectionType.CONTINUOUS,
            page: {
                size: {
                    width: pgsize.width,
                    height: pgsize.height
                },
                margin: {
                    top: margins,
                    bottom: margins,
                    left: margins,
                    right: margins,
                },
            },
        },
        children: [],
    };
}

function makeDocxStack (pgsize, margins) {
    return {
        sectionstack: [ makeDocxSection(pgsize, margins) ],
        currentsection: 0,
        add: function (elem) {
            if (Array.isArray(elem)) {
                this.sectionstack[this.currentsection].children.push(...elem);
            } else {
                this.sectionstack[this.currentsection].children.push(elem);
            }
        },
        changeColumns: function (numcols) {
            var sect = makeDocxSection(pgsize, margins);
            if (numcols > 1) {
                sect.properties.column = {
                    count: numcols,
                    equalWidth: true,
                    separate: false,
                    space: 360,
                };
            }
            this.sectionstack.push(sect);
            this.currentsection++;
        }
    };
}

function makeDocxContacts (stack, elem, flags) {
    var fullname;
    for (e of elem.children) {
        if (e.classList.contains('fullname')) {
            fullname = e.innerText;
            stack.add(new docx.Paragraph({
                text: fullname,
                heading: docx.HeadingLevel.TITLE,
            }));
        } else {
            if (flags.run_address_together) {
                stack.add(new docx.Paragraph({
                    text: e.innerText,
                    style: 'Address',
                }));
            } else {
                for (child of e.children) {
                    if (child,nodeName === "SPAN") {
                        stack.add(new docx.Paragraph({
                            text: child.innerText,
                            style: 'Address',
                        }));
                    }
                }
            }
        }
    }
    return fullname;
}

function makeDocxSummary (stack, elem, flags) {
    stack.add(new docx.Paragraph({
        text: elem.children[0].innerText,
        heading: docx.HeadingLevel.HEADING_1,
    }));
    stack.add(new docx.Paragraph({
        text: elem.children[1].innerText,
        style: 'Summary',
    }));
}

function makeDocxList (stack, elem, flags) {
    stack.add(new docx.Paragraph({
        text: elem.children[0].innerText,
        heading: docx.HeadingLevel.HEADING_1,
    }));

    if (flags.listcolumns) {
        stack.changeColumns(flags.listcolumns);
    }

    for (li of elem.children[1].children) {
        if (li.nodeName === 'LI') {
            stack.add(new docx.Paragraph({
                text: li.innerText,
                numbering: {
                    reference: 'list-item',
                    level: 0,
                },
                style: 'ListItem',
            }));
        }
    }

    if (flags.listcolumns) {
        stack.changeColumns(1);
    }
}

function makeDocxItems (stack, elem, flags) {
    for (item of elem.children) {
        if (item.nodeName === 'H2') {
            stack.add(new docx.Paragraph({
                text: item.innerText,
                heading: docx.HeadingLevel.HEADING_1,
            }));
        } else if (item.nodeName === 'DIV') {
            for (block of item.children) {
                if (block.className === 'item-block') {
                    var title, org, loc, dates;
                    for (i of block.children) {
                        if (i.className === 'item-description') {
                            for (j of i.children) {
                                if (j.nodeName === 'H3') {
                                    title = j.innerText;
                                } else if (j.className === 'item-org') {
                                    for (k of j.children) {
                                        if (k.className === 'org') {
                                            org = k.innerText;
                                        } else if (k.className === 'loc') {
                                            loc = k.innerText;
                                        }
                                    }
                                }
                            }
                        } else if (i.className === 'dates') {
                            dates = i.innerText;
                        }
                    }
                    const titleruns = [new docx.TextRun(title)];
                    if (flags.item_date_tab_right && dates) {
                        titleruns.push(new docx.TextRun({children: [new docx.Tab()]}));
                        titleruns.push(new docx.TextRun({
                            text: dates,
                            style: 'Date',
                        }));
                    }
                    stack.add(new docx.Paragraph({
                        heading: docx.HeadingLevel.HEADING_2,
                        children: titleruns,
                    }));

                    if (flags.item_org_run_together && org && loc) {
                        stack.add(new docx.Paragraph({
                            text: org + loc,
                            style: 'Organization',
                        }));
                    } else {
                        if (org) {
                            stack.add(new docx.Paragraph({
                                text: org,
                                style: 'Organization',
                            }));
                        }
                        if (loc) {
                            stack.add(new docx.Paragraph({
                                text: loc,
                                style: 'Organization',
                            }));
                        }
                    }

                    if (!flags.item_date_tab_right && dates) {
                        stack.add(new docx.Paragraph({
                            text: dates,
                            style: 'Date',
                        }));
                    }

                } else if (block.className === 'subitems') {
                    if (!flags.item_skip_subtitle) {
                        stack.add(new docx.Paragraph({
                            text: block.children[0].innerText,
                            heading: docx.HeadingLevel.HEADING_3,
                        }));
                    }
                    for (subitem of block.children[1].children) {
                        if (subitem.nodeName === 'LI') {
                            stack.add(new docx.Paragraph({
                                text: subitem.innerText,
                                numbering: {
                                    reference: 'subitem',
                                    level: 0,
                                },
                                style: 'SubItem',
                            }));
                        }
                    }
                }
            }
        }
    }
}

function saveWordDoc (elemid) {
    const elem = document.getElementById(elemid);

    // Create the Styles and set flags/variables for anything needed later
    const styles = makeDocxStyles(elem.classList);
    const flags = makeDocxFlags(elem.classList);
    const properties = {};
    const stack = makeDocxStack(flags.pagesize, flags.margin);

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