var styleDefs = [{ 
  name: "Backgrounds", 
  icon: "backgrounds", 
  styles: [
    "background", "background-attachment", "background-clip", "background-color", "background-image", "background-origin", "background-position", "background-repeat", "background-size", "-moz-background-clip", "-moz-background-inline-policy", "-moz-background-origin", "-moz-background-size", "-ms-background-position-x", "-ms-background-position-y", "-webkit-background-clip", "-webkit-background-composite", "-webkit-background-origin", "-webkit-background-size"
  ]
}, 
{ 
  name: "Borders", 
  icon: "border", 
  styles: [
    "border", "border-bottom", "border-bottom-color", "border-bottom-left-radius", "border-bottom-right-radius", "border-bottom-style", "border-bottom-width", "border-color", "border-image", "border-left", "border-left-color", "border-left-style", "border-left-width", "border-radius", "border-right", "border-right-color", "border-right-style", "border-right-width", "border-style", "border-top", "border-top-color", "border-top-left-radius", "border-top-right-radius", "border-top-style", "border-top-width", "border-width", "outline", "outline-color", "outline-offset", "outline-style", "outline-width", "-moz-border-bottom-colors", "-moz-border-end", "-moz-border-end-color", "-moz-border-end-style", "-moz-border-end-width", "-moz-border-image", "-moz-border-left-colors", "-moz-border-right-colors", "-moz-border-start", "-moz-border-start-color", "-moz-border-start-style", "-moz-border-start-width", "-moz-border-top-colors", "-moz-outline", "-moz-outline-color", "-moz-outline-offset", "-moz-outline-radius", "-moz-outline-radius-bottomleft", "-moz-outline-radius-bottomright", "-moz-outline-radius-topleft", "-moz-outline-radius-topright", "-moz-outline-style", "-moz-outline-width", "-webkit-border-after", "-webkit-border-after-color", "-webkit-border-after-style", "-webkit-border-after-width", "-webkit-border-before", "-webkit-border-before-color", "-webkit-border-before-style", "-webkit-border-before-width", "-webkit-border-bottom-left-radius", "-webkit-border-bottom-right-radius", "-webkit-border-end", "-webkit-border-end-color", "-webkit-border-end-style", "-webkit-border-end-width", "-webkit-border-fit", "-webkit-border-horizontal-spacing", "-webkit-border-image", "-webkit-border-radius", "-webkit-border-start", "-webkit-border-start-color", "-webkit-border-start-style", "-webkit-border-start-width", "-webkit-border-top-left-radius", "-webkit-border-top-right-radius", "-webkit-border-vertical-spacing"
  ] 
}, 
{ 
  name: "Box", 
  icon: "box", 
  styles: [
    "box-shadow", "height", "max-height", "max-width", "min-height", "min-width", "opacity", "resize", "width", "-moz-box-align", "-moz-box-direction", "-moz-box-flex", "-moz-box-flexgroup", "-moz-box-ordinal-group", "-moz-box-orient", "-moz-box-pack", "-moz-box-sizing", "-moz-opacity", "-webkit-box-align", "-webkit-box-direction", "-webkit-box-flex", "-webkit-box-flex-group", "-webkit-box-lines", "-webkit-box-ordinal-group", "-webkit-box-orient", "-webkit-box-pack", "-webkit-box-reflect", "-webkit-box-shadow", "-webkit-box-sizing"
  ]
}, 
{ 
  name: "Generated Content", 
  icon: "generated", 
  styles: [
    "content", "counter-increment", "counter-reset", "quotes"
  ]
}, 
{ 
  name: "Layout", 
  icon: "layout", 
  styles: [
    "bottom", "clear", "clip", "display", "float", "left", "overflow", "overflow-x", "overflow-y", "position", "right", "top", "visibility", "z-index", "-ms-overflow-x", "-ms-overflow-y"
  ]
}, 
{
  name: "Lists",
  icon: "lists", 
  styles: [
    "list-style", "list-style-image", "list-style-position", "list-style-type", "marker-offset", "marks"
  ]
}, 
{ 
  name: "Margins", 
  icon: "margins", 
  styles: [
    "margin", "margin-bottom", "margin-left", "margin-right", "margin-top", "-moz-margin-end", "-moz-margin-start", "-webkit-margin-after", "-webkit-margin-after-collapse", "-webkit-margin-before", "-webkit-margin-before-collapse", "-webkit-margin-bottom-collapse", "-webkit-margin-collapse", "-webkit-margin-end", "-webkit-margin-start", "-webkit-margin-top-collapse"
  ]
}, 
{ 
  name: "Padding", 
  icon: "padding", 
  styles: [
    "padding", "padding-bottom", "padding-left", "padding-right", "padding-top", "-moz-padding-end", "-moz-padding-start", "-webkit-padding-after", "-webkit-padding-before", "-webkit-padding-end", "-webkit-padding-start"
  ]
}, 
{ 
  name: "Paged Media", 
  icon: "paged", 
  styles: [
    "orphans", "page-break-after", "page-break-before", "page-break-inside", "widows"
  ]
}, 
{ 
  name: "Tables", 
  icon: "tables", 
  styles: [
    "border-collapse", "border-spacing", "caption-side", "empty-cells", "table-layout"
  ]
}, 
{ 
  name: "Typography", 
  icon: "typography", 
  styles: [
    "color", "direction", "font", "font-family", "font-size", "font-style", "font-variant", "font-weight", "letter-spacing", "line-height", "text-align", "text-decoration", "text-fill-color", "text-indent", "text-overflow", "text-rendering", "text-shadow", "text-stroke", "text-transform", "unicode-bidi", "vertical-align", "white-space", "word-break", "word-spacing", "word-wrap", "-ms-text-overflow", "-o-text-overflow", "-webkit-text-fill-color", "-webkit-text-size-adjust", "-webkit-text-stroke", "-webkit-text-stroke-color", "-webkit-text-stroke-width"
  ]
}, 
{ 
  name: "User Agent", 
  icon: "agent", 
  styles: [
    "appearance", "cursor", "pointer-events", "-moz-appearance", "-webkit-appearance"
  ]
}, 
{ 
  name: "Columns", 
  icon: "columns", 
  styles: [
    "-moz-column-count", "-moz-column-gap", "-moz-column-rule", "-moz-column-rule-color", "-moz-column-rule-style", "-moz-column-rule-width", "-moz-column-width", "-webkit-column-break-after", "-webkit-column-break-before", "-webkit-column-break-inside", "-webkit-column-count", "-webkit-column-gap", "-webkit-column-rule", "-webkit-column-rule-color", "-webkit-column-rule-style", "-webkit-column-rule-width", "-webkit-column-width", "-webkit-columns"
  ]
}, 
{ 
  name: "Transforms", 
  icon: "transform", 
  styles: [
    "-moz-transform", "-moz-transform-origin", "-o-transform", "-o-transform-origin", "-webkit-transform", "-webkit-transform-origin", "-webkit-transform-origin-x", "-webkit-transform-origin-y", "-webkit-transform-origin-z", "-webkit-transform-style"
  ]
}, 
{ 
  name: "Transitions", 
  icon: "transition", 
  styles: [
    "-moz-transition", "-moz-transition-delay", "-moz-transition-duration", "-moz-transition-property", "-moz-transition-timing-function", "-o-transition", "-o-transition-delay", "-o-transition-duration", "-o-transition-property", "-o-transition-timing-function", "-webkit-transition", "-webkit-transition-delay", "-webkit-transition-duration", "-webkit-transition-property", "-webkit-transition-timing-function"
  ]
}, 
{ 
  name: "Vendor-specific", 
  icon: "vendor", 
  styles: [
    "-moz-binding", "-moz-float-edge", "-moz-font-feature-settings", "-moz-force-broken-image-icon", "-moz-image-region", "-moz-stack-sizing", "-moz-tab-size", "-moz-user-focus", "-moz-user-input", "-moz-user-modify", "-moz-user-select", "-moz-window-shadow", "-ms-accelerator", "-ms-behavior", "-ms-block-progression", "-ms-filter", "-ms-ime-mode", "-ms-interpolation-mode", "-ms-layout-grid", "-ms-layout-grid-char", "-ms-layout-grid-line", "-ms-layout-grid-mode", "-ms-layout-grid-type", "-ms-line-break", "-ms-scrollbar-3dlight-color", "-ms-scrollbar-arrow-color", "-ms-scrollbar-base-color", "-ms-scrollbar-darkshadow-color", "-ms-scrollbar-face-color", "-ms-scrollbar-highlight-color", "-ms-scrollbar-shadow-color", "-ms-scrollbar-track-color", "-ms-text-align-last", "-ms-text-autospace", "-ms-text-justify", "-ms-text-kashida-space", "-ms-text-underline-position", "-ms-word-break", "-ms-word-wrap", "-ms-writing-mode", "-ms-zoom", "-o-object-fit", "-o-object-position", "-o-tab-size", "-o-table-baseline", "-webkit-dashboard-region", "-webkit-highlight", "-webkit-line-break", "-webkit-line-clamp", "-webkit-marquee", "-webkit-marquee-direction", "-webkit-marquee-increment", "-webkit-marquee-repetition", "-webkit-marquee-speed", "-webkit-marquee-style", "-webkit-nbsp-mode", "-webkit-rtl-ordering", "-webkit-text-security", "-webkit-user-drag", "-webkit-user-modify", "-webkit-user-select"
  ]
}];