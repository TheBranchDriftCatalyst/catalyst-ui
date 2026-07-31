import type { Meta, StoryObj } from "@storybook/react";
import { PaymentQR } from "./PaymentQR";

const meta = {
  title: "Contexts/Monetization/PaymentQR",
  component: PaymentQR,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Thin wrapper around `qrcode.react`'s `QRCodeSVG` that always renders on a white background so the QR stays scannable under any theme (dark themes would otherwise invert the QR modules and break scanners).",
      },
    },
  },
  argTypes: {
    level: {
      options: ["L", "M", "Q", "H"],
      control: { type: "radio" },
      description: "Error-correction level. Higher = more resilient to logos/damage.",
    },
    size: { control: { type: "range", min: 64, max: 400, step: 16 } },
    marginSize: { control: { type: "range", min: 0, max: 8, step: 1 } },
  },
} satisfies Meta<typeof PaymentQR>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BitcoinURI: Story = {
  args: {
    value: "bitcoin:bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh?amount=0.001&label=Catalyst",
    size: 200,
  },
};

export const LightningURI: Story = {
  args: {
    value: "lightning:LNURL1DP68GURN8GHJ7UM9WFMXJCM99E3K7MF0V9CXJ0F4X5CQZQ",
    size: 200,
  },
};

export const VenmoDeepLink: Story = {
  args: {
    value: "venmo://paycharge?txn=pay&recipients=catalystui&amount=5.00",
    size: 200,
  },
};

export const Large: Story = {
  args: {
    value: "bitcoin:bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    size: 320,
  },
};

export const HighErrorCorrection: Story = {
  args: {
    value: "bitcoin:bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    size: 200,
    level: "H",
  },
  parameters: {
    docs: {
      description: {
        story:
          'Use `level="H"` (30% recovery) when the QR will be printed or overlaid with a logo. Increases pixel density.',
      },
    },
  },
};
