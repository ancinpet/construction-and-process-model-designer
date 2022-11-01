(window.webpackJsonp=window.webpackJsonp||[]).push([[285],{1656:function(e,t,n){"use strict";n.r(t),n.d(t,"default",function(){return i});var a=n(565),c=n(930),r=function(){return(r=Object.assign||function(e){for(var t,n=1,a=arguments.length;n<a;n++)for(var c in t=arguments[n])Object.prototype.hasOwnProperty.call(t,c)&&(e[c]=t[c]);return e}).apply(this,arguments)};function i(e){return a.createElement(c.a,r({setup:!0},e))}},619:function(e,t,n){"use strict";n.d(t,"a",function(){return i});var a=n(565),c=n(560),r=n(72);function i(e){var t=e.children,n=e.date;return a.createElement(c.FormattedRelative,{value:Object(r.e)(n)},t)}},698:function(e,t,n){"use strict";n.d(t,"a",function(){return a}),n.d(t,"h",function(){return i}),n.d(t,"c",function(){return s}),n.d(t,"d",function(){return l}),n.d(t,"e",function(){return m}),n.d(t,"b",function(){return o}),n.d(t,"f",function(){return u}),n.d(t,"g",function(){return f});var a,c=n(23),r=n(583);function i(e){return Object(c.post)("/api/system/change_log_level",{level:e}).catch(r.a)}function s(){return Object(c.getJSON)("/api/system/info").catch(r.a)}function l(){return Object(c.getJSON)("/api/system/status")}function m(){return Object(c.getJSON)("/api/system/upgrades")}function o(){return Object(c.getJSON)("/api/system/db_migration_status")}function u(){return Object(c.postJSON)("/api/system/migrate_db")}!function(e){e.RED="RED",e.YELLOW="YELLOW",e.GREEN="GREEN"}(a||(a={}));var p=2e3;function d(){return new Promise(function(e){return function e(t){setTimeout(function(){l().then(function(n){"UP"===n.status?t():e(t)}).catch(function(){return e(t)})},p)}(e)})}function f(){return Object(c.post)("/api/system/restart").catch(r.a).then(d)}},801:function(e,t,n){"use strict";n.d(t,"a",function(){return m});var a=n(565),c=n(560),r=n(72),i=function(){return(i=Object.assign||function(e){for(var t,n=1,a=arguments.length;n<a;n++)for(var c in t=arguments[n])Object.prototype.hasOwnProperty.call(t,c)&&(e[c]=t[c]);return e}).apply(this,arguments)},s={hour:"numeric",minute:"numeric"},l={hour:"numeric",minute:"numeric",second:"numeric"};function m(e){var t=e.children,n=e.date,m=e.long;return a.createElement(c.FormattedTime,i({value:Object(r.e)(n)},m?l:s),t)}},928:function(e,t,n){(e.exports=n(571)(!1)).push([e.i,".maintenance-title{margin-bottom:40px;line-height:1.5;font-size:24px;font-weight:300;text-align:center}.maintenance-text{margin-bottom:16px;line-height:1.5;font-size:16px;font-weight:300}.maintenance-spinner{margin-top:40px;text-align:center}",""])},929:function(e,t,n){var a=n(928);"string"==typeof a&&(a=[[e.i,a,""]]);var c={hmr:!0,transform:void 0,insertInto:void 0};n(570)(a,c);a.locals&&(e.exports=a.locals)},930:function(e,t,n){"use strict";var a,c=n(565),r=n(566),i=n(585),s=n.n(i),l=n(698),m=n(619),o=n(801),u=n(567),p=n(13),d=n(577),f=(n(929),a=function(e,t){return(a=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n])})(e,t)},function(e,t){function n(){this.constructor=e}a(e,t),e.prototype=null===t?Object.create(t):(n.prototype=t.prototype,new n)}),b=function(e){function t(){var t=null!==e&&e.apply(this,arguments)||this;return t.mounted=!1,t.state={},t.fetchStatus=function(){(t.props.setup?t.fetchMigrationState():t.fetchSystemStatus()).catch(function(){t.mounted&&t.setState({message:void 0,startedAt:void 0,state:void 0,status:"OFFLINE"})})},t.fetchSystemStatus=function(){return Object(l.d)().then(function(e){var n=e.status;t.mounted&&(t.setState({status:n}),"STARTING"===n?(t.setState({wasStarting:!0}),t.scheduleRefresh()):"UP"===n?t.state.wasStarting&&t.loadPreviousPage():t.scheduleRefresh())})},t.fetchMigrationState=function(){return Object(l.b)().then(function(e){var n=e.message,a=e.startedAt,c=e.state;t.mounted&&(t.setState({message:n,startedAt:a,state:c}),"MIGRATION_SUCCEEDED"===c?t.loadPreviousPage():"NO_MIGRATION"!==c&&t.scheduleRefresh())})},t.scheduleRefresh=function(){t.interval=window.setTimeout(t.fetchStatus,5e3)},t.loadPreviousPage=function(){setInterval(function(){window.location.href=t.props.location.query.return_to||Object(d.b)()+"/"},2500)},t.handleMigrateClick=function(){Object(l.f)().then(function(e){var n=e.message,a=e.startedAt,c=e.state;t.mounted&&t.setState({message:n,startedAt:a,state:c})},function(){})},t}return f(t,e),t.prototype.componentDidMount=function(){this.mounted=!0,this.fetchStatus()},t.prototype.componentWillUnmount=function(){this.mounted=!1,this.interval&&window.clearInterval(this.interval)},t.prototype.render=function(){var e=this.state,t=e.state,n=e.status;return c.createElement(c.Fragment,null,c.createElement(s.a,{defaultTitle:Object(p.l)("maintenance.page")}),c.createElement("div",{className:"page-wrapper-simple",id:"bd"},c.createElement("div",{className:r("page-simple",{"panel-warning":"MIGRATION_REQUIRED"===t}),id:"nonav"},"OFFLINE"===n&&c.createElement(c.Fragment,null,c.createElement("h1",{className:"maintenance-title text-danger"},Object(p.l)("maintenance.sonarqube_is_offline")),c.createElement("p",{className:"maintenance-text"},Object(p.l)("maintenance.sonarqube_is_offline.text")),c.createElement("p",{className:"maintenance-text text-center"},c.createElement("a",{href:Object(d.b)()+"/"},Object(p.l)("maintenance.try_again")))),"UP"===n&&c.createElement(c.Fragment,null,c.createElement("h1",{className:"maintenance-title"},Object(p.l)("maintenance.sonarqube_is_up")),c.createElement("p",{className:"maintenance-text text-center"},Object(p.l)("maintenance.all_systems_opetational")),c.createElement("p",{className:"maintenance-text text-center"},c.createElement("a",{href:Object(d.b)()+"/"},Object(p.l)("layout.home")))),"STARTING"===n&&c.createElement(c.Fragment,null,c.createElement("h1",{className:"maintenance-title"},Object(p.l)("maintenance.sonarqube_is_starting")),c.createElement("p",{className:"maintenance-spinner"},c.createElement("i",{className:"spinner"}))),"DOWN"===n&&c.createElement(c.Fragment,null,c.createElement("h1",{className:"maintenance-title text-danger"},Object(p.l)("maintenance.sonarqube_is_down")),c.createElement("p",{className:"maintenance-text"},Object(p.l)("maintenance.sonarqube_is_down.text")),c.createElement("p",{className:"maintenance-text text-center"},c.createElement("a",{href:Object(d.b)()+"/"},Object(p.l)("maintenance.try_again")))),("DB_MIGRATION_NEEDED"===n||"DB_MIGRATION_RUNNING"===n)&&c.createElement(c.Fragment,null,c.createElement("h1",{className:"maintenance-title"},Object(p.l)("maintenance.sonarqube_is_under_maintenance")),c.createElement("p",{className:"maintenance-text",dangerouslySetInnerHTML:{__html:Object(p.l)("maintenance.sonarqube_is_under_maintenance.1")}}),c.createElement("p",{className:"maintenance-text",dangerouslySetInnerHTML:{__html:Object(p.l)("maintenance.sonarqube_is_under_maintenance.2")}})),"NO_MIGRATION"===t&&c.createElement(c.Fragment,null,c.createElement("h1",{className:"maintenance-title"},Object(p.l)("maintenance.database_is_up_to_date")),c.createElement("p",{className:"maintenance-text text-center"},c.createElement("a",{href:Object(d.b)()+"/"},Object(p.l)("layout.home")))),"MIGRATION_REQUIRED"===t&&c.createElement(c.Fragment,null,c.createElement("h1",{className:"maintenance-title"},Object(p.l)("maintenance.upgrade_database")),c.createElement("p",{className:"maintenance-text"},Object(p.l)("maintenance.upgrade_database.1")),c.createElement("p",{className:"maintenance-text"},Object(p.l)("maintenance.upgrade_database.2")),c.createElement("p",{className:"maintenance-text"},Object(p.l)("maintenance.upgrade_database.3")),c.createElement("div",{className:"maintenance-spinner"},c.createElement(u.a,{id:"start-migration",onClick:this.handleMigrateClick},Object(p.l)("maintenance.upgrade")))),"NOT_SUPPORTED"===t&&c.createElement(c.Fragment,null,c.createElement("h1",{className:"maintenance-title text-danger"},Object(p.l)("maintenance.migration_not_supported")),c.createElement("p",null,Object(p.l)("maintenance.migration_not_supported.text"))),"MIGRATION_RUNNING"===t&&c.createElement(c.Fragment,null,c.createElement("h1",{className:"maintenance-title"},Object(p.l)("maintenance.database_migration")),this.state.message&&c.createElement("p",{className:"maintenance-text text-center"},this.state.message),this.state.startedAt&&c.createElement("p",{className:"maintenance-text text-center"},Object(p.l)("background_tasks.table.started")," ",c.createElement(m.a,{date:this.state.startedAt}),c.createElement("br",null),c.createElement("small",{className:"text-muted"},c.createElement(o.a,{date:this.state.startedAt,long:!0}))),c.createElement("p",{className:"maintenance-spinner"},c.createElement("i",{className:"spinner"}))),"MIGRATION_SUCCEEDED"===t&&c.createElement(c.Fragment,null,c.createElement("h1",{className:"maintenance-title text-success"},Object(p.l)("maintenance.database_is_up_to_date")),c.createElement("p",{className:"maintenance-text text-center"},c.createElement("a",{href:Object(d.b)()+"/"},Object(p.l)("layout.home")))),"MIGRATION_FAILED"===t&&c.createElement(c.Fragment,null,c.createElement("h1",{className:"maintenance-title text-danger"},Object(p.l)("maintenance.upgrade_failed")),c.createElement("p",{className:"maintenance-text"},Object(p.l)("maintenance.upgrade_failed.text"))))))},t}(c.PureComponent);t.a=b}}]);
//# sourceMappingURL=285.9cc77d07.chunk.js.map