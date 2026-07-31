import { SiBitcoin, SiKofi, SiLightning, SiPaypal, SiVenmo } from "@icons-pack/react-simple-icons";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/catalyst-ui/ui/card";
import { Input } from "@/catalyst-ui/ui/input";
import { Label } from "@/catalyst-ui/ui/label";
import { Typography } from "@/catalyst-ui/ui/typography";
import { Badge } from "@/catalyst-ui/ui/badge";
import { ScrollSnapItem } from "@/catalyst-ui/effects";
import {
  DonateButton,
  MonetizationProvider,
  PaymentQR,
  adapters,
  useMonetization,
} from "@/catalyst-ui/contexts/Monetization";

export const TAB_ORDER = 45;

// --- Demo config -------------------------------------------------------------
// Realistic-shaped but non-functional handles. Replace with your own if you
// fork the app.
const DEMO_BTC = "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh";
const DEMO_LNURL = "LNURL1DP68GURN8GHJ7UM9WFMXJCM99E3K7MF0V9CXJ0F4X5CQZQ";
const DEMO_HANDLE = "catalystui";

/**
 * Kitchen-sink tab for the provider-agnostic Monetization system.
 *
 * Wraps its own MonetizationProvider so the tab is a fully self-contained
 * example — copy-paste this file into your own app and adjust the config
 * constants above.
 */
export function MonetizationTab() {
  return (
    <MonetizationProvider
      providers={[
        adapters.bitcoin({ address: DEMO_BTC, label: "Catalyst UI Demo" }),
        adapters.lightning({ lnurl: DEMO_LNURL }),
        adapters.paypal({ handle: DEMO_HANDLE }),
        adapters.venmo({ handle: DEMO_HANDLE }),
        adapters.kofi({ handle: DEMO_HANDLE }),
      ]}
      defaultCurrency="USD"
    >
      <MonetizationDemo />
    </MonetizationProvider>
  );
}

