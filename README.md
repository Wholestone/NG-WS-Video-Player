# ng-ws-ui

![Angular 17](https://img.shields.io/badge/Angular%2017-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)

A collection of reusable Angular UI components and libraries.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Development](#development)
  - [Creating a New Library](#creating-a-new-library)
  - [Building Libraries](#building-libraries)
  - [Publishing Libraries](#publishing-libraries)

## Installation

To install the entire `ng-ws-ui` package:

```bash
npm install ng-ws-ui
```

Or, to install individual libraries:
```bash
npm install ng-ws-video-player
```

## Usage

Import the desired component in your standalone component or app.component.ts:

```typescript
import { Component } from '@angular/core';
import { NgWsVideoPlayerComponent } from 'ng-ws-video-player';

@Component({
selector: 'app-root',
standalone: true,
imports: [NgWsVideoPlayerComponent],
template: `<ng-ws-video-player/>`
})
export class AppComponent {}
```

## Development

### Creating a New Library
1. Navigate to the project root:
```bash
cd ng-ws-ui
```

2. Generate a new library:
```bash
ng generate library <new-component-library-name>
```
### Building Libraries
To build a specific library:
```bash
ng build my-new-library
```

### Publishing Libraries
To publish individual libraries:

1. Navigate to the library directory:
```bash
cd projects/<new-component-library-name>
```

2. Publish to npm:
```bash
npm publish
```

### To publish the entire ng-ws-ui package:

1. Create a new library called `full-lib` that includes all component libraries as `PeerDependencies`.
2. Build the `full-lib`.
3. Navigate to `dist/full-lib`.
4. Publish it to npm.
