(window.webpackJsonp=window.webpackJsonp||[]).push([[318],{1667:function(t,n,o){"use strict";o.r(n),o.d(n,"default",function(){return r});var e=o(565),s=o(910),i=o(589);function r(t){return e.createElement(e.Fragment,null,e.createElement(s.a,{isFavorite:!1,location:t.location,organization:t.organization}),e.createElement(i.a,{suggestions:"organization_projects"}))}},589:function(t,n,o){"use strict";var e,s=o(565),i=o(572),r=(e=function(t,n){return(e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,n){t.__proto__=n}||function(t,n){for(var o in n)n.hasOwnProperty(o)&&(t[o]=n[o])})(t,n)},function(t,n){function o(){this.constructor=t}e(t,n),t.prototype=null===n?Object.create(n):(o.prototype=n.prototype,new o)}),u=function(t){function n(){return null!==t&&t.apply(this,arguments)||this}return r(n,t),n.prototype.componentDidMount=function(){this.context.suggestions.addSuggestions(this.props.suggestions)},n.prototype.componentDidUpdate=function(t){t.suggestions!==this.props.suggestions&&(this.context.suggestions.removeSuggestions(this.props.suggestions),this.context.suggestions.addSuggestions(t.suggestions))},n.prototype.componentWillUnmount=function(){this.context.suggestions.removeSuggestions(this.props.suggestions)},n.prototype.render=function(){return null},n.contextTypes={suggestions:i.object.isRequired},n}(s.PureComponent);n.a=u}}]);
//# sourceMappingURL=318.0adcfb06.chunk.js.map