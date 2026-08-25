# Content interview (step 2)

Most first drafts fail here, not in the design. "Passionate about AI and always learning" is not content, it is the absence of content wearing a sentence.

Your job is to extract real material from them. You are a journalist, not a copywriter. Ask, do not invent, and do not accept.

**Copy they hand you is a first draft, not an input.** The strongest pull in this whole step is to receive a paste of finished-looking copy, say thank you, and move on. That is how a careful interview still produces a generic page. Everything they paste gets read against the tests below before it goes anywhere near a brief.

## First, what kind of page this is

Establish this before anything else, because it decides what the content units are and what the top of the page has to do. A personal site is the worked case in this file and it is not the only case.

**The table below is examples, not a menu.** Do not make them pick a row. Most real sites are two rows at once, a consultancy is a personal site and a commercial one, a studio site is a portfolio that sells, a conference is an event with docs attached. Plenty of sites are no row at all: a wedding, a fan archive, a piece of software's changelog, a memorial, a campaign, a menu that exists only so people can read it outside the door.

| Kind | What the top of the page owes the reader | Content units |
|---|---|---|
| Personal, portfolio, academic | What they do, and for whom or on what | Projects, bio, CV, contact |
| Product or commercial | What the thing does, for whom, in the buyer's words | What it is, who it is for, proof, price, how to buy |
| Local business, clinic, restaurant | Name, what it is, where, when it is open, how to reach it | Location, hours, menu or services, phone, directions |
| Docs or an open-source project | What it is in one line, then the install command | Quickstart, reference, examples |
| Event or launch | What, when, where, and the one action, dated | The date, the thing, the sign-up |
| A single piece of work | The work itself | The work, and almost nothing else |

**When it is not on the table, the question does not change.** What did this reader come for, and what do they need in the first five seconds of having it? Answer that and the row writes itself. The table is there so you stop defaulting to the portfolio shape, not so you have six shapes to default to instead.

The failure it prevents is a real one: a poetic sentence at the top of a restaurant page costs a customer who opened it on a phone to find out whether the place is open. Match the opening to what the reader came for, not to what looks like a website.

## Question sequence

One at a time. Follow up on thin answers rather than moving on.

1. Who is the reader you actually care about? Name a specific person or role, not "everyone".
2. What do you want them to do after ninety seconds on the page?
3. What is the evidence? For a person, things they built, shipped, or published, not coursework they attended. For a product, what it does with the specifics attached. For a business, what a customer gets and what it costs.
4. For each one: what was hard about it, and what happened as a result? Push for a number.
5. What do you want to be asked about? What question would you rather the reader arrive with than none at all?
6. What should not be on this page? (Old projects, a photo, a phone number, a degree they are done defending, a feature that is not built yet.)

If they cannot answer question 4 for an item, the item is a line, not a section. Cutting is a legitimate answer. An empty section filled with generated text costs more credibility than a shorter page.

## The first thing the reader reads

Not every page opens with a sentence. Some open with a name and an address, a price, a photograph, a menu, or the work itself. Whichever it is, one test applies to it:

**It should be false if applied to a competitor.** If a rival in the same field could put the identical line on their own page without changing a word, it says nothing.

Weak: "AI engineer passionate about building intelligent solutions."
Strong: "I build on-device speech systems that never send audio anywhere."

Weak: "The modern platform for growing teams."
Strong: "Payroll for companies with people in more than one country."

Weak: "Authentic flavours in a warm atmosphere."
Strong: "Damascene home cooking. Open Tuesday to Sunday, 5 to 11."

No adjective survives unless evidence follows it within two lines.

**The real line is usually already in their draft, one row lower.** People lead with the abstraction and then say the true thing in the next sentence, as though it were support. It is not support, it is the headline.

> Draft: "Build faster without giving up control. A small AI tool that gets repetitive work done in a few minutes instead of fifteen or twenty."

The first sentence is true of every developer tool ever shipped. The second has a number in it and would be false on a competitor's page. Swap them and the page is fixed, without a single word being invented. Look for this before you propose anything new, because it is the most common fix and the only one that costs nothing. If the page opens with an image instead, the test moves to the image: photograph the actual room, the actual product, the actual work, never a stock approximation of it.

## Content units

Whatever the units are called on this site, they take the same shape. Forty to sixty words each:

