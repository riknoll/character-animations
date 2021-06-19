# set character state

Manually sets the state of a [sprite](/types/sprite) to match the given rule.
This state will stay until this function is called again or it is [cleared](./clear-character-state).
Once state is cleared, it will go back to automatically updating.
If the state is invalid (e.g. "Moving and NotMoving") then it will be ignored.

This function is useful for games that make sprites look like they are moving without actually setting their velocity.
For example, in cutscenes or games where projectiles come towards the player.
If your game uses velocity or the "move sprite with controller" block, you should probably avoid using this function.

```sig
character.setCharacterState(sprites.create(img`
    .
    `, character.rule(Predicate.NotMoving))
```

## Parameters

* **sprite**: a [sprite](/types/sprite) to set the state of
* **rule**: a [rule](./rule) that will be the sprite's new state

## Example #example


```blocks

```

```package
arcade-story=github:riknoll/character-animations
```