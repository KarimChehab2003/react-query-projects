export interface ExchangeRateResponse {
    conversion_rates: {
        [currencyCode: string]: number;
    }
}

export interface ConversionResponse {
    time_last_update_utc: string;
    base_code: string;
    target_code: string;
    conversion_rate: number;
    conversion_result: number
}
