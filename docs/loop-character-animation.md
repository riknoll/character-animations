# loop character animation

Adds an animation to a [sprite](/types/sprite) that will loop whenever the given [rule](./rule) is true.
If there are multiple animations with rules that match a sprite's current state, the most specific rule will win.
If the given rule is invalid (e.g. "Moving and NotMoving") then the animation will be ignored.

If another animation is registered using [run frames](./run-character-animation) with a rule that also matches the given state,
the animation will start looping after the other animation has completed.

```sig
character.loopFrames(
sprites.create(img`
    .
    `,
    [img`
    .
    `],
    500,
character.rule(Predicate.NotMoving)
)
```

## Parameters

* **sprite**: a [sprite](/types/sprite) the sprite to loop the animation on
* **animation**: the [animation]() to loop when the given rule becomes true
* **interval**: the number of milliseconds to spend on each frame of the animation before advancing to the next
* **rule**: a [rule](./rule) that controls when the animation will loop on the sprite

## Example #example


```blocks

```

```package
arcade-story=github:riknoll/character-animations
```