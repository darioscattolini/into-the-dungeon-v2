# Into the Dungeon

> Dungeon multiplayer game that can be played single- or multi-device.

## General info

You and other adventurers want to kill all the monsters lurking in a dungeon.
But you're not a team: only one player can enter the dungeon, impersonating a
previously chosen hero character.

In every round the players either remove pieces of the hero's equipment or add
monsters in the dungeon, making the quest more difficult every time. At some
point the players will start stepping back in turns, giving up the task to the
last brave or reckless player standing. You succeed in the dungeon if you can
kill all monsters before they take all your character's hit points.

This process will be repeated many times, with different hero characters. You
will be out of the game if you're killed in the dungeon twice. Otherwise you
will win if you survive the dungeon twice or if every other player is out of
the game.

## Built with

This project was generated using [Nx](https://nx.dev).

🔎 **Nx is a set of Extensible Dev Tools for Monorepos.**

Nx chosen presets make use of:

* [Angular](https://angular.io/) for the front-end.
* [Node.js](https://nodejs.org/) and [NestJS](https://nestjs.com/) for the back-end.
* Both Angular and NestJS make use of [TypeScript](https://www.typescriptlang.org/).
* [Jest](https://jestjs.io/) framework for writing and running tests.

Other libraries and dependencies I use:

* [Angular Material](https://material.angular.io/) for theming.
* [Swiper](https://swiperjs.com/) for slider component.
* [jest-extended](https://github.com/jest-community/jest-extended) for additional Jest matchers.
* [ng-mocks](https://ng-mocks.sudo.eu/) for Angular-specific mocking functionality.

## Status

_in progress_

Currently working on the one-device side of the front-end app. A first prototype
is ready, but there are many tasks pending, to be accomplished in the following
order:

1. UX improvements. The current prototype involves a lot of notifications and
dialogs. Parts of the game sequence could be joined together to make the gameplay
smoother. Besides, there is more information on the game state that could be
provided to the user during the gameplay.

2. Refactor Angular components. There is a lot of code duplication that could be
abstracted away as pure UI components. This should be accomplished before working
on UI details and tests.

3. Two essential UI-related tasks pending:

    * Make the design responsive. The app is being developed in a mobile-first
approach and is currently designed for a standard 360x640 mobile viewport size.
    * Define a theme with colors and images so that the app has a more "game-like"
flavour.

4. Write tests for Angular components.

5. Refactor models. With some minor tweaks models could be neater and more
consistent.

## Latest updates

**2021-Sep-16:**

* First prototype of one-device side of the front-end app is ready.

**2021-Jul-28:**

* Start new updated nx boilerplate.

## Play

A prototype of the single-device version of the game [](can be played here).

## Inspiration

This project serves only a learning purpose: to deepen my knowledge of Angular,
become acquainted with unit testing and with back-end development.
The game is closely inspired by a board game I played with my housemates, so I
claim no originality with regard to its rules and content. 

## Contact

Created by [Darío Scattolini](https://darioscattolini.github.io). Feel free to
contact me!
