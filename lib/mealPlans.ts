export type MealPlanCode =
    | "EP"
    | "CP"
    | "MAP"
    | "AP";

export const MEAL_PLAN_OPTIONS: {
    value: MealPlanCode;
    label: string;
}[] = [
    {
        value: "EP",
        label: "EP – Room Only",
    },
    {
        value: "CP",
        label: "CP – Breakfast",
    },
    {
        value: "MAP",
        label:
            "MAP – Breakfast + Dinner",
    },
    {
        value: "AP",
        label:
            "AP – Breakfast + Lunch + Dinner",
    },
];

const MEAL_PLAN_LABELS = Object.fromEntries(
    MEAL_PLAN_OPTIONS.map((option) => [
        option.value,
        option.label,
    ])
) as Record<MealPlanCode, string>;

const MEAL_PLAN_PATTERNS = MEAL_PLAN_OPTIONS.map(
    (option) => ({
        code: option.value,
        pattern: new RegExp(
            `^${option.value}\\b`,
            "i"
        ),
    })
);

export function formatMealPlan(
    mealPlan: string | null | undefined
): string | null {
    if (!mealPlan) {
        return null;
    }

    const value = mealPlan.trim();

    const match = MEAL_PLAN_PATTERNS.find(
        ({ pattern }) =>
            pattern.test(value)
    );

    if (match) {
        return MEAL_PLAN_LABELS[match.code];
    }

    return value;
}