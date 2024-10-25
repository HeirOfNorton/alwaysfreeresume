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

const shortmonths = {
    '01': 'Jan',
    '02': 'Feb',
    '03': 'Mar',
    '04': 'Apr',
    '05': 'May',
    '06': 'Jun',
    '07': 'Jul',
    '08': 'Aug',
    '09': 'Sep',
    '10': 'Oct',
    '11': 'Nov',
    '12': 'Dec'
}

function dateString(instring, format = 'itemdatelong') {
    const parts = instring.split('-');
    if (format === 'itemdatelong') {
        return months[parts[1]] + ', ' + parts[0];
    } else if (format === 'itemdateshort') {
        return shortmonths[parts[1]] + ' ' + parts[0];
    } else /* format === 'itemdatenum' */ {
        return parts[1] + '/' + parts[0];
    } 
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
    var pagewidth, pgmargin;
    if (classlist.contains('pageletter')) {
        pagewidth = 12240;
        if (classlist.contains('mgmedium')) {
            pgmargin = 1080;
        } else if (classlist.contains('mgnarrow')) {
            pgmargin = 720;
        } else /* mgwide */ {
            pgmargin = 1440;
        }
    } else /* pagea4 */ {
        pagewidth = 11906;
        if (classlist.contains('mgmedium')) {
            pgmargin = 1134;
        } else if (classlist.contains('mgnarrow')) {
            pgmargin = 794;
        } else /* mgwide */ {
            pgmargin = 1361;
        }
    }

    const defaultstyles = {
        document: {
            run: {

            },
            paragraph: {
                spacing: {
                    line: 276,
                    lineRule: 'auto',
                }
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
                spacing: {
                    before: 240,
                    after: 120,
                },
            },
        },
        heading2: {
            run: {

            },
            paragraph: {
                spacing: {
                    before: 120,
                },
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
    const item_head = {
        id: 'ItemHeading',
        name: 'Item Heading',
        basedOn: 'Normal',
        next: 'Organization',
        quickStyle: false,
        run: {},
    }
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
    const inlinelist = {
        id: 'InlineList',
        name: 'Inline List',
        basedOn: 'Normal',
        next: 'Normal',
        quickStyle: true,
        run: { },
        paragraph: { },

    };
    const listheading = {
        id: 'ListHeading',
        name: 'List Heading',
        basedOn: 'Normal',
        next:   'Normal',
        quickStyle: false,
        run: { },
    }

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

    const parastyles = [address, summary, item_org, inlinelist];
    const runstyles = [item_head, listheading];

    if (classlist.contains('maingeorgia')){
        defaultstyles.document.run.font = "Georgia";
    } else if (classlist.contains('mainarial')){
        defaultstyles.document.run.font = "Arial";
    } else if (classlist.contains('maincalibri')){
        defaultstyles.document.run.font = "Calibri";
    } else if (classlist.contains('maintahoma')){
        defaultstyles.document.run.font = "Tahoma";
    } else if (classlist.contains('mainbookantiqua')){
        defaultstyles.document.run.font = "Book Antiqua";
    } else if (classlist.contains('maingaramond')){
        defaultstyles.document.run.font = "Garamond";
    } else if (classlist.contains('mainpalatino')){
        defaultstyles.document.run.font = "Palatino Linotype";
    } else if (classlist.contains('maincomicsans')){
        defaultstyles.document.run.font = "Comic Sans MS";
    }


    if (classlist.contains('headgeorgia')){
        defaultstyles.heading1.run.font = "Georgia";
        defaultstyles.heading2.run.font = "Georgia";
        defaultstyles.heading3.run.font = "Georgia";
        if (classlist.contains('topmatchdoc')) {
            defaultstyles.title.run.font = "Georgia";
        }
    } else if (classlist.contains('headarial')){
        defaultstyles.heading1.run.font = "Arial";
        defaultstyles.heading2.run.font = "Arial";
        defaultstyles.heading3.run.font = "Arial";
        if (classlist.contains('topmatchdoc')) {
            defaultstyles.title.run.font = "Arial";
        }
    } else if (classlist.contains('headarialblack')){
        defaultstyles.heading1.run.font = "Arial Black";
        defaultstyles.heading2.run.font = "Arial Black";
        defaultstyles.heading3.run.font = "Arial Black";
        if (classlist.contains('topmatchdoc')) {
            defaultstyles.title.run.font = "Arial Black";
        }
    } else if (classlist.contains('headcalibri')){
        defaultstyles.heading1.run.font = "Calibri";
        defaultstyles.heading2.run.font = "Calibri";
        defaultstyles.heading3.run.font = "Calibri";
        if (classlist.contains('topmatchdoc')) {
            defaultstyles.title.run.font = "Calibri";
        }
    } else if (classlist.contains('headimpact')){
        defaultstyles.heading1.run.font = "Impact";
        defaultstyles.heading2.run.font = "Impact";
        defaultstyles.heading3.run.font = "Impact";
        if (classlist.contains('topmatchdoc')) {
            defaultstyles.title.run.font = "Impact";
        }
    } else if (classlist.contains('headtahoma')){
        defaultstyles.heading1.run.font = "Tahoma";
        defaultstyles.heading2.run.font = "Tahoma";
        defaultstyles.heading3.run.font = "Tahoma";
        if (classlist.contains('topmatchdoc')) {
            defaultstyles.title.run.font = "Tahoma";
        }
    } else if (classlist.contains('headbookantiqua')){
        defaultstyles.heading1.run.font = "Book Antiqua";
        defaultstyles.heading2.run.font = "Book Antiqua";
        defaultstyles.heading3.run.font = "Book Antiqua";
        if (classlist.contains('topmatchdoc')) {
            defaultstyles.title.run.font = "Book Antiqua";
        }
    } else if (classlist.contains('headgaramond')){
        defaultstyles.heading1.run.font = "Garamond";
        defaultstyles.heading2.run.font = "Garamond";
        defaultstyles.heading3.run.font = "Garamond";
        if (classlist.contains('topmatchdoc')) {
            defaultstyles.title.run.font = "Garamond";
        }
    } else if (classlist.contains('headpalatino')){
        defaultstyles.heading1.run.font = "Palatino Linotype";
        defaultstyles.heading2.run.font = "Palatino Linotype";
        defaultstyles.heading3.run.font = "Palatino Linotype";
        if (classlist.contains('topmatchdoc')) {
            defaultstyles.title.run.font = "Palatino Linotype";
        }
    } else if (classlist.contains('headtimes')){
        defaultstyles.heading1.run.font = "Times New Roman";
        defaultstyles.heading2.run.font = "Times New Roman";
        defaultstyles.heading3.run.font = "Times New Roman";
        if (classlist.contains('topmatchdoc')) {
            defaultstyles.title.run.font = "Times New Roman";
        }
    } else if (classlist.contains('headcopperplate')){
        defaultstyles.heading1.run.font = "Copperplate Gothic Light";
        defaultstyles.heading2.run.font = "Copperplate Gothic Light";
        defaultstyles.heading3.run.font = "Copperplate Gothic Light";
        if (classlist.contains('topmatchdoc')) {
            defaultstyles.title.run.font = "Copperplate Gothic Light";
        }
    } else if (classlist.contains('headpapyrus')){
        defaultstyles.heading1.run.font = "Papyrus";
        defaultstyles.heading2.run.font = "Papyrus";
        defaultstyles.heading3.run.font = "Papyrus";
        if (classlist.contains('topmatchdoc')) {
            defaultstyles.title.run.font = "Papyrus";
        }
    } else if (classlist.contains('headcomicsans')){
        defaultstyles.heading1.run.font = "Comic Sans MS";
        defaultstyles.heading2.run.font = "Comic Sans MS";
        defaultstyles.heading3.run.font = "Comic Sans MS";
        if (classlist.contains('topmatchdoc')) {
            defaultstyles.title.run.font = "Comic Sans MS";
        }
    }


    if (classlist.contains('topgeorgia')) {
        defaultstyles.title.run.font = "Georgia";
        address.run.font = "Georgia";
    } else if (classlist.contains('toparial')) {
        defaultstyles.title.run.font = "Arial";
        address.run.font = "Arial";
    } else if (classlist.contains('toparialblack')) {
        defaultstyles.title.run.font = "Arial Black";
        address.run.font = "Arial Black";
    } else if (classlist.contains('topcalibri')) {
        defaultstyles.title.run.font = "Calibri";
        address.run.font = "Calibri";
    } else if (classlist.contains('topimpact')) {
        defaultstyles.title.run.font = "Impact";
        address.run.font = "Impact";
    } else if (classlist.contains('toptahoma')) {
        defaultstyles.title.run.font = "Tahoma";
        address.run.font = "Tahoma";
    } else if (classlist.contains('topbookantiqua')) {
        defaultstyles.title.run.font = "Book Antiqua";
        address.run.font = "Book Antiqua";
    } else if (classlist.contains('topgaramond')) {
        defaultstyles.title.run.font = "Garamond";
        address.run.font = "Garamond";
    } else if (classlist.contains('toppalatino')) {
        defaultstyles.title.run.font = "Palatino Linotype";
        address.run.font = "Palatino Linotype";
    } else if (classlist.contains('toptimes')) {
        defaultstyles.title.run.font = "Times New Roman";
        address.run.font = "Times New Roman";
    } else if (classlist.contains('topcopperplate')) {
        defaultstyles.title.run.font = "Copperplate Gothic Light";
        address.run.font = "Copperplate Gothic Light";
    } else if (classlist.contains('toppapyrus')) {
        defaultstyles.title.run.font = "Papyrus";
        address.run.font = "Papyrus";
    } else if (classlist.contains('topcomicsans')) {
        defaultstyles.title.run.font = "Comic Sans MS";
        address.run.font = "Comic Sans MS";
    }


    if (classlist.contains('fontlarge')) {
        defaultstyles.document.run.size = 28;
        defaultstyles.title.run.size = 68;
        defaultstyles.heading1.run.size = 36;
    } else if (classlist.contains('fontsmall')) {
        defaultstyles.document.run.size = 20;
        defaultstyles.title.run.size = 56;
        defaultstyles.heading1.run.size = 28;
    } else /* fontmedium */ {
        defaultstyles.document.run.size = 24;
        defaultstyles.title.run.size = 80;
        defaultstyles.heading1.run.size = 32;
    }

    if (classlist.contains('topcenter')) {
        defaultstyles.title.paragraph.alignment = 'center';
        address.paragraph.alignment = 'center';
    } else if (classlist.contains('topleft')) {
        defaultstyles.title.paragraph.alignment = 'left';
        address.paragraph.alignment = 'left';
    } else if (classlist.contains('topright')) {
        defaultstyles.title.paragraph.alignment = 'right';
        address.paragraph.alignment = 'right';
    } else /* topsplit */ {
        defaultstyles.title.paragraph.alignment = 'left';
        defaultstyles.title.paragraph.spacing = {
            line: 204,
            lineRule: 'auto',
        };
        if (!classlist.contains('topcolumns')) {
            address.paragraph.alignment = 'right';
        }
    }

    if (classlist.contains('topcolumns')) {
        address.paragraph.alignment = 'left';
        address.paragraph.tabStops = [{
            type: docx.TabStopType.RIGHT,
            position: pagewidth - (2 * pgmargin),
        }];
    }

    if (classlist.contains('headbold')) {
        defaultstyles.heading1.run.bold = true;
    } else if (classlist.contains('headitalic')) {
        defaultstyles.heading1.run.italics = true;
    } else if (classlist.contains('headbolditalic')) {
        defaultstyles.heading1.run.bold = true;
        defaultstyles.heading1.run.italics = true;
    } else if (classlist.contains('headunderline')) {
        defaultstyles.heading1.run.underline = {};
    } else if (classlist.contains('headboldunderline')) {
        defaultstyles.heading1.run.bold = true;
        defaultstyles.heading1.run.underline = {};
    } else if (classlist.contains('headallcaps')) {
        defaultstyles.heading1.run.allCaps = true;
    } else if (classlist.contains('headboldallcaps')) {
        defaultstyles.heading1.run.bold = true;
        defaultstyles.heading1.run.allCaps = true;
    } else if (classlist.contains('headsmallcaps')) {
        defaultstyles.heading1.run.smallCaps = true;
    } else if (classlist.contains('headboldsmallcaps')) {
        defaultstyles.heading1.run.bold = true;
        defaultstyles.heading1.run.smallCaps = true;
    } else /* headnormal */ {
    }

    if (classlist.contains('headleft')) {
        defaultstyles.heading1.paragraph.alignment = docx.AlignmentType.LEFT;
    } else if (classlist.contains('headcenter')) {
        defaultstyles.heading1.paragraph.alignment = docx.AlignmentType.CENTER;
    } else if (classlist.contains('headright')) {
        defaultstyles.heading1.paragraph.alignment = docx.AlignmentType.RIGHT;
    } else if (classlist.contains('headindented')) {
        defaultstyles.heading1.paragraph.alignment = docx.AlignmentType.LEFT;
        defaultstyles.heading1.paragraph.indent = {firstLine: '1.5in'};
    } 

    if (classlist.contains('headtop')) {
        defaultstyles.heading1.paragraph.border = {
            top: {
                color: 'auto',
                space: 1,
                style: 'single',
                size: 16,
            }
        };
    } else if (classlist.contains('headbottom')) {
        defaultstyles.heading1.paragraph.border = {
            bottom: {
                color: 'auto',
                space: 1,
                style: 'single',
                size: 16,
            }
        };
    } else if (classlist.contains('headtopandbottom')) {
        defaultstyles.heading1.paragraph.border = {
            top: {
                color: 'auto',
                space: 1,
                style: 'single',
                size: 16,
            },
            bottom: {
                color: 'auto',
                space: 1,
                style: 'single',
                size: 16,
            },
        };
    } else if (classlist.contains('headboxed')) {
        defaultstyles.heading1.paragraph.border = {
            top: {
                color: 'auto',
                space: 1,
                style: 'single',
                size: 16,
            },
            bottom: {
                color: 'auto',
                space: 1,
                style: 'single',
                size: 16,
            },
            left: {
                color: 'auto',
                space: 3,
                style: 'single',
                size: 16,
            },
            right: {
                color: 'auto',
                space: 3,
                style: 'single',
                size: 16,
            },
        };
    } else if (classlist.contains('headshadedlight')) {
        defaultstyles.heading1.paragraph.shading = {
            type: docx.ShadingType.CLEAR,
            color: 'auto',
            fill: 'D3D3D3',
        };
        if (classlist.contains('headleft') || classlist.contains('headright')) {
            defaultstyles.heading1.paragraph.border = {
                left: {
                    color: 'D3D3D3',
                    space: 3,
                    style: 'single',
                    size: 1,
                },
                right: {
                    color: 'D3D3D3',
                    space: 3,
                    style: 'single',
                    size: 1,
                }
            };
        }

    } else if (classlist.contains('headshadeddark')) {
        defaultstyles.heading1.paragraph.shading = {
            type: docx.ShadingType.CLEAR,
            color: 'auto',
            fill: '808080',
        };
        defaultstyles.heading1.run.color = 'FFFFFF';
        if (classlist.contains('headleft') || classlist.contains('headright')) {
            defaultstyles.heading1.paragraph.border = {
                left: {
                    color: '808080',
                    space: 3,
                    style: 'single',
                    size: 1,
                },
                right: {
                    color: '808080',
                    space: 3,
                    style: 'single',
                    size: 1,
                }
            };
        }

    } else if (classlist.contains('headshadedblack')) {
        defaultstyles.heading1.paragraph.shading = {
            type: docx.ShadingType.CLEAR,
            color: 'auto',
            fill: '000000',
        };
        defaultstyles.heading1.run.color = 'FFFFFF';
        if (classlist.contains('headleft') || classlist.contains('headright')) {
            defaultstyles.heading1.paragraph.border = {
                left: {
                    color: '000000',
                    space: 3,
                    style: 'single',
                    size: 1,
                },
                right: {
                    color: '000000',
                    space: 3,
                    style: 'single',
                    size: 1,
                }
            };
        }
    } else /* headnoborder */ {
    }

    if (classlist.contains('listdisc')) {
        list_numbering.levels[0].text = "\u25CF";
        subitem_numbering.levels[0].text = "\u25CF";
    } else if (classlist.contains('listcircle')) {
        list_numbering.levels[0].text = "\u25CB";
        subitem_numbering.levels[0].text = "\u25CB";
    } else if (classlist.contains('listsquare')) {
        list_numbering.levels[0].text = "\u25A0";
        subitem_numbering.levels[0].text = "\u25A0";
    } else if (classlist.contains('listtriangle')) {
        list_numbering.levels[0].text = "\u2023";
        subitem_numbering.levels[0].text = "\u2023";
    } else if (classlist.contains('listhyphen')) {
        list_numbering.levels[0].text = "\u2043";
        subitem_numbering.levels[0].text = "\u2043";
    } else if (classlist.contains('listdash')) {
        list_numbering.levels[0].text = "\u2014";
        subitem_numbering.levels[0].text = "\u2014";
    }
    
    if (classlist.contains('itemstandard')) {
        item_date.run.font = defaultstyles.document.run.font;
        item_date.paragraph = null;
        runstyles.push(item_date);

        defaultstyles.heading2.paragraph.tabStops = [{
            type: docx.TabStopType.RIGHT,
            position: pagewidth - (2 * pgmargin),
        }];
    } else if (classlist.contains('itemcompact')) {
        item_org.run.font = defaultstyles.document.run.font;
        item_org.paragraph = null;
        runstyles.push(item_org);
        item_date.run.font = defaultstyles.document.run.font;
        item_date.paragraph = null;
        runstyles.push(item_date);

        defaultstyles.heading2.paragraph.tabStops = [{
            type: docx.TabStopType.RIGHT,
            position: pagewidth - (2 * pgmargin),
        }];
    } else if (classlist.contains('itemblock')) {

    }

    if (classlist.contains('itembold')) {
        item_org.run.bold = true;
    } else if (classlist.contains('itemitalic')) {
        item_org.run.italics = true;
    }

    if (classlist.contains('itemdatebold')) {
        item_date.run.bold = true;
    } else if (classlist.contains('itemdateitalic')) {
        item_date.run.italics = true;
    }

    if (classlist.contains('itemheadbold')) {
        item_head.run.bold = true;
    } else if (classlist.contains('itemheaditalic')) {
        item_head.run.italics = true;
    } else if (classlist.contains('itemheadmatch')) {
        if (classlist.contains('headbold')) {
            item_head.run.bold = true;
        } else if (classlist.contains('headitalic')) {
            item_head.run.italics = true;
        } else if (classlist.contains('headbolditalic')) {
            item_head.run.bold = true;
            item_head.run.italics = true;
        } else if (classlist.contains('headunderline')) {
            item_head.run.underline = {};
        } else if (classlist.contains('headboldunderline')) {
            item_head.run.bold = true;
            item_head.run.underline = {};
        } else if (classlist.contains('headallcaps')) {
            item_head.run.allCaps = true;
        } else if (classlist.contains('headboldallcaps')) {
            item_head.run.bold = true;
            item_head.run.allCaps = true;
        } else if (classlist.contains('headsmallcaps')) {
            item_head.run.smallCaps = true;
        } else if (classlist.contains('headboldsmallcaps')) {
            item_head.run.bold = true;
            item_head.run.smallCaps = true;
        }
    }

    if (classlist.contains('subtitlebold')) {
        defaultstyles.heading3.run.bold = true;
    } else if (classlist.contains('subtitleitalic')) {
        defaultstyles.heading3.run.italics = true;
    } else if (classlist.contains('subtitlematch')) {
        if (classlist.contains('headbold')) {
            defaultstyles.heading3.run.bold = true;
        } else if (classlist.contains('headitalic')) {
            defaultstyles.heading3.run.italics = true;
        } else if (classlist.contains('headbolditalic')) {
            defaultstyles.heading3.run.bold = true;
            defaultstyles.heading3.run.italics = true;
        } else if (classlist.contains('headunderline')) {
            defaultstyles.heading3.run.underline = {};
        } else if (classlist.contains('headboldunderline')) {
            defaultstyles.heading3.run.bold = true;
            defaultstyles.heading3.run.underline = {};
        } else if (classlist.contains('headallcaps')) {
            defaultstyles.heading3.run.allCaps = true;
        } else if (classlist.contains('headboldallcaps')) {
            defaultstyles.heading3.run.bold = true;
            defaultstyles.heading3.run.allCaps = true;
        } else if (classlist.contains('headsmallcaps')) {
            defaultstyles.heading3.run.smallCaps = true;
        } else if (classlist.contains('headboldsmallcaps')) {
            defaultstyles.heading3.run.bold = true;
            defaultstyles.heading3.run.smallCaps = true;
        } 
    }

    if (classlist.contains('subiteminline')) {
        listheading.run = defaultstyles.heading3.run;
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
    if ( classlist.contains('toplines')) {
        flags.run_address_lines_together = true;
    }
    if (classlist.contains('topinline')) {
        flags.run_address_together = true;
    }
    if (classlist.contains('topcolumns')) {
        flags.address_columns = true;
    }
    if (classlist.contains('topsplit')) {
        flags.contact_columns = true;
    }

    if (classlist.contains('listcolumns')) {
        flags.listcolumns = 3;
    } else if (classlist.contains('listinline')) {
        flags.listinline = true;
    }
    if (classlist.contains('itemstandard')) {
        flags.item_date_tab_right = true;
    } else if (classlist.contains('itemcompact')) {
        flags.item_org_run_together = true;
        flags.item_date_tab_right = true;
    }
    if (classlist.contains('subtitlehide')) {
        flags.item_skip_subtitle = true;
    }
    if (classlist.contains('subitemcolumns')) {
        flags.subitemcolumns = 3;
    } else if (classlist.contains('subiteminline')) {
        flags.subiteminline = true;
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
    var namepar;
    var lefttxt = [];
    var righttxt = [];
    for (e of elem.children) {
        if (e.classList.contains('fullname')) {
            fullname = e.innerText;
            namepar = new docx.Paragraph({
                text: fullname,
                heading: docx.HeadingLevel.TITLE,
            });
        } else /* address-block */ {
            if (flags.run_address_together) {
                lefttxt.push(e.innerText);
            } else {
                for (par of e.children) {
                    if (flags.run_address_lines_together) {
                        lefttxt.push(par.innerText);
                    } else {
                        for (child of par.children) {
                            if (child.nodeName === "SPAN") {
                                var inner = child.innerText;
                                if (flags.address_columns && par.classList.contains('communication')) {
                                    righttxt.push(inner);
                                } else {
                                    lefttxt.push(inner);
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    const leftpars = lefttxt.map((txt) => {
        return new docx.Paragraph({
            text: txt,
            style: 'Address',
        });
    });
    const rightpars = righttxt.map((txt) => {
        return new docx.Paragraph({
            text: txt,
            style: 'Address',
            alignment: docx.AlignmentType.RIGHT,
        });
    });
    const combopars = [];
    for (var i = 0; i < Math.max(lefttxt.length, righttxt.length); i++) {
        var txt = "";
        if (i in lefttxt) {
            txt = lefttxt[i];

        }
        if (i in righttxt) {
            txt = txt + "\t" + righttxt[i];
        }
        if (txt != "") {
            combopars.push(new docx.Paragraph({
                text: txt,
                style: 'Address',
            }));
        }
    }
    
    if (flags.contact_columns) {
        const kids = [];
        kids.push(new docx.TableCell({
        //    width: {},
            verticalAlign: docx.VerticalAlign.CENTER,
            children: [namepar],
        }));
        kids.push(new docx.TableCell({
        //    width: {},
            verticalAlign: docx.VerticalAlign.CENTER,
            children: leftpars,
        }));
        if (flags.address_columns) {
            kids.push(new docx.TableCell({
            //    width: {},
                verticalAlign: docx.VerticalAlign.CENTER,
                children: rightpars,
            }));
        }
        stack.add(new docx.Table({
            width: {
                type: docx.WidthType.DXA,
                size: flags.pagesize.width - (2 * flags.margin),
            },
            borders: docx.TableBorders.NONE,
            rows: [
                new docx.TableRow({
                    children: kids,
                }),
            ]
        }));
    } else {
        stack.add(namepar);
        stack.add(combopars);
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

    if (flags.listinline) {
        stack.add(new docx.Paragraph({
            text: elem.children[1].innerText,
            style: 'InlineList',
        }));
    } else {
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
                    style: 'ListParagraph',
                }));
            }
        }

        if (flags.listcolumns) {
            stack.changeColumns(1);
        }
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
                    var title, org, dates;
                    for (i of block.children) {
                        if (i.className === 'item-description') {
                            for (j of i.children) {
                                if (j.nodeName === 'H3') {
                                    title = j.innerText;
                                } else if (j.className === 'item-org') {
                                    org = j.innerText;
                                }
                            }
                        } else if (i.className === 'dates') {
                            dates = i.innerText;
                        }
                    }
                    const titleruns = [];
                    titleruns.push(new docx.TextRun({
                        text: title,
                        style: 'ItemHeading',
                    }));
                    if (flags.item_org_run_together && org) {
                        titleruns.push(new docx.TextRun({
                            text: org,
                            style: 'Organization',
                        }));
                    }
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

                    if (org && !flags.item_org_run_together) {
                        stack.add(new docx.Paragraph({
                            text: org,
                            style: 'Organization',
                        }));
                    } 

                    if (!flags.item_date_tab_right && dates) {
                        stack.add(new docx.Paragraph({
                            text: dates,
                            style: 'Date',
                        }));
                    }

                } else if (block.className === 'subitems') {
                    if (!flags.item_skip_subtitle && !flags.subiteminline) {
                        stack.add(new docx.Paragraph({
                            text: block.children[0].innerText,
                            heading: docx.HeadingLevel.HEADING_3,
                        }));
                    }

                    if (flags.subiteminline) {
                        const subruns = [];
                        if (!flags.item_skip_subtitle) {
                            subruns.push(new docx.TextRun({
                                text: block.children[0].innerText,
                                style: 'ListHeading',
                            }));
                        }
                        subruns.push(new docx.TextRun({
                            text: block.children[1].innerText,
                        }));
                        stack.add(new docx.Paragraph({
                            children: subruns,
                            style: 'InlineList',
                        }));
                    } else {
                        if (flags.subitemcolumns) {
                            stack.changeColumns(3);
                        }

                        for (subitem of block.children[1].children) {
                            if (subitem.nodeName === 'LI') {
                                stack.add(new docx.Paragraph({
                                    text: subitem.innerText,
                                    numbering: {
                                        reference: 'subitem',
                                        level: 0,
                                    },
                                    style: 'ListParagraph',
                                }));
                            }
                        }

                        if (flags.subitemcolumns) {
                            stack.changeColumns(1);
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