- What it is, in one plain sentence.
- The decision or constraint that made it hard, or the thing about it a competitor cannot say.
- The result, with a number where one exists.
- A link to the thing itself, or the way to get it.

If the item is under NDA or unshippable, say what class of problem it was and what changed, without the specifics. Vagueness with a reason reads better than vagueness alone.

## Assign every sentence to a place

Locking the copy is not the end of this step. Copy with no home is copy the coding agent puts wherever there is room, and there is always room in the hero.

Go through it line by line and write the assignment down:

| Slot | Holds | Limit |
|---|---|---|
| Opening | The tested line | One sentence |
| Support | What it is, for whom | One sentence |
| Action | The one thing they should do | One control |
| Below | Evidence, numbers, how it works, the proof | As much as is real |
| Cut | Anything that survives neither | Say so out loud |

**A hero is three things.** A fourth is a paragraph pretending to be a hero, and it reads as stacked however it is set. The failure is not that the copy is bad, it is that four good sentences were given one slot.

The other half of this is the size rule in `design-direction.md`: a specific opening line is usually long, and a long line set at display size is a wall. Assign it, then size it against its actual length.

## The about section

Two or three sentences on a personal site. Pick first person or third person and hold it across the whole site. Cut every clause that a hundred other people in their field could also write. Where they came from matters only if it explains where they are going.

On a commercial site the same section is usually the one nobody reads and everybody ships. Give it a job or cut it: who is behind this, why they are the ones doing it, and what a customer gets from knowing that.

## Never justify the page to the reader

The strongest tell of machine-written copy, after the accented word, is prose that defends its own decisions. It explains why a list is ordered the way it is, why a default was picked, what a section is not claiming, what the author does not mean. The reader did not ask, did not notice, and now suspects there was something to hide.

> Claude Code is listed first only because it is the one that takes a single command, not because the playbook is built for it.

Nobody wondered. The sentence invents an objection, argues with it, and leaves the reader thinking about install-order politics instead of installing.

Cut every clause of this shape: "only because", "not because", "this is not to say", "it is worth noting that", "that said", "to be clear", "the reason for this is". Cut the pre-emptive apology and the parenthetical that softens the sentence before it.

**If an ordering needs defending, the ordering is wrong.** Change the order rather than annotating it.

**The delete test.** Remove the sentence and read the paragraph again. If nothing is lost, it was justification. This is true of roughly every sentence that explains a choice the reader can already see.

### The same reflex in policy writing

It reappears wherever a rule is being stated: a licence, a contributing guide, a pricing page, a refusal. The shape is an opening paragraph that argues for the rule before the rule has been given, answering an objection nobody has raised yet.

> Foreman is an authored playbook, not a community standard. It has a point of view, and that point of view is the product. A version that accommodated every preference would be a worse tool.

None of that is the rule. The rule is "contributions are open here and closed there." State it, then say what is open and what is closed. The argument for a rule is what you use when someone challenges it, not what you lead with.

**Test for a policy:** delete every sentence before the first concrete statement. If the reader still knows what to do, the deleted part was throat-clearing.

Confidence reads as authority. Explanation reads as doubt.

### The same reflex in your own messages

It is the same habit, one layer up, and it is the one the owner actually watches you do. Preambles about what you are about to ask. Recaps of what was just decided. A defence of a constraint nobody challenged. An apology for asking a fifth question. Every one of them invites a renegotiation of a gate that was already met, and together they are why sessions feel long.

Ask the question. Take the answer. Move.

## Rules you enforce

- No claim without evidence on the page or one click away.
- Numbers beat adjectives. "Cut inference time 4x" beats "highly optimized".
- Plain verbs, sentence case, no filler.
- No em dashes and no en dashes, in their copy or in yours. A comma, a full stop, or two sentences. Ranges get the word "to". See rule 5 in `SKILL.md`.
- Their words, lightly edited. If a paragraph sounds like you wrote it, rewrite it in their register or hand it back.
- The same rule covers images. If the page is carried by media and they have none, they supply it or the page is carried by something else. Generating a backdrop to fill the slot is the average arriving by a longer route, and it will look like it.
- If they hand you a CV, mine it with questions instead of transcribing it. A CV bullet is a claim; ask what happened because of it.
