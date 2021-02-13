export function rmPx(px){ return parseFloat(px.slice(0,-2)); }

/**Given an element, computes in both directions how much it would need to shrink
 * to fit the max sizes. Make sure, before running this, to remove any sort of
 * styling applied to keep the element itself small, so we can calculate an accurate
 * size
 * @param {DOMElement} el The element to look at
 * @returns {object} Object with .heightRatio and .widthRatio describing how much
 * the element needs to shrink in both directions (expressed as a radio, multiply
 * it to the current values). null if there was no max specified
 */
export function getResizeRatio(el) {
  //Get defined style max sizes
  const cs = window.getComputedStyle(el);
  let maxWidth = cs.maxWidth !== 'none' ? rmPx(cs.maxWidth) : null;
  let maxHeight = cs.maxHeight  !== 'none' ? rmPx(cs.maxHeight) : null;

  //Remove styling before getting the bounding client rect
  //and then compute the height ratio
  const oldMaxWidth = el.style.maxWidth;
  const oldMaxHeight = el.style.maxHeight;
  el.style.maxWidth = 'none';
  el.style.maxHeight = 'none';

  // TODO: If width goes off screen, the getBoundingClientRect is wrong and we
  // need a new way to calculate it...
  const { width, height } = el.getBoundingClientRect();

  el.style.maxWidth = oldMaxWidth;
  el.style.maxHeight = oldMaxHeight;

  const ret = { widthRatio: null, heightRatio: null};
  // MaxWidth scaling should only be applied if whiteSpace is nowrap (kind of like
  // text-overflow needs to actually overflow. In our case, the calculated scale
  // will be very wrong if nowrap isn't set and there's multiple lines
  if (maxWidth && el.whiteSpace === 'nowrap') {
    ret.widthRatio = Math.min(maxWidth / width, 1); // Only shrink, never grow
  }
  if (maxHeight) {
    // When we apply a new font-size to the container to shrink the height, it'll
    // also shrink the width, causing more text to fit and the text will be too
    // small.
    // To find the optimal font-size for the height, we need to scan (ew!) between
    // the current font size and the lower bound we have computed
    // TODO: It would be nice if this converged on a solution instead of scanning
    const lowerBound = Math.min(maxHeight / height, 1); // Only shrink, never grow
    const upperBound = 1;
    const oldFontSize = cs.fontSize;
    let testRatio;
    for(testRatio = upperBound; testRatio >= lowerBound; testRatio -= ((upperBound - lowerBound) / 5)) {
      const testFontSize = (rmPx(cs.fontSize) * testRatio).toFixed(2) + 'px';
      el.style.fontSize = testFontSize;
      el.style.maxHeight = 'none';
      const { width, height } = el.getBoundingClientRect();
      console.log(height, maxHeight, testFontSize, testRatio);
      if ( height <= maxHeight) {
        break;
      }
    }
    el.style.fontSize = oldFontSize;
    el.style.maxHeight = oldMaxHeight;
    ret.heightRatio = testRatio;

    // Don't need to take into account line-height or anything here, as it's all
    // proportional to fontSize, which is what we will apply this to later
    //ret.heightRatio = Math.min(maxHeight / height, 1); // Only shrink, never grow
  }
  return ret;
};


/**Resizes the content of el so that it fits into the maxWidth and maxHeight
 * as specified.
 * 1. Get the max height of the container
 * 2. Unapplying all previous resizeFunc styles to container children
 * 3. Get the real height of the children (each elements height summed)
 * 4. Apply the ratio of the summed height to the max height to every child
 * to shrink (but _never grow_)
 * @param {Element} el The element that will have its contents resized
 */
export function resizeFunc(el){
  // Unapply previous scaling
  el.style.fontSize = '';
  
  const { widthRatio, heightRatio } = getResizeRatio(el);

  // Apply the ratios
  const finalRatio = Math.min(widthRatio || +Infinity, heightRatio || +Infinity); // Choose the smallest
  if (finalRatio === +Infinity || finalRatio >= 1) {
    return; // There was no max (both were null, so +Infinity) or no scaling needed (1)
  }

  // Calculate the number of lines vertically based on the line-height
  const cs = window.getComputedStyle(el);
  el.style.fontSize = (rmPx(cs.fontSize) * finalRatio).toFixed(2) + 'px';
};

const resizeMap = new WeakMap();
export default {
  bind(el, binding, vnode){
    let boundResizeHandler = resizeFunc.bind(el, el);
    const data = {
      boundResizeHandler,
      //observer: new MutationObserver(boundResizeHandler)
    };
    resizeMap.set(el, data);

    //Bind handlers
    // window.addEventListener('resize', boundResizeHandler);
    // data.observer.observe(el, { characterData: true, childList: true, subtree: true });
  },
  componentUpdated(el, binding, vnode){
    //Update size after Vue rerenders all the components in their heriarchy
    //including the children
    let { boundResizeHandler } = resizeMap.get(el);
    boundResizeHandler();
  },
  unbind(el, binding, vnode){
    // let { boundResizeHandler, observer } = resizeMap.get(el);
    // window.removeEventListener('resize', boundResizeHandler);
    // observer.disconnect();
  }
}