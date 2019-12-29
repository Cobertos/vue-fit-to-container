
/**Resizes the content of el so that it fits into the maxHeight specified
 * in it's stylesheet. It does this by:
 * 1. Get the max height of the container
 * 2. Unapplying all previous autoresize styles to container children
 * 3. Get the real height of the children (each elements height summed)
 * 4. Apply the ratio of the summed height to the max height to every child
 * to shrink (but _never grow_)
 * @param {Element} el The element that will have its contents resized
 * @todo This function probably causes a bunch of repaints and
 * we should see if we can get that down...
 * @todo Only remove the inline styles we ourselves apply...
 * @todo Make the css property that is scaled configurable
 */
const resizeFunc = (el)=>{
  function rmPx(px){ return parseFloat(px.slice(0,-2)); }

  //Get the max height of the element
  let elMaxHeight = rmPx(window.getComputedStyle(el).maxHeight);

  //Remove styling before getting the bounding client rect
  //and then compute the height ratio
  Array.from(el.children).forEach((child)=>{
    child.removeAttribute("style"); //Remove any scaling we've done previously
  });
  let totalHeight = el.getBoundingClientRect().height;
  let heightRatio = Math.min(containerMaxHeight / totalHeight, 1); //Only shrink, never grow

  //Now apply the scale factor to each child (using font size
  //but in the future this should be configurable)
  Array.from(el.children).forEach((child)=>{
    let childFontSize = rmPx(window.getComputedStyle(child).fontSize);
    child.style.fontSize = textFontSize * heightRatio + "px";
  });
};

const resizeMap = new WeakMap();
export default {
  bind(el, binding, vnode){
    let boundResizeHandler = resizeFunc.bind(el);
    const data = {
      boundResizeHandler,
      observer: new MutationObserver(boundResizeHandler)
    };

    //Bind handlers
    window.addEventListener('resize', boundResizeHandler);
    data.observer.observe(el, { characterData: true, childList: true, subtree: true });
  },
  updateComponent(el, binding, vnode){
    //Update size after Vue rerenders all the components in their heriarchy
    //including the children
    let { boundResizeHandler } = resizeMap.get(el);
    boundResizeHandler();
  },
  unbind(el, binding, vnode){
    let { boundResizeHandler, observer } = resizeMap.get(el);
    window.removeEventListener('resize', boundResizeHandler);
    observer.disconnect();
  }
}