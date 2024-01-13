const SERIES_NAMES = [
    'GOVERNMENT',
    'EDUCATION',
    'REGULATION',
    'HUMAN NEEDS',
    'HEALTH AND SAFETY',
    'AGRICULTURE AND CONSERVATION',
    'TRANSPORTATION',
    'RIGHTS AND REMEDIES',
    'BUSINESS AND EMPLOYMENT'
];

const SERIES_NUMBERS = [
    '00',
    '100',
    '200',
    '300',
    '400',
    '500',
    '600',
    '700',
    '800'
];
const NBSP_REGEX = /&nbsp;+/g;
const NL_REGEX = /\n+/g;
const SP = ' ';;

export function parseActText(actArrayBySection) {
    const actArrayBySection = actArrayBySection.split('\n\n');
    let act = {};
}
browser.close();