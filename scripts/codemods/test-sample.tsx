/**
 * Test file for text-extract codemod
 * This file contains various text patterns to test the transformation
 */

import React from "react";
import { Button } from "@/catalyst-ui/ui/button";
import { Card } from "@/catalyst-ui/ui/card";

import { EditableText } from "@/catalyst-ui/components/EditableText";

export function TestComponent() {
  return (
    <div className="container">
      <h1>
        <EditableText id="welcome_to_catalyst_ui" namespace="test-sample">
          Welcome to Catalyst UI
        </EditableText>
      </h1>
      <p>
        <EditableText
          id="this_is_a_longer_paragraph_with_multiple_sentences"
          namespace="test-sample"
        >
          This is a longer paragraph with multiple sentences. It should be wrapped in EditableText
          automatically.
        </EditableText>
      </p>
      <Button>
        <EditableText id="click_me" namespace="test-sample">
          Click Me
        </EditableText>
      </Button>
      <Card>
        <div>
          <EditableText id="simple_card_content" namespace="test-sample">
            Simple Card Content
          </EditableText>
        </div>
      </Card>
      {/* Short text that might be skipped */}
      <span>OK</span>
      <span>No</span>
      {/* Numbers should be skipped */}
      <div>123</div>
      <div>42</div>
      {/* Mixed content */}
      <div>
        <strong>
          <EditableText id="bold_text_here" namespace="test-sample">
            Bold Text Here
          </EditableText>
        </strong>
        <span>
          <EditableText id="and_some_regular_text" namespace="test-sample">
            And some regular text
          </EditableText>
        </span>
      </div>
      {/* Already has JSX expressions - text should still be wrapped */}
      <p>
        <EditableText id="hello" namespace="test-sample">
          Hello
        </EditableText>
        {name}
        <EditableText id="welcome_back" namespace="test-sample">
          , welcome back!
        </EditableText>
      </p>
      {/* Special characters */}
      <div>
        <EditableText id="settings_preferences" namespace="test-sample">
          Settings & Preferences
        </EditableText>
      </div>
      <div>
        <EditableText id="save_cancel" namespace="test-sample">
          Save / Cancel
        </EditableText>
      </div>
    </div>
  );
}

// Another component to test
export function AnotherTest() {
  return (
    <section>
      <h2>
        <EditableText id="section_title" namespace="test-sample">
          Section Title
        </EditableText>
      </h2>
      <p>
        <EditableText
          id="section_description_goes_here_with_meaningful_cont"
          namespace="test-sample"
        >
          Section description goes here with meaningful content.
        </EditableText>
      </p>
      <button type="button">
        <EditableText id="submit_form" namespace="test-sample">
          Submit Form
        </EditableText>
      </button>
    </section>
  );
}
