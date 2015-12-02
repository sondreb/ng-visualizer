# ng-visualizer
Utility that you can include in your AngularJS apps to quickly visualize all modules, dependencies and more.


# Usage

There are two main methods you can use the ng-visualizer, either by simply including the library
and relying on the default keyboard shortcut, or access it through the globally defined NgVisualizer
object.

To open the visualizer, press the 'n' key on your keyboard.


```html
<!-- Include after loading Angular -->
<script src="ng-visualizer.js"></script>
```

Another way to include it, is to use bundle frameworks, you can include it like this:

```javascript
// Load using Browserify/CommonJS/AMD
var visualizer = require('ng-visualizer');

// Change the open/close hotkey.
visualizer.options.hotkey = 'g';

// Manually open on click within angular controller.
visualizer.show();
```