import { IObject } from 'src/typings/common';
import moment = require('moment');

export const parseDataObject = (object: object): object => JSON.parse(JSON.stringify(object));

export const offset = (page: number = 1, per_page: number = 10): number => (page - 1) * per_page;

export const isEmptyObject = (object: object): boolean => !Object.keys(object).length;

export const isEmptyArray = (array: any[]): boolean => array.length === 0;

export const trimObjectKey = (object: IObject): IObject => {
    Object.keys(object).forEach(
        (key: string): boolean =>
            (object[key] === null || object[key] === '' || object[key] === undefined) && delete object[key]
    );
    return object;
};

export const stringifyObjectKey = (object: IObject): IObject => {
    Object.keys(object).forEach((key: string): void => {
        object[key] = String(object[key]);
    });
    return object;
};

export const sorter = (sort: string = '-created_at'): string[] => {
    let sortString = sort;
    let sortMethod;

    if (sortString.charAt(0) === '-') {
        sortMethod = 'desc';
        sortString = sort.substr(1);
    } else {
        sortMethod = 'asc';
    }

    return [sortString, sortMethod];
};

export const timestamp = (): string => moment().utc().toISOString();

export const parseCoordinate = (coordinate: string): number[] => {
    return coordinate.split(',').map((item: string): number => +item.trim());
};

export const parseCoordinate2 = (coordinate: string): { lat: number; lng: number } => {
    const [lat, lng] = coordinate.split(',').map((item: string): number => +item.trim());
    return {
        lat,
        lng
    };
};

export default {
    parseDataObject,
    offset,
    isEmptyArray,
    isEmptyObject,
    trimObjectKey,
    stringifyObjectKey
};
