# matches rule

Checks the state of a sprite and returns true if it currently fulfills the given rule.

A sprite will not match any "Facing" rule unless it has at least one animation that uses that rule.

```sig
character.matchesRule(sprites.create(img`
    .
    `, character.rule(Predicate.NotMoving))
```

## Parameters

* **sprite**: a [sprite](/types/sprite) to check the state of
* **rule**: a [rule](./rule) to validate against the state of the sprite

## Example #example


```blocks

```

```package
arcade-story=github:riknoll/character-animations
```