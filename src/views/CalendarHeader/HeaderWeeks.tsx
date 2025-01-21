import dayjs from 'dayjs';
import * as React from 'react';
import { Table } from 'semantic-ui-react';
import localeData from 'dayjs/plugin/localeData';
import isoWeek from 'dayjs/plugin/isoWeek';

dayjs.extend(localeData); // Extend with localeData for weekday names
dayjs.extend(isoWeek); // Extend with isoWeek for consistent week start

const getWeekDays = (d, localization?: string): string[] => {
  const weekDays: string[] = [];
  const day = localization
    ? d().locale(localization).startOf('week')
    : d().startOf('week');

  for (let i = 0; i < 7; i++) {
    weekDays[i] = day.add(i, 'day').format('dd'); // Short weekday names
  }

  return weekDays;
};


const cellStyle = {
  border: 'none',
  borderBottom: '1px solid rgba(34,36,38,.1)',
};

const getWeekDayCells = (m, localization) => getWeekDays(m, localization).map((weekDay) => (
  <Table.HeaderCell
    key={weekDay}
    style={cellStyle}
    colSpan='1'>
    {weekDay}
  </Table.HeaderCell>
));

export interface HeaderWeeksProps {
  /** Moment date localization */
  localization?: string;
}

function HeaderWeeks(props: HeaderWeeksProps) {
  const {
    localization,
  } = props;

  return (
    <Table.Row>
      {getWeekDayCells(dayjs, localization)}
    </Table.Row>
  );
}

export default HeaderWeeks;
