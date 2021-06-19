# create rule

Creates a rule that can be used to check the state of the sprite or control when animations on a sprite run.

Rules are made of [predicates](./predicate), which are statements that describe how a sprite is currently acting.
Every predicate in a rule must be true for that rule to match a sprite.
Rules that are impossible, like "Moving and NotMoving", are always ignored.


```sig
character.rule(Predicate.NotMoving)
```

## Parameters

* **predicate**: a [predicate](./predicate) that describes the state of the sprite

## Rule Priority

In animations, rules that have more unique predicates always take priority over those with fewer predicates.
For example, let's say a sprite has animations for both of these rules:

1. "Moving"
2. "Moving and FacingRight"

When the sprite moves to the right both of these rules are true.
However, animation 2 will play because its rule contains more predicates.

## Using "Facing" predicates

The predicates "FacingUp", "FacingRight", "FacingDown", and "FacingLeft" will only apply to a sprite if they are used in a rule that controls an animation on that sprite.
This behavior is mostly to support sidescrollers, which usually limit the number of directions that a sprite can face.

For example, in a platformer a sprite might move up and down (e.g. jumping and falling) but they usually only face left or right.
If the sprite is falling straight down with no change in x, the sprite will continue to face in whatever direction it was last facing instead of facing down.

If you want to match one of the "Facing" predicates, be sure to use it somewhere in the animations of that sprite.

## Example #example


```blocks

```

```package
arcade-story=github:riknoll/character-animations
```