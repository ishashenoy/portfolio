---
title: less is more: redesigning mytria
date: 2026-09-08
---

*tools: figma, cursor*

Mytria is a media-tracking and social app for logging anime, movies, and shows, building custom ranked lists, and following other users. It works. But soon, every screen started doing too much. So I asked myself:

*How might we simplify Mytria's core flows without cutting a single feature?*

## approach

When I sat down with the existing screens, I kept running into the same feeling: nothing was broken, it was just loud. Modals stacked on top of feeds. Icon rows with no labels. Star ratings crammed onto the corner of a movie poster. A "Select" button next to a filter dropdown next to four more icons, all before you even got to the actual content.

So instead of asking "what should we add," I asked the opposite question:

*what can we take away without losing anything?*

That became the whole thesis.

I chose four screens, which were the most cluttered, to redesign:

### composing a post

![composing a post, before and after](/images/blog/redesign_mytria/post.png)

Say you just want to post a quick update. In the old version, that meant a tiny modal popping up over your feed: a text field, a dropdown for tags, a formatting guide link and four nameless toolbar icons, all crammed into a few square inches. And your feed's sitting there behind it, distracting you from what you're trying to write.

In the redesign, composing gets its own full screen. Nothing else competing for attention: just the text field, front and center. Tagging, polls, media, and lists get tucked behind a single + button that only expands when you need it.

### list pages

![list pages, before and after](/images/blog/redesign_mytria/list.png)

The original list page tried to hand you everything at once: a cover image with overlapping upload/reposition buttons, four unlabeled icons, a filter dropdown, a select button, and then your actual media.

In the redesign, the cover image is now finally visible. Six ambiguous icons become two labeled pills (edit, share) and one settings gear.

### list settings

![list settings, before and after](/images/blog/redesign_mytria/list_settings.png)

Editing a list used to open yet another small modal which was 2 columns on top of that: a tiny cover thumbnail, a privacy toggle, a title field, a description box, all stacked into a card floating over the list you were trying to edit.

The redesign gives settings a full page. The cover image is big enough to preview. "Make private" and "archive list" become full-width buttons: and archiving, the one action you can't easily undo, gets called out in red instead of blending in with everything else.

Not every action deserves the same visual weight. Deleting something should never look as casual as toggling privacy.

### search results

![search results, before and after](/images/blog/redesign_mytria/search.png)

Say you search "zelda." In the old version, every result came stacked with stuff: a star rating row, an eye icon, a bookmark icon, a trash icon, and a "Save" button. Four titles in, and you're looking at more icons than actual games.

In the redesign, each card drops the icon pile-up for one clear action: edit if you've already added it, + add if you haven't.

Tap edit, and that's where the detail lives: a clean panel with which lists it's in, your status ("playing"), a star rating, a rewatch count, a date, and a spot to write your verdict. All the stuff the old version tried to cram onto the card itself now has its place: one tap away instead of always on.

## key learnings

1. Cutting stuff is way harder than adding it. I could add a button in like two minutes. Deciding a button didn't need to be there took me sitting with each screen and asking "does this need to be visible right now or just available."
2. Every time I wanted to shove something into a modal, I made myself ask why it wasn't just its own screen instead. Composing a post, editing a list: none of that should live in a little card floating over whatever you were doing five seconds ago.
3. I kept designing like someone's going to sit and stare at one screen with full attention when they're not. They're half-scrolling, trying to log a movie they finished watching at midnight. Every icon I cut was one less friction between them and finishing that.

## reflections

Two things stuck with me from this one.

1. The original version of Mytria, I didn't even touch Figma. Went straight into code. Which, in hindsight, is exactly why it ended up so cluttered: I was adding things as I needed them instead of stepping back and looking at the whole screen at once. Something I picked up during my co-op term: prototype first, always. Even a rough one forces you to see what you're actually building before you're too deep into it to change your mind.
2. And then, less is more. Not as a rule I followed going in, but as something I only actually believed once I saw the screens side by side. Every icon felt necessary until I tried removing it.
