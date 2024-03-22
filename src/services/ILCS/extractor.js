export class Extractor {
    static getChapterListing(html) {
        const chapters = Extractor.getListing(this.assertHTMLElements(html), true);
        return JSON.stringify(chapters);
    }
    static getActListing(html) {
        const acts = Extractor.getListing(this.assertHTMLElements(html), false);
        return JSON.stringify(acts);
    }
    static getActSections(html) {
        let sections = [];
        for (const el of html) {
            let sectionTitle = '';
            let sectionText = '';
            if (el.tagName === 'TITLE') {
                sectionTitle = el.innerText;
            }
            else if (el.tagName === 'TABLE') {
                sectionText = el.innerText;
                sections.push({
                    title: sectionTitle,
                    text: sectionText
                });
            }
        }
        return JSON.stringify(sections);
    }
    static assertHTMLElements(html) {
        return html.filter((el) => el instanceof HTMLElement);
    }
    static getListing(html, hasTopic) {
        let items = [];
        let currentTopic = '';
        for (const el of html) {
            if ((el.tagName === 'DIV' || el.tagName === 'P') && el.innerText !== '') {
                currentTopic = el.innerText.trim();
            }
            else if (el.tagName === 'LI' && el.innerText !== '') {
                const link = el.querySelector('a');
                const linkHref = link ? link.href : '';
                let item = { title: el.innerText.trim(), url: linkHref };
                if (hasTopic) {
                    item = { ...item, topic: currentTopic }; // For chapters
                }
                else if (currentTopic) {
                    item = { ...item, subtopic: currentTopic }; // For acts, if a topic exists
                }
                items.push(item);
            }
        }
        return items;
    }
}
