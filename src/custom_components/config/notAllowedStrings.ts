/* eslint-disable no-script-url */

// The disallowed characters indicate that an attempt is being made to import malicious code or something similar.
// Not safe, but better than nothing...
export const NotAllowedStrings = [
  "<<",
  ">>",
  "==",
  "!=",
  "javascript:", // eslint-disable-line no-script-url
  "data:", // eslint-disable-line no-script-url
  "vbscript:", // eslint-disable-line no-script-url
  "onload",
  "onerror",
  "onclick",
  "onmouseover",
  "onfocus",
  "onblur",
  "onchange",
  "onsubmit",
  "onreset",
  "onselect",
  "onunload",
  "onkeydown",
  "onkeypress",
  "onkeyup",
  "onmousedown",
  "onmouseup",
  "onmousemove",
  "onmouseout",
  "onmouseenter",
  "onmouseleave",
  "eval",
  "alert",
  "document",
  "window",
  "cookie",
  "setTimeout",
  "setInterval",
  "exec",
  "system",
  "import",
  "include",
  "require",
  "style=",
  "expression",
  "background-image",
  "src=",
  "href=",
  "<style>",
  "</style>",
  "<html>",
  "</html>",
  "<script>",
  "</script>",
];

/* eslint-enable no-script-url */