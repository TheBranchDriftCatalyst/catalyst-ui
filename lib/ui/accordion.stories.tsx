import type { Meta, StoryObj } from "@storybook/react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./accordion";

const meta = {
  title: "UI/Accordion",
  component: Accordion,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = {
  render: () => (
    <Accordion type="single" collapsible className="w-[450px]">
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>
          Yes. It adheres to the WAI-ARIA design pattern and uses proper ARIA attributes for screen readers.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Is it styled?</AccordionTrigger>
        <AccordionContent>
          Yes. It comes with default styles that matches the aesthetic of other components in the library.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Is it animated?</AccordionTrigger>
        <AccordionContent>
          Yes. It's animated by default with smooth expand/collapse transitions, but you can disable animations if needed.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const Multiple: Story = {
  render: () => (
    <Accordion type="multiple" className="w-[450px]">
      <AccordionItem value="item-1">
        <AccordionTrigger>Can I select multiple items?</AccordionTrigger>
        <AccordionContent>
          Yes! This accordion uses type="multiple", allowing multiple panels to be open simultaneously.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>What about closing items?</AccordionTrigger>
        <AccordionContent>
          Each item can be independently opened or closed. Try opening all three panels at once!
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>How is this different from single?</AccordionTrigger>
        <AccordionContent>
          The single type only allows one panel open at a time, automatically closing others when a new one is opened.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const WithDefaultOpen: Story = {
  render: () => (
    <Accordion type="single" defaultValue="item-2" collapsible className="w-[450px]">
      <AccordionItem value="item-1">
        <AccordionTrigger>First Item</AccordionTrigger>
        <AccordionContent>
          This item starts closed.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Second Item (Default Open)</AccordionTrigger>
        <AccordionContent>
          This item starts open by default using defaultValue="item-2".
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Third Item</AccordionTrigger>
        <AccordionContent>
          This item also starts closed.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const FAQ: Story = {
  render: () => (
    <Accordion type="single" collapsible className="w-[600px]">
      <AccordionItem value="item-1">
        <AccordionTrigger>What payment methods do you accept?</AccordionTrigger>
        <AccordionContent>
          <p>We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for enterprise customers.</p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Can I cancel my subscription anytime?</AccordionTrigger>
        <AccordionContent>
          <p>Yes, you can cancel your subscription at any time from your account settings. Your access will continue until the end of your current billing period.</p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Do you offer refunds?</AccordionTrigger>
        <AccordionContent>
          <p>We offer a 30-day money-back guarantee for all new subscriptions. If you're not satisfied, contact our support team for a full refund.</p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-4">
        <AccordionTrigger>Is there a free trial available?</AccordionTrigger>
        <AccordionContent>
          <p>Yes! We offer a 14-day free trial with full access to all features. No credit card required to start.</p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const NestedContent: Story = {
  render: () => (
    <Accordion type="single" collapsible className="w-[500px]">
      <AccordionItem value="item-1">
        <AccordionTrigger>Features</AccordionTrigger>
        <AccordionContent>
          <ul className="list-disc list-inside space-y-1">
            <li>Fully accessible</li>
            <li>Keyboard navigation</li>
            <li>Smooth animations</li>
            <li>Customizable styling</li>
          </ul>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Technical Details</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-2">
            <p className="font-semibold">Built with:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Radix UI primitives</li>
              <li>Tailwind CSS</li>
              <li>TypeScript</li>
            </ul>
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Code Example</AccordionTrigger>
        <AccordionContent>
          <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto">
            <code>{`<Accordion type="single">
  <AccordionItem value="item-1">
    <AccordionTrigger>
      Question
    </AccordionTrigger>
    <AccordionContent>
      Answer
    </AccordionContent>
  </AccordionItem>
</Accordion>`}</code>
          </pre>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};
