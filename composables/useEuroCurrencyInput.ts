import type { CurrencyInputOptions } from 'vue-currency-input'
import { useCurrencyInput } from 'vue-currency-input'

export function useEuroCurrencyInput(customOptions?: Partial<CurrencyInputOptions>) {
  const defaultOptions: CurrencyInputOptions = {
    locale: "de-DE",
    currency: "EUR",
    valueRange: {
      min: 0,
      max: 999.99
    },
    hideCurrencySymbolOnFocus: true,
    hideGroupingSeparatorOnFocus: true,
    hideNegligibleDecimalDigitsOnFocus: true,
    //autoDecimalDigits: true,
    useGrouping: true,
    accountingSign: false,
  }

  // Merge default options with any custom options provided
  const options = { ...defaultOptions, ...customOptions }
  return useCurrencyInput(options)
}
