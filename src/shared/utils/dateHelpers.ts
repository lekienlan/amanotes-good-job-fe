import { startOfMonth, isBefore } from 'date-fns';

export const shouldResetBudget = (lastBudgetReset?: string): boolean => {
  if (!lastBudgetReset) return true;
  const currentMonthStart = startOfMonth(new Date());
  return isBefore(new Date(lastBudgetReset), currentMonthStart);
};

export const getMonthStart = (): string => {
  return startOfMonth(new Date()).toISOString();
};
