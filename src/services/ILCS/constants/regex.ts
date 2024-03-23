import { EnumType } from 'typescript';

export const NBSP_REGEX: RegExp = /\u00A0+/g;
export const NL_REGEX: RegExp = /\n+/g;
export const CHAPTER_REGEX: RegExp = /\d{1,3}/;
export const SOURCE_REGEX: RegExp = /\((.*?)\)/;
