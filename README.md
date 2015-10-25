# selected.js

A simple, no-dependency `<select>` replacement. Check out [my blog post](http://pointlessramblings.com/posts/selectedjs/) and the [example page](http://fizzadar.com/selected.js/) for more info.

# Synopsis

```html
<!-- in <head>-->
<link rel="stylesheet" type="text/css" href="selected.min.css" />

<form>
    <select>
        <option value="hello">Hello</option>
        <option value="world" selected>World</option>
        <option value="another">Another</option>
    </select>

    <select multiple>
        <option value="hello">Hello</option>
        <option value="world" selected>World</option>
        <option value="another">Another</option>
    </select>
</form>

<!-- just before </body> -->
<script type="text/javascript" src="selected.min.js"></script>
```
