
/**
 * These are redundant on purpose. We need to preserve the
 * number of predicates in a rule, so every predicate needs
 * to be unique
 */

enum Predicate {
    //% block="not moving"
    NotMoving = 1,
    //% block="moving"
    Moving = 1 << 1,
    //% block="facing up"
    FacingUp = 1 << 2,
    //% block="facing right"
    FacingRight = 1 << 3,
    //% block="facing down"
    FacingDown = 1 << 4,
    //% block="facing left"
    FacingLeft = 1 << 5,
    //% block="moving up"
    MovingUp = 1 << 6,
    //% block="moving right"
    MovingRight = 1 << 7,
    //% block="moving down"
    MovingDown = 1 << 8,
    //% block="moving left"
    MovingLeft = 1 << 9,
    //% block="hitting wall up"
    HittingWallUp = 1 << 10,
    //% block="hitting wall right"
    HittingWallRight = 1 << 11,
    //% block="hitting wall down"
    HittingWallDown = 1 << 12,
    //% block="hitting wall left"
    HittingWallLeft = 1 << 13,
}

//% color="#7d6282"
namespace character {
    export type Rule = number;

    const FACING = Predicate.FacingUp | Predicate.FacingRight | Predicate.FacingDown | Predicate.FacingLeft;
    const MOVING = Predicate.MovingUp | Predicate.MovingRight | Predicate.MovingDown | Predicate.MovingLeft | Predicate.Moving;

    let sceneStack: CharacterAnimationSceneState[];

    class CharacterAnimationSceneState {
        public characters: CharacterState[];

        constructor() {
            this.characters = [];
        }

        update() {
            const dt = game.currentScene().eventContext.deltaTimeMillis;

            let cleanup = false;
            for (const character of this.characters) {
                if (character.sprite.flags & sprites.Flag.Destroyed) cleanup = true;
                character.update(dt);
            }

            if (cleanup) {
                this.characters = this.characters.filter(character => !(character.sprite.flags & sprites.Flag.Destroyed))
            }
        }
    }

    class CharacterAnimation {
        constructor(public frames: Image[], public interval: number, public rule: Rule) {
        }
    }

     class CharacterState {
        protected animations: CharacterAnimation[];
        protected lastState: number;
        protected current: CharacterAnimation;
        protected possibleFacingDirections: number;
        protected enabled: boolean;

        protected timer: number;
        protected frame: number;

        constructor(public sprite: Sprite) {
            this.animations = [];
            this.timer = 0;
            this.frame = 0;
            this.lastState = Predicate.FacingRight;
            this.possibleFacingDirections = 0;
            this.enabled = true;
        }

        setFrames(frames: Image[], interval: number, rule: Rule) {
            this.possibleFacingDirections |= (rule & FACING);
            for (const animation of this.animations) {
                if (animation.rule === rule) {
                    animation.frames = frames;
                    animation.interval = interval;
                    return;
                }
            }
            this.animations.push(new CharacterAnimation(frames, interval, rule));
        }

        update(dt: number) {
            let state = 0;

            if (this.sprite.vx | this.sprite.vy) {
                state |= Predicate.Moving;

                if (this.sprite.vx > 0) {
                    state |= (Predicate.FacingRight & this.possibleFacingDirections) | Predicate.MovingRight;
                }
                else if (this.sprite.vx < 0) {
                    state |= (Predicate.FacingLeft & this.possibleFacingDirections) | Predicate.MovingLeft
                }

                if (this.sprite.vy > 0) {
                    state |= (Predicate.FacingDown & this.possibleFacingDirections) | Predicate.MovingDown;
                }
                else if (this.sprite.vy < 0) {
                    state |= (Predicate.FacingUp & this.possibleFacingDirections) | Predicate.MovingUp
                }

                if (!(state & FACING)) {
                    state |= (this.lastState & FACING)
                }
            }
            else {
                state |= Predicate.NotMoving;
                state |= (this.lastState & FACING);
            }

            if (this.sprite.isHittingTile(CollisionDirection.Bottom)) {
                state |= Predicate.HittingWallDown;
            }
            if (this.sprite.isHittingTile(CollisionDirection.Top)) {
                state |= Predicate.HittingWallUp;
            }
            if (this.sprite.isHittingTile(CollisionDirection.Right)) {
                state |= Predicate.HittingWallRight;
            }
            if (this.sprite.isHittingTile(CollisionDirection.Left)) {
                state |= Predicate.HittingWallLeft;
            }

            const newAnimation = this.pickRule(state);
            if (newAnimation !== this.current) {
                this.frame = 0;
                this.timer = 0;

                this.current = newAnimation;

                if (this.current && this.enabled) {
                    this.sprite.setImage((this.current.frames[0]))
                }
            }

            if (!this.current || !this.enabled) return;

            this.timer += dt;

            while (this.timer >= this.current.interval) {
                this.timer -= this.current.interval;
                this.frame = (this.frame + 1) % this.current.frames.length;

                this.sprite.setImage(this.current.frames[this.frame])
            }
        }

        matchesRule(rule: Rule) {
            return !!(this.lastState & rule);
        }

        setEnabled(enabled: boolean) {
            this.enabled = enabled;
        }