function MonetizationDemo() {
  const { providers, getProvider, defaultCurrency } = useMonetization();
  const [amount, setAmount] = useState<number>(20);
  const [btcAmount, setBtcAmount] = useState<number>(0.001);
  const [customQR, setCustomQR] = useState<string>(
    "bitcoin:bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh?amount=0.001"
  );

  const kindBadge = (kind: string) =>
    ({
      "crypto-address": "default",
      link: "secondary",
      "deep-link": "outline",
      "sdk-checkout": "destructive",
    })[kind] as "default" | "secondary" | "outline" | "destructive";

  return (
    <div className="space-y-6 mt-0">
      {/* Overview */}
      <ScrollSnapItem align="start">
        <Card>
          <CardHeader>
            <CardTitle>Monetization</CardTitle>
            <CardDescription>
              Provider-agnostic donation / checkout system • Adapter pattern • Bitcoin, Lightning,
              PayPal, Venmo, Ko-fi — Stripe-ready
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Typography variant="h4" className="text-sm font-semibold">
                  What it is
                </Typography>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>One interface for all payment methods</li>
                  <li>Adapters are plain data (no React deps)</li>
                  <li>
                    Sync path (<code>getDisplay</code>) for addresses/links
                  </li>
                  <li>
                    Async path (<code>initiate</code>) for checkout flows
                  </li>
                  <li>Consumer-supplied config, no hidden API calls</li>
                </ul>
              </div>
              <div className="space-y-2">
                <Typography variant="h4" className="text-sm font-semibold">
                  Kind matrix
                </Typography>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>
                    <Badge variant="default" className="mr-2">
                      crypto-address
                    </Badge>
                    QR + copyable address (Bitcoin, Lightning)
                  </div>
                  <div>
                    <Badge variant="secondary" className="mr-2">
                      link
                    </Badge>
                    New-tab redirect (PayPal, Ko-fi, Venmo web)
                  </div>
                  <div>
                    <Badge variant="outline" className="mr-2">
                      deep-link
                    </Badge>
                    URI-scheme handoff (native app)
                  </div>
                  <div>
                    <Badge variant="destructive" className="mr-2">
                      sdk-checkout
                    </Badge>
                    Async initiate (Stripe, LNURL — future)
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </ScrollSnapItem>

      {/* Amount controls */}
      <ScrollSnapItem align="start">
        <Card>
          <CardHeader>
            <CardTitle>Shared donation context</CardTitle>
            <CardDescription>
              Adjust the amount below — every DonateButton on this page uses these values.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fiat-amount">Fiat amount ({defaultCurrency})</Label>
                <Input
                  id="fiat-amount"
                  type="number"
                  min={1}
                  step={1}
                  value={amount}
                  onChange={e => setAmount(Number(e.target.value) || 0)}
                />
                <p className="text-xs text-muted-foreground">Used by PayPal and Venmo.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="btc-amount">Bitcoin amount (BTC)</Label>
                <Input
                  id="btc-amount"
                  type="number"
                  min={0.00000001}
                  step={0.0001}
                  value={btcAmount}
                  onChange={e => setBtcAmount(Number(e.target.value) || 0)}
                />
                <p className="text-xs text-muted-foreground">
                  Used by the Bitcoin adapter — no built-in fiat conversion.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </ScrollSnapItem>

      {/* Adapter cards */}
      <ScrollSnapItem align="start">
        <div className="grid md:grid-cols-2 gap-4">
          {providers.map(p => {
            const info = p.getDisplay?.(
              p.id === "bitcoin"
                ? { amount: btcAmount, currency: "BTC" }
                : { amount, currency: defaultCurrency }
            );
            const preview = info?.uri ?? info?.href ?? "(no display info)";
            const icon = {
              bitcoin: <SiBitcoin size={18} />,
              lightning: <SiLightning size={18} />,
              paypal: <SiPaypal size={18} />,
              venmo: <SiVenmo size={18} />,
              kofi: <SiKofi size={18} />,
            }[p.id];
            return (
              <Card key={p.id}>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    {icon}
                    <CardTitle className="text-base">{p.label}</CardTitle>
                    <Badge variant={kindBadge(p.kind)} className="ml-auto text-[10px]">
                      {p.kind}
                    </Badge>
                  </div>
                  {info?.hint && <CardDescription>{info.hint}</CardDescription>}
                </CardHeader>
                <CardContent className="space-y-3">
                  <DonateButton
                    providerId={p.id}
                    amount={p.id === "bitcoin" ? btcAmount : amount}
                    currency={p.id === "bitcoin" ? "BTC" : defaultCurrency}
                    icon={icon}
                    className="w-full"
                  />
                  <div className="rounded-md border bg-muted/40 p-2">
                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1">
                      generated {info?.href ? "href" : "uri"}
                    </p>
                    <code className="block truncate font-mono text-[11px]">{preview}</code>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-3 text-xs text-muted-foreground">
                  <code>
                    adapters.{p.id}({"{ ... }"})
                  </code>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </ScrollSnapItem>

      {/* PaymentQR standalone */}
      <ScrollSnapItem align="start">
        <Card>
          <CardHeader>
            <CardTitle>PaymentQR — standalone</CardTitle>
            <CardDescription>
              Reusable QR component • Always renders on white so it stays scannable under any theme
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 items-start">
              <div className="space-y-2">
                <Label htmlFor="qr-value">QR value</Label>
                <Input
                  id="qr-value"
                  value={customQR}
                  onChange={e => setCustomQR(e.target.value)}
                  placeholder="Any URI: bitcoin:…, lightning:…, venmo://…"
                />
                <p className="text-xs text-muted-foreground">
                  Try pasting any URI from the adapter cards above.
                </p>
              </div>
              <div className="flex justify-center">
                {customQR ? <PaymentQR value={customQR} size={192} /> : null}
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <code className="text-xs text-muted-foreground">
              import {"{ PaymentQR }"} from '@/catalyst-ui/contexts/Monetization';
            </code>
          </CardFooter>
        </Card>
      </ScrollSnapItem>

      {/* Adapter lookup demo */}
      <ScrollSnapItem align="start">
        <Card>
          <CardHeader>
            <CardTitle>useMonetization()</CardTitle>
            <CardDescription>
              Hook for direct adapter access — build custom widgets or check registration state
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="rounded-md border bg-muted/40 p-3 space-y-1">
              <p className="text-xs">
                <strong>Registered:</strong> {providers.map(p => p.id).join(", ")}
              </p>
              <p className="text-xs">
                <strong>Default currency:</strong> {defaultCurrency}
              </p>
              <p className="text-xs">
                <strong>Bitcoin adapter exists:</strong> {getProvider("bitcoin") ? "yes" : "no"}
              </p>
              <p className="text-xs">
                <strong>Stripe adapter exists:</strong>{" "}
                {getProvider("stripe") ? "yes" : "no (future)"}
              </p>
            </div>
          </CardContent>
        </Card>
      </ScrollSnapItem>

      {/* Config snippet */}
      <ScrollSnapItem align="start">
        <Card>
          <CardHeader>
            <CardTitle>Setup</CardTitle>
            <CardDescription>Wrap your app once, then use anywhere below.</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="overflow-x-auto rounded-md border bg-muted/40 p-3 text-xs">
              <code>{`import {
  MonetizationProvider,
  adapters,
  DonateButton,
} from "@/catalyst-ui/contexts/Monetization";

<MonetizationProvider
  providers={[
    adapters.bitcoin({ address: "bc1q...", label: "Support" }),
    adapters.lightning({ lnurl: "LNURL1..." }),
    adapters.paypal({ handle: "yourname" }),
    adapters.venmo({ handle: "yourname" }),
    adapters.kofi({ handle: "yourname" }),
  ]}
  defaultCurrency="USD"
>
  <App />
</MonetizationProvider>

// Then, anywhere below:
<DonateButton providerId="bitcoin" amount={0.001} currency="BTC" />
<DonateButton providerId="paypal" amount={20} variant="outline" />`}</code>
            </pre>
          </CardContent>
        </Card>
      </ScrollSnapItem>
    </div>
  );
}
