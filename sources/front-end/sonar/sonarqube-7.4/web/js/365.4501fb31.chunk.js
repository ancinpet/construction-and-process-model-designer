(window.webpackJsonp=window.webpackJsonp||[]).push([[365,270,375],{1684:function(t,e,n){"use strict";n.r(e);var o=n(565),r=n(574),i=n(701),a=n(640);var s={onFail:n(616).a};e.default=Object(r.connect)(null,s)(function(t){var e=t.params,n=e.extensionKey,r=e.pluginKey,s=t.component,c=s.configuration&&(s.configuration.extensions||[]).find(function(t){return t.key===r+"/"+n});return c?o.createElement(i.a,{extension:c,options:{component:s}}):o.createElement(a.default,{withContainer:!1})})},2:function(t,e,n){"use strict";n.r(e),n.d(e,"default",function(){return s});var o=n(565),r=n(680),i=n(573),a=n(690);function s(t){var e=t.children;return o.createElement("div",{className:"global-container"},o.createElement("div",{className:"page-wrapper",id:"container"},o.createElement(a.a,{className:"navbar-global",height:i.globalNavHeightRaw}),e),o.createElement(r.a,null))}},640:function(t,e,n){"use strict";n.r(e),n.d(e,"default",function(){return c});var o=n(565),r=n(585),i=n(569),a=n(2),s=n(13);function c(t){var e=t.withContainer,n=void 0===e||e?a.default:o.Fragment;return o.createElement(n,null,o.createElement(r.Helmet,{defaultTitle:Object(s.l)("404_not_found"),defer:!1}),o.createElement("div",{className:"page-wrapper-simple",id:"bd"},o.createElement("div",{className:"page-simple",id:"nonav"},o.createElement("h2",{className:"big-spacer-bottom"},Object(s.l)("page_not_found")),o.createElement("p",{className:"spacer-bottom"},Object(s.l)("address_mistyped_or_page_moved")),o.createElement("p",null,o.createElement(i.Link,{to:"/"},Object(s.l)("go_back_to_homepage"))))))}},701:function(t,e,n){"use strict";var o,r=n(574),i=n(565),a=n(585),s=n.n(a),c=n(572),p=n(569),l=n(560),u=n(771),f=n(13),d=n(632),m=(o=function(t,e){return(o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(t,e)},function(t,e){function n(){this.constructor=t}o(t,e),t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)}),h=function(){return(h=Object.assign||function(t){for(var e,n=1,o=arguments.length;n<o;n++)for(var r in e=arguments[n])Object.prototype.hasOwnProperty.call(e,r)&&(t[r]=e[r]);return t}).apply(this,arguments)},b=function(t){function e(){var e=null!==t&&t.apply(this,arguments)||this;return e.handleStart=function(t){var n=Object(d.default)();e.stop=t(h({store:n,el:e.container,currentUser:e.props.currentUser,intl:e.props.intl,location:e.props.location,router:e.props.router,suggestions:e.context.suggestions},e.props.options))},e.handleFailure=function(){e.props.onFail(Object(f.l)("page_extension_failed"))},e}return m(e,t),e.prototype.componentDidMount=function(){this.startExtension()},e.prototype.componentDidUpdate=function(t){t.extension!==this.props.extension?(this.stopExtension(),this.startExtension()):t.location!==this.props.location&&this.startExtension()},e.prototype.componentWillUnmount=function(){this.stopExtension()},e.prototype.startExtension=function(){var t=this.props.extension;Object(u.a)(t.key).then(this.handleStart,this.handleFailure)},e.prototype.stopExtension=function(){this.stop&&(this.stop(),this.stop=void 0)},e.prototype.render=function(){var t=this;return i.createElement("div",null,i.createElement(s.a,{title:this.props.extension.name}),i.createElement("div",{ref:function(e){return t.container=e}}))},e.contextTypes={suggestions:c.object.isRequired},e}(i.PureComponent),g=Object(l.injectIntl)(Object(p.withRouter)(b)),v=n(578),E={onFail:n(616).a};e.a=Object(r.connect)(function(t){return{currentUser:Object(v.getCurrentUser)(t)}},E)(g)}}]);
//# sourceMappingURL=365.4501fb31.chunk.js.map