        protected pickRule(state: number) {
            this.lastState = state;

            // If we have multiple animations with the same best score, we
            // want to prioritize the current animation and then the rest
            // by the order they were added
            let best = this.current;
            let bestScore = this.current && score(state, best.rule);
            let currentScore: number;

            for (const animation of this.animations) {
                currentScore = score(state, animation.rule);
                if (currentScore > bestScore) {
                    bestScore = currentScore;
                    best = animation;
                }
            }

            if (bestScore === 0 || bestScore == undefined) return null;
            
            return best;
        }
    }

     function init() {
         if (sceneStack) {
             if (!sceneStack.length) {
                 initScene();
             }
             return;
         }
         sceneStack = [];

         game.addScenePushHandler(initScene);

         game.addScenePopHandler(function (oldScene: scene.Scene) {
             sceneStack.pop();
         });

         initScene();
     }

     function initScene() {
         sceneStack.push(new CharacterAnimationSceneState());
         const sceneState = sceneStack[sceneStack.length - 1];
         game.onUpdate(function () {
             if (sceneState) {
                 sceneState.update();
             }
         })
     }

    function score(state: number, rule: Rule) {
        let res = 0;
        let check = state;

        if ((state & rule) ^ rule) return 0;

        while (check) {
            if (check & 1) ++res;
            check >>= 1;
        }

        return res;
    }

    function getStateForSprite(sprite: Sprite, createIfNotFound: boolean) {
        init();

        if (!sprite) return undefined;

        const sceneState = sceneStack[sceneStack.length - 1];
        for (const state of sceneState.characters) {
            if (state.sprite === sprite) {
                return state;
            }
        }

        if (createIfNotFound) {
            const newState = new CharacterState(sprite);
            sceneState.characters.push(newState);
            return newState;
        }
        return undefined;
    }

    //% blockId=character_loop_frames
    //% block="$sprite loop frames $frames $frameInterval when $rule"
    //% sprite.defl=mySprite
    //% sprite.shadow=variables_get
    //% frames.shadow=character_animation_editor
    //% frameInterval.shadow=timePicker
    //% rule.shadow=character_make_rule
    export function loopFrames(sprite: Sprite, frames: Image[], frameInterval: number, rule: Rule) {
        init();
        if (!sprite || !frames || !frames.length || !rule) return;
        if (Number.isNaN(frameInterval) || frameInterval < 5) frameInterval = 5;

        const state = getStateForSprite(sprite, true);
        state.setFrames(frames, frameInterval, rule);
    }

    //% blockId=character_make_rule
    //% block="$p1||and $p2 and $p3 and $p4 and $p5"
    //% inlineInputMode=inline
    //% p1.shadow=character_predicate
    //% p2.shadow=character_predicate
    //% p3.shadow=character_predicate
    //% p4.shadow=character_predicate
    //% p5.shadow=character_predicate
    export function rule(p1: number, p2?: number, p3?: number, p4?: number, p5?: number): Rule {
        let rule = p1;
        if (p2) rule |= p2;
        if (p3) rule |= p3;
        if (p4) rule |= p4;

        // Check for invalid rules
        if (
            // Moving and not moving
            (rule & Predicate.NotMoving) && (rule & MOVING) ||
            // moving/facing left and right
            (rule & (Predicate.MovingLeft | Predicate.FacingLeft)) && (rule & (Predicate.MovingRight | Predicate.FacingRight)) ||
            // moving/facing up and down
            (rule & (Predicate.MovingUp | Predicate.FacingUp)) && (rule & (Predicate.MovingDown | Predicate.FacingDown)) ||

            // moving down and on ground
            (rule & Predicate.MovingDown) && (rule & Predicate.HittingWallDown) ||
            // moving up and on ceiling
            (rule & Predicate.MovingUp) && (rule & Predicate.HittingWallUp) ||
            // moving right and on right wall
            (rule & Predicate.MovingRight) && (rule & Predicate.HittingWallRight) ||
            // moving left and on left wall
            (rule & Predicate.MovingLeft) && (rule & Predicate.HittingWallLeft)
        ) {
            return 0;
        }

        return rule;
    }

    //% blockId=character_is_facing
    //% block="$sprite is $rule"
    //% sprite.defl=mySprite
    //% sprite.shadow=variables_get
    //% rule.shadow=character_make_rule
    export function matchesRule(sprite: Sprite, rule: Rule): boolean {
        const state = getStateForSprite(sprite, false);
        if (!state) return false;

        return state.matchesRule(rule);
    }

    //% blockId=character_animation_enabled
    //% block="$sprite enable character animations $enabled"
    //% sprite.defl=mySprite
    //% sprite.shadow=variables_get
    export function setCharacterAnimationsEnabled(sprite: Sprite, enabled: boolean) {
        const state = getStateForSprite(sprite, false);
        if (!state) return;

        state.setEnabled(enabled);
    }

    //% blockId=character_animation_editor block="$frames"
    //% shim=TD_ID
    //% frames.fieldEditor="animation"
    //% frames.fieldOptions.decompileLiterals="true"
    //% frames.fieldOptions.filter="!tile !dialog !background"
    //% duplicateShadowOnDrag
    export function _animationFrames(frames: Image[]) {
        return frames
    }

    //% blockId=character_predicate block="$predicate"
    //% shim=TD_ID
    export function _predicate(predicate: Predicate): number {
        return predicate
    }
}