# set character animations enabled

Enables or disables all animations with rules on a given [sprite](/types/sprite).
This function is useful if you want to temporarily run a normal animation on a sprite without it being overridden by another animation.

```sig
character.setCharacterAnimationsEnabled(sprites.create(img`
    .
    `, true)
```

## Parameters

* **sprite**: a [sprite](/types/sprite) to set character animations enabled on
* **enabled**: a [boolean](/types/boolean) indicating whether the character animations are enabled or not

## Example #example


```blocks

```

```package
arcade-story=github:riknoll/character-animations
```