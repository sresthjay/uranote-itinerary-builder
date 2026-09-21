export type MealTypeCode =
    | "veg"
    | "veg+non-veg"
    | "non-veg";

export const MEAL_TYPE_OPTIONS: {
    value: MealTypeCode;
    label: string;
}[] = [
    {
        value: "veg",
        label: "Veg",
    },
    {
        value: "veg+non-veg",
        label: "Veg + Non-Veg",
    },
    {
        value: "non-veg",
        label: "Non-Veg",
    },
];

export function formatMealType(
    mealType: string | null | undefined
): string | null {
    if (!mealType) {
        return null;
    }

    const value = mealType.trim().toLowerCase();

    const option = MEAL_TYPE_OPTIONS.find(
        (item) => item.value === value
    );

    return option?.label ?? mealType.trim();
}