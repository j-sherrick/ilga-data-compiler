export function getILCSChapters(listChildren) {
    let chapterIndexString  = '';
    for(const listChild of listChildren) {
        if (listChild.tagName === 'DIV')
            chapterIndexString += '\n' + listChild.innerText + '\n';
        else if (listChild.tagName === 'LI') {
            chapterIndexString += listChild.innerText + '\n';
            chapterIndexString += listChild.querySelector('a').href + '\n';
        }
    }
    return chapterIndexString;
}

export function getILCSActs(ulChildren) {
    let actIndexString = '';
    for (const ulChild of ulChildren) {
        if (ulChild.tagName === 'P') {
            actIndexString +=  '\n' + ulChild.innerText + '\n';
        }
        else if (ulChild.tagName === 'LI') {
            actIndexString += ulChild.innerText + '\n';
            actIndexString += ulChild.querySelector('a').href + '\n';
        }
    }
    return actIndexString;
}

export function getILCSAct(pChildren) {
    let actText = '';
    for (const pChild of pChildren) {
        if (pChild.tagName === 'TABLE') {
            actText += pChild.innerText + '\n\n';
        }
    }
    return actText;
}