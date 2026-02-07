export const KUDO_CONSTRAINTS = {
  MIN_POINTS: 10,
  MAX_POINTS: 50,
  MIN_DESCRIPTION_LENGTH: 10,
  MONTHLY_GIVING_BUDGET: 200,
} as const;

export const validateKudoPoints = (points: number): string | null => {
  if (points < KUDO_CONSTRAINTS.MIN_POINTS) {
    return `Points must be at least ${KUDO_CONSTRAINTS.MIN_POINTS}`;
  }
  if (points > KUDO_CONSTRAINTS.MAX_POINTS) {
    return `Points cannot exceed ${KUDO_CONSTRAINTS.MAX_POINTS}`;
  }
  return null;
};

export const validateKudoDescription = (description: string): string | null => {
  if (!description || description.trim().length < KUDO_CONSTRAINTS.MIN_DESCRIPTION_LENGTH) {
    return `Description must be at least ${KUDO_CONSTRAINTS.MIN_DESCRIPTION_LENGTH} characters`;
  }
  return null;
};

export const validateGivingBudget = (
  points: number,
  availableBudget: number
): string | null => {
  if (points > availableBudget) {
    return `Insufficient budget. You have ${availableBudget} points available`;
  }
  return null;
};

export const validateRewardRedemption = (
  pointsCost: number,
  userBalance: number
): string | null => {
  if (pointsCost > userBalance) {
    return `Insufficient points. You need ${pointsCost} but have ${userBalance}`;
  }
  return null;
};
