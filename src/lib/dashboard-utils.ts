/**
 * Calculate percentage change between two values
 * @param current - Current period value
 * @param previous - Previous period value
 * @returns Percentage change (positive or negative)
 */
export function calculatePercentageChange(current: number, previous: number): number {
    // Handle edge cases
    if (previous === 0) {
        if (current === 0) return 0;
        return current > 0 ? 100 : -100;
    }

    const change = ((current - previous) / Math.abs(previous)) * 100;
    return Number(change.toFixed(1));
}

/**
 * Format percentage for display
 * @param percentage - Percentage value
 * @returns Formatted string with + or - prefix
 */
export function formatPercentage(percentage: number): string {
    const sign = percentage >= 0 ? "+" : "";
    return `${sign}${percentage.toFixed(1)}%`;
}

/**
 * Determine if percentage change is positive (good) or negative (bad)
 * For expenses and payables, negative is good. For income and receivables, positive is good.
 * @param percentage - Percentage value
 * @param metricType - Type of metric ('income' | 'expense' | 'balance' | 'savings')
 * @returns 'positive' | 'negative'
 */
export function getChangeType(
    percentage: number,
    metricType: "income" | "expense" | "balance" | "savings" | "receivable" | "payable"
): "positive" | "negative" {
    // For expenses and payables, negative change is good (spending less)
    if (metricType === "expense" || metricType === "payable") {
        return percentage <= 0 ? "positive" : "negative";
    }

    // For income, balance, savings, and receivables, positive change is good
    return percentage >= 0 ? "positive" : "negative";
}

/**
 * Generate mock sparkline data for demonstration
 * @param length - Number of data points
 * @param trend - Trend direction ('up' | 'down' | 'flat')
 * @returns Array of numbers
 */
export function generateSparklineData(
    length: number = 12,
    trend: "up" | "down" | "flat" = "up"
): number[] {
    const data: number[] = [];
    let value = 100;

    for (let i = 0; i < length; i++) {
        const randomVariation = (Math.random() - 0.5) * 20;

        if (trend === "up") {
            value += Math.random() * 10 + randomVariation;
        } else if (trend === "down") {
            value -= Math.random() * 10 + randomVariation;
        } else {
            value += randomVariation;
        }

        data.push(Math.max(0, value));
    }

    return data;
}

/**
 * Calculate previous period dates based on current period
 * @param period - Period type
 * @param currentStart - Current period start date
 * @param currentEnd - Current period end date
 * @returns Previous period start and end dates
 */
export function getPreviousPeriod(
    period: "day" | "week" | "month" | "year" | "custom",
    currentStart: Date,
    currentEnd: Date
): { start: Date; end: Date } {
    const duration = currentEnd.getTime() - currentStart.getTime();
    const previousEnd = new Date(currentStart.getTime() - 1);
    const previousStart = new Date(previousEnd.getTime() - duration);

    return { start: previousStart, end: previousEnd };
}

/**
 * Format date for API queries (YYYY-MM-DD)
 * @param date - Date object
 * @returns Formatted date string
 */
export function formatDateForQuery(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}
