import DualCurrencySelector from "./DualCurrencySelector";
import { FloatingSelectCurrency } from "./floating-select-currency";

export function ExampleUsage() {
  return (
    <DualCurrencySelector>
      {({ fromProps, toProps, fromLabel, toLabel }) => (
        <div className="flex gap-4">
          <FloatingSelectCurrency
            value={fromProps.value}
            onValueChange={fromProps.onValueChange}
            currencies={fromProps.currencies}
            label={fromLabel}
          />
          <FloatingSelectCurrency
            value={toProps.value}
            onValueChange={toProps.onValueChange}
            currencies={toProps.currencies}
            label={toLabel}
          />
        </div>
      )}
    </DualCurrencySelector>
  );
}
