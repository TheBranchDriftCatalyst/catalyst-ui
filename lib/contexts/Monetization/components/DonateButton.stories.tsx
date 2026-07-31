import type { Meta, StoryObj } from "@storybook/react";
import { SiBitcoin, SiKofi, SiLightning, SiPaypal, SiVenmo } from "@icons-pack/react-simple-icons";
import { MonetizationProvider } from "../MonetizationProvider";
import { bitcoin } from "../adapters/bitcoin";
import { kofi } from "../adapters/kofi";
import { lightning } from "../adapters/lightning";
import { paypal } from "../adapters/paypal";
import { venmo } from "../adapters/venmo";
import { DonateButton } from "./DonateButton";

// Realistic-shaped but fake handles/addresses. Safe to keep in Storybook.
const DEMO_BTC = "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh";
const DEMO_LNURL = "LNURL1DP68GURN8GHJ7UM9WFMXJCM99E3K7MF0V9CXJ0F4X5CQZQ";

const meta = {
  title: "Contexts/Monetization/DonateButton",
  component: DonateButton,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Provider-agnostic donation button. Reads the adapter from the surrounding `MonetizationProvider` and dispatches on `kind` — link/deep-link render as anchors, `crypto-address` opens a QR dialog, `sdk-checkout` calls `initiate()` and displays the returned `PaymentIntent`.",
      },
    },
  },
  decorators: [
    Story => (
      <MonetizationProvider
        providers={[
          bitcoin({ address: DEMO_BTC, label: "Catalyst UI Demo" }),
          lightning({ lnurl: DEMO_LNURL }),
          paypal({ handle: "catalystui" }),
          venmo({ handle: "catalystui" }),
          kofi({ handle: "catalystui" }),
        ]}
        defaultCurrency="USD"
      >
        <Story />
      </MonetizationProvider>
    ),
  ],
} satisfies Meta<typeof DonateButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Bitcoin: Story = {
  args: {
    providerId: "bitcoin",
    amount: 0.001,
    currency: "BTC",
    icon: <SiBitcoin size={16} />,
  },
};

export const Lightning: Story = {
  args: {
    providerId: "lightning",
    icon: <SiLightning size={16} />,
  },
};

export const PayPal: Story = {
  args: {
    providerId: "paypal",
    amount: 20,
    currency: "USD",
    variant: "outline",
    icon: <SiPaypal size={16} />,
  },
};

export const Venmo: Story = {
  args: {
    providerId: "venmo",
    amount: 5,
    variant: "secondary",
    icon: <SiVenmo size={16} />,
  },
};

export const Kofi: Story = {
  args: {
    providerId: "kofi",
    variant: "secondary",
    icon: <SiKofi size={16} />,
  },
};

export const AllProviders: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <DonateButton
        providerId="bitcoin"
        amount={0.001}
        currency="BTC"
        icon={<SiBitcoin size={16} />}
      >
        Bitcoin
      </DonateButton>
      <DonateButton providerId="lightning" icon={<SiLightning size={16} />}>
        Lightning
      </DonateButton>
      <DonateButton providerId="paypal" amount={20} variant="outline" icon={<SiPaypal size={16} />}>
        PayPal
      </DonateButton>
      <DonateButton providerId="venmo" amount={5} variant="secondary" icon={<SiVenmo size={16} />}>
        Venmo
      </DonateButton>
      <DonateButton providerId="kofi" variant="secondary" icon={<SiKofi size={16} />}>
        Ko-fi
      </DonateButton>
    </div>
  ),
};

export const UnknownProvider: Story = {
  args: {
    providerId: "does-not-exist",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Unknown provider ids render `null` and emit a dev warning — this keeps composite widgets from crashing when an adapter is removed but a downstream button is not.",
      },
    },
  },
};
