---
title: How to publish a post here
description: A draft that shows the post format. It only appears while running the dev server.
date: 2026-11-16
draft: true
---

Every Markdown file in `src/content/writing/` becomes a page at `/writing/<file-name>/`.

A post needs four fields at the top: `title`, `description`, `date`, and optionally `draft`.
While `draft` is `true` the post shows up under `npm run dev` but is left out of the
published site and the RSS feed. Delete the line, or set it to `false`, to publish.

## What you can write

Standard Markdown works: headings, lists, links, images, quotes and code.

```python
def greet(name: str) -> str:
    return f"Hello, {name}"
```

> Quotes look like this.

Delete this file once the first real post is in.
