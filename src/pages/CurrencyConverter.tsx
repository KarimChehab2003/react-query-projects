import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FaArrowRight } from "react-icons/fa6";
import { IoIosWarning } from "react-icons/io";
import { RiArrowUpDownLine } from "react-icons/ri";
import type { ConversionResponse, ExchangeRateResponse } from "../types/CurrencyConverterTypes";


function CurrencyConverter() {
    const [fromCurrencyCode, setFromCurrencyCode] = useState<string>("");
    const [toCurrencyCode, setToCurrencyCode] = useState<string>("");
    const [amount, setAmount] = useState<number>(0);

    const apiKey = import.meta.env.VITE_EXCHANGE_RATE_API_KEY;

    const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const amountInt: number = Number.parseInt(event.target.value);
        if (!amountInt) return;
        setAmount(amountInt);
    }

    const getDefaultCurrencies = async () => {
        const res = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`);
        if (!res.ok) throw new Error("Could not fetch currency rates");
        const data: ExchangeRateResponse = await res.json();
        return data;
    }

    const getConversion = async () => {
        const res = await fetch(`https://v6.exchangerate-api.com/v6/e545b2ba130f652d7a84ac1e/pair/${fromCurrencyCode}/${toCurrencyCode}/${amount}`);
        if (!res.ok) throw new Error("Could not retrieve converted result");
        const data: ConversionResponse = await res.json();
        return data;
    }


    const { data: defaultCurrencies, isLoading, isError, error } = useQuery({
        queryKey: ["currencies"],
        queryFn: getDefaultCurrencies,
    })
    const currencyCodes = Object.keys(defaultCurrencies?.conversion_rates || {});

    const { data: conversionResult, mutate: convertCurrency } = useMutation({
        mutationKey: ["currencies", fromCurrencyCode, toCurrencyCode, amount],
        mutationFn: getConversion,

    })

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!fromCurrencyCode || !toCurrencyCode || !amount)
            return;

        convertCurrency();
    }


    return (
        <section className="min-h-screen flex justify-center items-center bg-gradient-to-br from-[#667eea] to-[#764ba2] poppins p-4">
            {
                isLoading || isError || defaultCurrencies && (
                    <>
                        {
                            isLoading && (
                                <div className="w-8 h-8 border-4 border-[#764ba2] border-b-transparent animate-spin"></div>
                            )
                        }

                        {
                            isError && (
                                <div className="flex justify-center items-center p-6">
                                    <IoIosWarning />
                                    <p>An error occurred: {error}</p>
                                </div>
                            )
                        }

                        {
                            <form className="bg-white/80 flex flex-col p-8 rounded-lg text-[#333 max-w-lg w-full space-y-6" onSubmit={handleSubmit}>
                                <h1 className="text-4xl font-bold capitalize text-center">currency converter</h1>

                                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 space-x-4 w-full">
                                    <div className="flex w-full flex-col grow">
                                        <label className="font-medium" htmlFor="fromInput" >From</label>
                                        <select className="bg-white rounded px-3 py-2 shadow-md" id="fromInput" onChange={(e) => setFromCurrencyCode(e.target.value)} required>
                                            <option value={""} hidden>Select currency</option>
                                            {
                                                currencyCodes.map((currency) => (
                                                    <option key={currency} value={currency}>{currency}</option>
                                                ))
                                            }
                                        </select>
                                    </div>

                                    <div className="p-2 rounded-full bg-blue-100 flex justify-center items-center cursor-pointer hover:rotate-180 transition-all duration-300 hover:bg-blue-200">
                                        <RiArrowUpDownLine className="text-blue-500 text-2xl" />
                                    </div>

                                    <div className="flex w-full flex-col grow">
                                        <label className="font-medium" htmlFor="toInput" >To</label>
                                        <select className="bg-white rounded px-3 py-2 shadow-md" id="toInput" onChange={(e) => setToCurrencyCode(e.target.value)} required>
                                            <option value={""} hidden>Select currency</option>
                                            {
                                                currencyCodes.map((currency) => (
                                                    <option key={currency} value={currency}>{currency}</option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                </div>

                                <div className="flex flex-col grow">
                                    <label htmlFor="amountInput">Amount</label>
                                    <input className="bg-white rounded px-3 py-2 shadow-md" type="number" id="amountInput" min={1} step={0.01} onChange={handleAmountChange} required />
                                </div>

                                <button className="text-white font-medium bg-gradient-to-r from-[#4f46e5] to-[#9333ea] py-2.5 rounded-lg cursor-pointer hover:-translate-y-0.5 transition-transform duration-200" type="submit">Convert</button>

                                {
                                    conversionResult && (
                                        <section className="bg-white rounded-lg shadow-sm p-4">
                                            <div className="flex justify-between items-center">
                                                <div className="flex flex-col">
                                                    <p className="font-light text-gray-600">From</p>
                                                    <p className="font-semibold text-lg">{amount + " " + conversionResult.base_code}</p>
                                                </div>

                                                <FaArrowRight className="text-gray-500 text-lg" />

                                                <div className="flex flex-col">
                                                    <p className="font-light text-gray-600">To</p>
                                                    <p className="font-semibold text-lg">{conversionResult.conversion_result + " " + conversionResult.target_code}</p>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-500 text-center">{1 + " " + conversionResult.base_code + " = " + conversionResult.conversion_rate + " " + " " + conversionResult.target_code}</p>
                                            <p className="text-sm text-gray-500 text-center">Last updated: {new Date(conversionResult.time_last_update_utc).toUTCString()}</p>
                                        </section>
                                    )
                                }

                            </form>
                        }
                    </>
                )
            }

        </section>
    );
}

export default CurrencyConverter;