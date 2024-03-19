import { IChapter } from '@interfaces/IChapter.js';
import { IAct } from '@interfaces/IAct.js';
import { ISection } from '@interfaces/ISection.js';

export class Extractor {

    private static getListing(html: HTMLElement[], hasTopic: boolean): Array<IChapter | IAct> {
        let items: Array<IChapter | IAct> = [];
        let currentTopic = '';
        for(const el of html) {
            if ((el.tagName === 'DIV' || el.tagName === 'P') && el.innerText !== '') {
                currentTopic = el.innerText.trim();
            } else if (el.tagName === 'LI' && el.innerText !== '') {
                const link = el.querySelector('a');
                const linkHref = link ? link.href : '';
                let item: IChapter | IAct = {title: el.innerText.trim(), url: linkHref};
                if (hasTopic) {
                    item = { ...item, topic: currentTopic }; // For chapters
                } else if (currentTopic) {
                    item = { ...item, subtopic: currentTopic }; // For acts, if a topic exists
                }
                items.push(item);
            }
        }
        return items;
    }

    public static getChapterListing(html: HTMLElement[]): string {
        const chapters = Extractor.getListing(html, true);
        return JSON.stringify(chapters);
    }

    public static getActListing(html: HTMLElement[]): string {
        const acts = Extractor.getListing(html, false);
        return JSON.stringify(acts);
    }

    public static getActSections(html: HTMLElement[]): string {
        let sections: ISection[] = [];
        for(const el of html) {
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
}