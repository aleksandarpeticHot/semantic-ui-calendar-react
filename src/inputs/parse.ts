import isNil from 'lodash/isNil';
import isArray from 'lodash/isArray';
import isString from 'lodash/isString';
import compact from 'lodash/compact';
import dayjs, { Dayjs } from 'dayjs';
import { createDayjsDate } from '../util';

export const TIME_FORMAT = {
  24: 'HH:mm',
  AMPM: 'hh:mm A',
  ampm: 'hh:mm a',
};

type ParseValueData =
  | string
  | Dayjs
  | Date;

/** Parse string, moment, Date.
 *
 * Return unedfined on invalid input.
 */
export function parseValue(value: ParseValueData, dateFormat: string, localization: string): Dayjs | undefined {
  if (!isNil(value) && !isNil(dateFormat)) {
    const date = dayjs(value, dateFormat); // Parse the date using the format
    if (date.isValid()) {
      return date.locale(localization); // Apply localization if the date is valid
    }
  }
  return undefined; // Return undefined if parsing fails
}

type ParseArrayOrValueData =
  | ParseValueData
  | ParseValueData[];

/** Parse string, moment, Date, string[], moment[], Date[].
 *
 * Return array of moments. Returned value contains only valid moments.
 * Return undefined if none of the input values are valid.
 */
export function parseArrayOrValue(data: ParseArrayOrValueData, dateFormat: string, localization: string) {
  if (isArray(data)) {
    const parsed = compact((data as ParseValueData[]).map((item) => parseValue(item, dateFormat, localization)));
    if (parsed.length > 0) {
      return parsed;
    }
  }
  const parsedValue = parseValue((data as ParseValueData), dateFormat, localization);

  return parsedValue && [parsedValue];
}

interface DateParams {
  year?: number;
  month?: number;
  date?: number;
  hour?: number;
  minute?: number;
}

interface GetInitializerParams {
  dateParams?: DateParams;
  initialDate?: ParseValueData;
  dateFormat?: string;
  localization?: string;
}

/** Create moment.
 *
 * Creates moment using `dateParams` or `initialDate` arguments (if provided).
 * Precedense order: dateParams -> initialDate -> default value
 */
export function getInitializer(context: GetInitializerParams): Dayjs {
  const {
    dateParams,
    initialDate,
    dateFormat,
    localization,
  } = context;
  if (dateParams) {
    const dayjsDateParams = createDayjsDate(dateParams)
    const parsedParams = localization ? dayjs(dayjsDateParams).locale(localization) : dayjs(dayjsDateParams);
    if (parsedParams.isValid()) {
      return parsedParams;
    }
  }
  const parsedInitialDate = parseValue(initialDate, dateFormat, localization);
  if (parsedInitialDate) {
    return parsedInitialDate;
  }

  return localization ? dayjs().locale(localization) : dayjs();
}

type InitialDate = string | Dayjs | Date;
type DateValue = InitialDate;

/** Creates moment instance from provided value or initialDate.
 *  Creates today by default.
 */
export function buildValue(
  value: ParseValueData,
  initialDate: InitialDate,
  localization: string,
  dateFormat: string,
  defaultVal = dayjs()): Dayjs {
  const valueParsed = parseValue(value, dateFormat, localization);
  if (valueParsed) {
    return valueParsed;
  }
  const initialDateParsed = parseValue(initialDate, dateFormat, localization);
  if (initialDateParsed) {
    return initialDateParsed;
  }
  const _defaultVal = defaultVal ? defaultVal.clone() : defaultVal;
  if (_defaultVal) {
    _defaultVal.locale(localization);
  }

  return _defaultVal;
}

export function dateValueToString(value: DateValue, dateFormat: string, locale: string): string {
  if (isString(value)) {
    return value;
  }
  if (dayjs.isDayjs(value)) {
    const _value = value.clone();
    _value.locale(locale);

    return _value.format(dateFormat);
  }

  const date = dayjs(value, dateFormat);
  if (date.isValid()) {
    date.locale(locale);

    return date.format(dateFormat);
  }

  return '';
}

function cleanDate(inputString: string, dateFormat: string): string {
  const formattedDateLength = dayjs().format(dateFormat).length;

  return inputString.trim().slice(0, formattedDateLength);
}

interface Range {
  start?: Dayjs;
  end?: Dayjs;
}

/**
 * Extract start and end dates from input string.
 * Return { start: Moment|undefined, end: Moment|undefined }
 * @param {string} inputString Row input string from user
 * @param {string} dateFormat Moment formatting string
 * @param {string} inputSeparator Separator for split inputString
 */
export function parseDatesRange(
  inputString: string = '',
  dateFormat: string = '',
  inputSeparator: string = ' - ',
): Range {
  const dates = inputString.split(inputSeparator)
    .map((date) => cleanDate(date, dateFormat));
  const result: Range = {};
  let start;
  let end;

  start = dayjs(dates[0], dateFormat);
  if (dates.length === 2) {
    end = dayjs(dates[1], dateFormat);
  }
  if (start && start.isValid()) {
    result.start = start;
  }
  if (end && end.isValid()) {
    result.end = end;
  }

  return result;
}
