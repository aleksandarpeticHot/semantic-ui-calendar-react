import range from 'lodash/range';
import includes from 'lodash/includes';
import isNil from 'lodash/isNil';
import isArray from 'lodash/isArray';
import uniq from 'lodash/uniq';
import some from 'lodash/some';
import localeData from 'dayjs/plugin/localeData';
import 'dayjs/locale/en';
import 'dayjs/locale/de';
import 'dayjs/locale/nl';
import 'dayjs/locale/fr';
import 'dayjs/locale/nl-be';

import dayjs, { Dayjs } from 'dayjs';
import { MONTHS_IN_YEAR } from './const';

const buildCalendarValues = (localization?: string): string[] => {
  /*
    Return array of months (strings) like ['Aug', 'Sep', ...]
    that is used to populate the calendar's page.
  */
  if (localization) {
    dayjs.locale(localization); // Dynamically set locale
  }

  const localLocale = dayjs.localeData(); // Get the current locale data
  return localLocale.monthsShort(); // Return an array of short month names
};

const getInitialDatePosition = (
  selectable: number[],
  currentDate: Dayjs,
): number => {
  if (selectable.indexOf(currentDate.month()) < 0) {
    return selectable[0];
  }

  return currentDate.month();
};

const getDisabledPositions = (
  enable: Dayjs[],
  disable: Dayjs[],
  maxDate: Dayjs,
  minDate: Dayjs,
  currentDate: Dayjs,
): number[] => {
  /*
    Return position numbers of months that should be displayed as disabled
    (position in array returned by `this.buildCalendarValues`).
  */
  let disabled = [];
  if (isArray(enable)) {
    const enabledMonthPositions = enable
      .filter((monthMoment) => monthMoment.isSame(currentDate, 'year'))
      .map((monthMoment) => monthMoment.month());
    disabled = disabled.concat(range(0, MONTHS_IN_YEAR)
      .filter((monthPosition) => !includes(enabledMonthPositions, monthPosition)));
  }
  if (isArray(disable)) {
    disabled = disabled.concat(disable
      .filter((monthMoment) => monthMoment.year() === currentDate.year())
      .map((monthMoment) => monthMoment.month()));
  }
  if (!isNil(maxDate)) {
    if (maxDate.year() === currentDate.year()) {
      disabled = disabled.concat(
        range(maxDate.month() + 1, MONTHS_IN_YEAR));
    }
    if (maxDate.year() < currentDate.year()) {
      disabled = range(0, MONTHS_IN_YEAR);
    }
  }
  if (!isNil(minDate)) {
    if (minDate.year() === currentDate.year()) {
      disabled = disabled.concat(range(0, minDate.month()));
    }
    if (minDate.year() > currentDate.year()) {
      disabled = range(0, MONTHS_IN_YEAR);
    }
  }
  if (disabled.length > 0) {
    return uniq(disabled);
  }
};

const isNextPageAvailable = (
  maxDate: Dayjs,
  enable: Dayjs[],
  currentDate: Dayjs,
): boolean => {
  if (isArray(enable)) {
    return some(enable, (enabledMonth) => enabledMonth.isAfter(currentDate, 'year'));
  }
  if (isNil(maxDate)) {
    return true;
  }

  return currentDate.year() < maxDate.year();
};

const isPrevPageAvailable = (
  minDate: Dayjs,
  enable: Dayjs[],
  currentDate: Dayjs,
): boolean => {
  if (isArray(enable)) {
    return some(enable, (enabledMonth) => enabledMonth.isBefore(currentDate, 'year'));
  }
  if (isNil(minDate)) {
    return true;
  }

  return currentDate.year() > minDate.year();
};

export {
  buildCalendarValues,
  getInitialDatePosition,
  getDisabledPositions,
  isNextPageAvailable,
  isPrevPageAvailable,
};
