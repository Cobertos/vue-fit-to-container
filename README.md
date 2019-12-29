<p align="center">
    <a href="https://travis-ci.org/Cobertos/vue-contenteditable-input" target="_blank"><img alt="build status" src="https://travis-ci.org/Cobertos/vue-contenteditable-input.svg?branch=master"></a>
    <a href="https://www.npmjs.com/package/vue-input-contenteditable" target="_blank"><img alt="twitter" src="https://img.shields.io/npm/v/vue-input-contenteditable.svg"></a>
    <a href="https://twitter.com/cobertos" target="_blank"><img alt="twitter" src="https://img.shields.io/badge/twitter-%40cobertos-0084b4.svg"></a>
    <a href="https://cobertos.com" target="_blank"><img alt="twitter" src="https://img.shields.io/badge/website-cobertos.com-888888.svg"></a>
</p>

# vue-autoresize

<p align="center">
    <img src="https://github.com/Cobertos/vue-input-contenteditable/blob/master/media/vue-input-contenteditable.gif?raw=true">
</p>

### This project is not yet in working condition... (the docs are only partially updated too)

Give an element a `max-height` but keep the content from overflowing by shrinking.

## Installation

`npm i vue-autoresize`

## Usage

On an element that has a `max-height` css style, `vue-autoresize` will cause it to resize to the content

```
<template>
    <input-contenteditable
        v-model="myModel"
        :placeholder="myPlaceHolder"
        :maxlength="25" />
</template>

<script>
import InputContenteditable from 'vue-input-contenteditable';

export default {
    components: {
        'input-contenteditable': InputContenteditable
    },
    data: {
        myModel: '',
        myPlaceholder: 'Type your data here...'
    }
};
</script>
```

This uses the [standard `@vue/cli` export recommendations](https://vuejs.org/v2/cookbook/packaging-sfc-for-npm.html). You can import the source `.vue` component directly by importing `vue-input-contenteditable/sfc` or use the component from a script tag with unpkg. 

### Developing
#### Testing

```
npm run serve #Runs tests/dev/main.js
npm run test:unit
npm run test:unit -- --watch
npm run lint
...
```

#### Releasing

```
npm run build
npm publish
```