# html-snipper
Faithfully replicate and snip user highlighted html
# Usage
`import { getHighlightText } from 'html-snipper';`

**Parameters**

`getHighlightText(range, continueOlNumbering=true)`

`range` is the html range interface.

`continueOlNumbering` if set to false starts all the `ol` elements selected as 1. Otherwise
faithfully replicates the start number of the selected `ol` by inserting a `start={num}` attribute
to the `ol` (defaults to true).

**Typical Usage**

```
const range = window.getSelection().getRangeAt(0);
const parsed = getHighlightText(range);
```

`parsed` is an object containing two keys:
`parsed.html` is a string containing the html of the highlighted selection.
`parsed.nodeTree` is a tree object of the selected html nodes, with two keys: `node`, the node
object itself, and `children`, an array of child nodes.*
