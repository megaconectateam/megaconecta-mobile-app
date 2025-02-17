import moment from 'moment';

export const isToday = (date: Date) => {
  return moment().isSame(date, 'day');
};

export const isYesterday = (date: Date) => {
  return moment().subtract(1, 'days').isSame(date, 'day');
};
