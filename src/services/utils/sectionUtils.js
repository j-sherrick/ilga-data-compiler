function parseSectionHeader(header) {
    header = normalizeNbsp(header);
    let [number, reference] = header.split(') (');
    let parsedHeader = {};
    if(reference) {
        parsedHeader.reference = reference.slice(0, -1);
        parsedHeader.number = number.split('/')[1];
    }
    else {
        parsedHeader.number = number.split('/')[1].slice(0, -1);
    }
    return parsedHeader;
}

function parseSectionSource(source) {
    return normalizeNbsp(source.match(SOURCE_REGEX)[1]).trim();
}

function parseSectionText(section) {
    let text = section.slice(1, -1).join(' ');
    return text;
}

export function parseSection(section) {
    section = section.split(NL).map(el => normalizeNbsp(el).trim()).filter(el => el !== '');
    const header = parseSectionHeader(section[0]);
    const source = parseSectionSource(section[section.length - 1]);
    const text = parseSectionText(section);
    return { header, text, source };
}

export function parseSectionsArray(act) {
    const sections = act.split('<TABLE_END>').filter( section => {
        return  section &&
                section !== ' ' &&
                section !== '\n' &&
                section !== '\n\n';
    }).map(section => section.trim());
    let parsedSections = [];
    for (const section of sections) {
        let parsedSection = parseSection(section);
        parsedSections.push(parsedSection);
    }
    return parsedSections
}

