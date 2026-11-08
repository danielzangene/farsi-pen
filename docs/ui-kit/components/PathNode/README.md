# PathNode

A 72px round lesson node on the learning path, with a deeper 6px edge.

## When to use
The Lessons page: one node per lesson in a gentle zig-zag (offsets 0, 44, 66, 44, 0, -44, -66, -44 px), 40px apart, title and status under each.

## States
- done: `saffron` fill, check icon, status "Best 92%" in `saffron-ink`.
- current: `firuze` fill, the lesson's emoji, a 92px `firuze-soft` ring and a bobbing `Bubble` ("Start" or "Continue").
- locked: `line` fill, lock icon in `faint`, status "Not started". Still opens on tap.

## The screen provides
The lesson link with a full `aria-label` ("3. Family: not started, you can still open it").

## Do / don't
- Do position the bubble with its own absolutely placed wrapper so it never pushes the node down (the stretched-ring bug, fixed in PR #4).
- Don't put more than one current node on a page.

Source: `src/app/app/lessons/page.tsx`.
