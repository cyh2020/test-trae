/** @jsx h */
import h from "../../../shared/hyperscript";
import SlateTest, { createEvent } from "@convertkit/slate-testing-library";

import Code from "..";

describe("insertCode", () => {
  it("should insert a code block", () => {
    const { editor, createValue } = SlateTest({ plugins: Code() });

    editor.setValue(
      createValue(
        <paragraph>
          <cursor />
        </paragraph>
      )
    );

    const expected = createValue([
      <paragraph />,
      <code>
        <code_line>{"<h1>Heading</h1>"}</code_line>
      </code>
    ]);

    editor.insertCode({ code: "<h1>Heading</h1>" });

    expect(editor.value.toJSON()).toEqual(expected.toJSON());
  });
});

describe("mod+a", () => {
  it("should select the code Block", () => {
    const { editor, createValue } = SlateTest({ plugins: Code() });

    editor.setValue(
      createValue(
        <code>
          <code_line>{"<h1>"}</code_line>
          <code_line>{"  Heading"}</code_line>
          <code_line>{"</h1>"}</code_line>
          <cursor />
        </code>
      )
    );

    const expected = createValue(
      <code>
        <code_line>
          <anchor />
          {"<h1>"}
        </code_line>
        <code_line>{"  Heading"}</code_line>
        <code_line>
          {"</h1>"}
          <focus />
        </code_line>
      </code>
    );

    editor.run("onKeyDown", createEvent.keyDown({ key: "a", ctrlKey: true }));

    expect(editor.value.toJSON({ preserveSelection: true })).toEqual(
      expected.toJSON({ preserveSelection: true })
    );
  });

  describe("enter", () => {
    it("should base the indent off the previous indent", () => {
      const { editor, createValue } = SlateTest({ plugins: Code() });

      editor.setValue(
        createValue(
          <code>
            <code_line>{"<div>"}</code_line>
            <code_line>
              {"  <div>"}
              <cursor />
            </code_line>
          </code>
        )
      );

      const expected = createValue(
        <code>
          <code_line>{"<div>"}</code_line>
          <code_line>
            {"  <div>"}
            <cursor />
          </code_line>
          <code_line>
            {"  "}
            <cursor />
          </code_line>
        </code>
      );

      editor.run("onKeyDown", createEvent.keyDown({ key: "Enter" }));

      expect(editor.value.toJSON({ preserveSelection: true })).toEqual(
        expected.toJSON({ preserveSelection: true })
      );
    });
  });
});
