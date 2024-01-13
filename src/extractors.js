export function getILCSChapters(ulChildren) {
    let chapterIndexString  = '';
    for(const uChild of ulChildren) {
        if (uChild.tagName === 'DIV')
            chapterIndexString += '\n' + uChild.innerText + '\n';
        else if (uChild.tagName === 'LI') {
            chapterIndexString += uChild.innerText + '\n';
            chapterIndexString += uChild.querySelector('a').href + '\n';
        }
    }
    return chapterIndexString;
}

export function getILCSActs(ulChildren) {
    let actIndexString = '';
    for (const ulChild of ulChildren) {
        if (ulChild.tagName === 'P') {
            actIndexString +=  '\n' + ulChild.innerText;
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