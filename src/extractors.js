export function getILCSIndexString(ulChildren) {
    let chapterIndexString  = '';

    for(const uChild of ulChildren) {
        if (
            (uChild.tagName === 'DIV' || uChild.tagName === 'P') && uChild.innerText !== '')
            chapterIndexString += 'category:' + uChild.innerText + '\n';
        else if (uChild.tagName === 'LI' && uChild.innerText !== '') {
            chapterIndexString += 'title: ' + uChild.innerText + '\n';
            chapterIndexString += 'url: ' + uChild.querySelector('a').href + '\n';
        }
    }

    return chapterIndexString;
}

// export function getILCSActs(ulChildren) {
//     let actIndexString = '';

//     for (const ulChild of ulChildren) {
//         if (ulChild.tagName === 'P') {
//             actIndexString +=  'category:' + ulChild.innerText + '\n';
//         }
//         else if (ulChild.tagName === 'LI') {
//             actIndexString += 'title' + ulChild.innerText + '\n';
//             actIndexString += 'url' + ulChild.querySelector('a').href + '\n';
//         }
//     }

//     return actIndexString;
// }

export function getILCSAct(pChildren) {
    let actText = '';

    for (const pChild of pChildren) {
        if (pChild.tagName === 'TABLE') {
            actText += pChild.innerText + '\n\n';
        }
    }

    return actText;
}