# run character animation

Adds an animation to a [sprite](/types/sprite) that will run whenever the given [rule](./rule) becomes true.
If there are multiple animations with rules that match a sprite's current state, the most specific rule will win.
If the given rule is invalid (e.g. "Moving and NotMoving") then the animation will be ignored.

This function is useful for animating when a sprite moves from one state to another.
For example, if a falling sprite lands on the ground you can run a landing animation before [looping](./loop-character-animation) an idle animation.

```sig
character.runFrames(
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

* **sprite**: a [sprite](/types/sprite) the sprite to run the animation on
* **animation**: the [animation]() to run when the given rule becomes true
* **interval**: the number of milliseconds to spend on each frame of the animation before advancing to the next
* **rule**: a [rule](./rule) that controls when the animation will run on the sprite

## Example #example


```blocks

```

```package
arcade-story=github:riknoll/character-animations
```