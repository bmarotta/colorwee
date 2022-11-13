# colorwee

A wee package for handling the most used color manipulation functions (RGB, HSL and HEX). Not bloated with functions and formats you don't need or that are too trivial to implement. On top it is written in typescript and has full test coverage.

## Installation

```
npm install colorwee
```

## Usage

```typescript
import { Color } from "colorwee";

// Instantiate
const c1 = new Color("#ffffff");
const c2 = new Color("#fff");
const c3 = new Color(255, 255, 255);
const c3 = new Color("rgba(255,255,255,0.5)");
// etc.

// Modify
c1.red = 128;

// Convert
console.log(c1.toHslString());
const hsl = c2.toHsl();
const hsla = c3.toHsla();
// etc.

// If you don't want to use the object you can use the static converters
const anotherHSl = Color.Convertor.rgbToHsl({ r: 15, g: 15, b: 240 });

// Bonus function: Calculate the color similarity
// 0 is equal
// 1 is black and white
const similiarity = Color.colorDistance({ r: 255, g: 255, b: 255 }, { r: 250, g: 255, b: 255 }, true);
```

Full documentation here: https://bmarotta.github.io/colorwee/classes/Color.html

## Motivation

When developing my last website https://www.ohmydots.com , I was very paranoid about size and performance.
Most of the color conversion libraries are all purpose and have a bunch of functions you will never use.
I then tried to most referred gist: https://gist.github.com/neolitec/1344610/3a3a9dc7d94644ff48f12cc7823b79f2b8ea17ac
Unfortunately it has (again) a lot of functions, some bugs and it keeps converting everything all the time.
Colorwee has a minimal set of functions, stores the data in RGB (from 0 to 255) and converts only when needed.
