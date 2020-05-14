```code
* run in host project directory with `x run _bundle.ss` *

{{ [ 'content:/src/css/' ] |> bundleCss({ minify:true, disk:true, out:`content:${to}/bundle.css` }) }}

{{ [
    'content:/src/components/',
    'content:/src/shared/',
    'content:/src/',
] |> bundleJs({ minify:true, disk:true, out:`content:${to}/bundle.js`, iife:true }) }}
```
