### This project just couldn't work out, too many issues with measuring fonts performantly in the browser

# vue-overflow-resize

<p align="center">
    <img src="https://github.com/Cobertos/vue-overflow-resize/blob/master/media/vue-overflow-resize.gif?raw=true">
</p>


A `v-overflow-resize` directive to automatically scale text inside a container with a specified `max-height` (`max-width` coming soon)

## Installation

`npm i vue-overflow-resize`

## Usage

On an element that has a `max-height` css style, `v-overflow-resize` will cause it to resize to the content

```
<template>
    <div>
        <p v-overflow-resize style="max-height:100px; margin:0;"> {{ testText }}</p>
    </div>
</template>
```