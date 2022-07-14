export function inIFrame() {

   //Check if the window is directly loaded or loaded uisng an IFrame

   try {
      return window.self !== window.top;
   } catch (e) {
      return true;
   }

}
