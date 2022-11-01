export class ModelerConstants {
    public static PROCESS_NAME = "processBox";
    public static ACTOR_ROLE_NAME = "actorRole";
    public static ELEMENTARY_ROLE_NAME = "elementaryRole";
    public static SELF_ACTIVATING_ROLE_NAME = "selfActivatingRole";
    public static CONSTARINT_LINK_NAME = "constraintLink";

    public static LINKTYPE_WAIT = "waitLink";
    public static LINKTYPE_INSPECTION = "inspectionLink";
    public static LINKTYPE_DEFAULT = "defaultLink";

    public static ACTOR_LABEL_NAME = "actorLabel";

    public static SOI_EXTERNAL = "external";
    public static SOI_INTERNAL = "internal";

    public static ROLETYPE_ORIGINAL = "original";
    public static ROLETYPE_INFORMATIONAL = "informational";
    public static ROLETYPE_PHYSICAL = "physical";
    public static ROLETYPE_DOCUMENTAL = "documental";

    public static LINK_ORIENTATION_UP = "Top";
    public static LINK_ORIENTATION_DOWN = "Bottom";

    public static LINK_ACT_REQUEST = "request";
    public static LINK_ACT_PROMISE = "promise";
    public static LINK_ACT_DECLINE = "decline";
    public static LINK_ACT_QUIT = "quit";
    public static LINK_ACT_STATE = "state";
    public static LINK_ACT_ACCEPT = "accept";
    public static LINK_ACT_REJECT = "reject";
    public static LINK_ACT_STOP = "stop";

    public static LINK_ACT_REQUEST_S = "rq";
    public static LINK_ACT_PROMISE_S = "pm";
    public static LINK_ACT_DECLINE_S = "dc";
    public static LINK_ACT_QUIT_S = "qt";
    public static LINK_ACT_STATE_S = "st";
    public static LINK_ACT_ACCEPT_S = "ac";
    public static LINK_ACT_REJECT_S = "rj";
    public static LINK_ACT_STOP_S = "sp";

    public static PATH_ACTOR_ROLE_OVERLAY = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCiA8Zz4NCiAgPHJlY3Qgc3Ryb2tlPSIjMDAwMDAwIiBoZWlnaHQ9Ijk1IiB3aWR0aD0iOTUiIHk9IjIuNzk5ODYiIHg9IjIuNTI5NTMiIGZpbGw9IiNmZmZmZmYiLz4NCiA8L2c+DQo8L3N2Zz4=";
    public static OVERLAY_ACTOR_ROLE_WIDTH = 40;
    public static OVERLAY_ACTOR_ROLE_HEIGHT = 40;

    public static PATH_ELEMENTARY_ROLE_OVERLAY = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTMwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCiA8Zz4NCiAgPHJlY3QgdHJhbnNmb3JtPSJyb3RhdGUoLTkwIDc5LjM5NTk5NjA5Mzc1LDUwLjEyMTg4MzM5MjMzMzk4KSAiIGZpbGw9IiNmZmZmZmYiIHg9IjMxLjg5NTk5IiB5PSIyLjYyMTg4IiB3aWR0aD0iOTUiIGhlaWdodD0iOTUiIHN0cm9rZT0iIzAwMDAwMCIvPg0KICA8Y2lyY2xlIHRyYW5zZm9ybT0icm90YXRlKC05MCAzMS44OTU5OTQxODY0MDEzNyw1MC4wNTcxMjEyNzY4NTU0NykgIiBmaWxsPSIjZmZmZmZmIiBzdHJva2U9IiMwMDAwMDAiIGN4PSIzMS44OTU5OSIgY3k9IjUwLjA1NzEyIiByPSIzMCIvPg0KICA8cmVjdCBzdHJva2U9IiNjMjE4MDciIGZpbGw9IiNjMjE4MDciIHg9IjExLjU3NzU2IiB5PSIyOS43MzQ4OSIgd2lkdGg9IjQwLjY0NDQyIiBoZWlnaHQ9IjQwLjY0NDQyIiBpZD0ic3ZnXzYiIHRyYW5zZm9ybT0icm90YXRlKC00NSAzMS44OTk3NzA3MzY2OTQzMSw1MC4wNTcxMDIyMDMzNjkxMykgIi8+DQogPC9nPg0KPC9zdmc+";
    public static OVERLAY_ELEMENTARY_ROLE_WIDTH = 52;
    public static OVERLAY_ELEMENTARY_ROLE_HEIGHT = 40;

    public static PATH_SELF_ACTIVATING_ROLE_OVERLAY = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCiA8Zz4NCiAgPHJlY3Qgc3Ryb2tlPSIjMDAwMDAwIiBoZWlnaHQ9Ijk1IiB3aWR0aD0iOTUiIHk9IjIuNzk5ODYiIHg9IjIuNTI5NTMiIGZpbGw9IiNmZmZmZmYiIHRyYW5zZm9ybT0icm90YXRlKC05MCA1MC4wMjk1MzMzODYyMzA0NzYsNTAuMjk5ODU4MDkzMjYxNzIpIi8+DQogIDxjaXJjbGUgcj0iMzAiIGN5PSI1MC4wNTcxMiIgY3g9IjQ4LjYyNTk3IiBzdHJva2U9IiMwMDAwMDAiIGZpbGw9IiNmZmZmZmYiIHRyYW5zZm9ybT0icm90YXRlKC05MCA0OC42MjU5NzY1NjI1MDAwMSw1MC4wNTcxMjEyNzY4NTU0NykiLz4NCiAgPHJlY3QgdHJhbnNmb3JtPSJyb3RhdGUoLTQ1IDQ4LjYyOTc1MzExMjc5MjkzLDUwLjA1NzEwMjIwMzM2OTEyNikiIGhlaWdodD0iNDAuNjQ0NDIiIHdpZHRoPSI0MC42NDQ0MiIgeT0iMjkuNzM0ODkiIHg9IjI4LjMwNzU0IiBmaWxsPSIjYzIxODA3IiBzdHJva2U9IiNjMjE4MDciLz4NCiA8L2c+DQo8L3N2Zz4=";
    public static OVERLAY_SELF_ACTIVATING_ROLE_WIDTH = 40;
    public static OVERLAY_SELF_ACTIVATING_ROLE_HEIGHT = 40;

    public static PATH_PROCESS_OVERLAY = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCiA8Zz4NCiAgPHRleHQgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9InNlcmlmIiBmb250LXNpemU9IjEyMCIgeT0iOTAuMzM1MzgiIHg9IjUxLjA5MTI1IiBzdHJva2Utd2lkdGg9IjAiIGZpbGw9IiMwMDAwMDAiPlA8L3RleHQ+DQogPC9nPg0KPC9zdmc+";
    public static OVERLAY_PROCESS_WIDTH = 40;
    public static OVERLAY_PROCESS_HEIGHT = 40;

    public static PATH_ERROR_OVERLAY = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSJub25lIiBkPSJNMCAwaDI0djI0SDBWMHoiLz48cGF0aCBmaWxsPSIjYzIxODA3IiBkPSJNMTEgMTVoMnYyaC0yem0wLThoMnY2aC0yem0uOTktNUM2LjQ3IDIgMiA2LjQ4IDIgMTJzNC40NyAxMCA5Ljk5IDEwQzE3LjUyIDIyIDIyIDE3LjUyIDIyIDEyUzE3LjUyIDIgMTEuOTkgMnpNMTIgMjBjLTQuNDIgMC04LTMuNTgtOC04czMuNTgtOCA4LTggOCAzLjU4IDggOC0zLjU4IDgtOCA4eiIvPjwvc3ZnPg==";
    public static OVERLAY_ERROR_WIDTH = 40;
    public static OVERLAY_ERROR_HEIGHT = 40;

    public static MXGRAPH_SHAPE_IMAGE = "shape=image;whiteSpace=wrap;fontColor=#000000;image=data:image/svg+xml,"

    public static CURSOR_PLUS = "cell";
    public static CURSOR_ERROR = "not-allowed";    

    public static TEXT_OFFSET_PROCESS_X = 0;
    public static TEXT_OFFSET_PROCESS_Y = 0;

    public static TEXT_OFFSET_ACTOR_ROLE_X = 0;
    public static TEXT_OFFSET_ACTOR_ROLE_Y = 0;

    public static TEXT_OFFSET_ELEMENTARY_ROLE_X = 30;
    public static TEXT_OFFSET_ELEMENTARY_ROLE_Y = 0;

    public static TEXT_OFFSET_SELF_ACTIVATING_ROLE_X = 0;
    public static TEXT_OFFSET_SELF_ACTIVATING_ROLE_Y = 40;

    public static WAIT_LINK_RELATIVE_POSITION_UP_X = 40;
    public static WAIT_LINK_RELATIVE_POSITION_UP_Y = -20;

    public static WAIT_LINK_RELATIVE_POSITION_UP_ELEMENTARY_X = 60;
    public static WAIT_LINK_RELATIVE_POSITION_UP_ELEMENTARY_Y = -20;

    public static WAIT_LINK_RELATIVE_POSITION_DOWN_X = 40;
    public static WAIT_LINK_RELATIVE_POSITION_DOWN_Y = 1;

    public static WAIT_LINK_RELATIVE_POSITION_DOWN_ELEMENTARY_X = 60;
    public static WAIT_LINK_RELATIVE_POSITION_DOWN_ELEMENTARY_Y = 1;

    public static DEFAULT_LINK_ACT_PAD = ""; // used  to be "&nbsp;&nbsp;" but not supported in svg export 
    public static STYLE_EDGE_DEFAULT = "entryX=0.01;entryY=0.5;exitX=1;exitY=0.5;html=1;fontColor=#000000;";
    public static STYLE_EDGE_PROCESS_TO_ANY = "opacity=0;selectable=0;";
    public static STYLE_MOUSEOVER_HIGHLIGHT = "#9ec7ff";
    public static STYLE_SELECTED_HIGHLIGHT = "#0096fd";
    public static STYLE_APPEND_ACTION_HIGHLIGHT = "#4e71a0";

    public static TOOLTIPS_SIDEBAR_ORIGINAL = "Make transaction type original.";
    public static PATH_SIDEBAR_ORIGINAL = "/assets/ocd-psd-model/sidebar-icons/transaction-original.svg"
    public static PATH_SIDEBAR_ORIGINAL_ANIMATION = "/assets/ocd-psd-model/sidebar-icons/transaction-original-animation.svg"

    public static TOOLTIPS_SIDEBAR_INFORMATIONAL = "Make transaction type informational.";
    public static PATH_SIDEBAR_INFORMATIONAL = "/assets/ocd-psd-model/sidebar-icons/transaction-informational.svg"
    public static PATH_SIDEBAR_INFORMATIONAL_ANIMATION = "/assets/ocd-psd-model/sidebar-icons/transaction-informational-animation.svg"

    public static TOOLTIPS_SIDEBAR_DOCUMENTAL = "Make transaction type documental.";
    public static PATH_SIDEBAR_DOCUMENTAL = "/assets/ocd-psd-model/sidebar-icons/transaction-documental.svg"
    public static PATH_SIDEBAR_DOCUMENTAL_ANIMATION = "/assets/ocd-psd-model/sidebar-icons/transaction-documental-animation.svg"

    public static ID_CHECKBOX_COMPOSITE = "mxgraph-composite-checkbox";
    public static ID_CHECKBOX_COMPOSITE_INPUT = "mxgraph-composite-checkbox-input";

    public static ID_COMBO_TRANSACTION = "mxgraph-actor-transation";
    public static ID_COMBO_TRANSACTION_SELECT = "mxgraph-actor-transation-select";

    public static ID_COMBO_LINK = "mxgraph-link-type";
    public static ID_COMBO_LINK_SELECT = "mxgraph-link-type-select";

    public static CONSTRAINT_LINK_BEGINING = "edgeStyle=orthogonalEdgeStyle;fontColor=#000000;rounded=0;html=1;";

    public static CONSTRAINT_LINK_SOURCE_ELEMENTARY = "exitX=0.07;exitY=";
    public static CONSTRAINT_LINK_SOURCE_SELF_ACTIVATING = "exitX=0.71;exitY=";
    public static CONSTRAINT_LINK_SOURCE_ELEMENTARY_OF_PX = 20;

    public static CONSTRAINT_LINK_TARGET_UP = "entryX=0.3;entryY=0;";
    public static CONSTRAINT_LINK_TARGET_DOWN = "entryX=0.3;entryY=1;";
    
    public static WAITLINK_STYLE = "jettySize=auto;movable=0;editable=0;bendable=1;resizable=0;rotatable=0;selectable=1;dashed=1;endArrow=classic;startArrow=none;";
    public static INSPECTIONLINK_STYLE = "jettySize=auto;movable=0;editable=0;bendable=1;resizable=0;rotatable=0;selectable=1;dashed=1;endArrow=none;startArrow=none;";

    public static EVENT_KEY_DELETE = 46;

    public static MX_MILIMETER_PIXEL_CONSTANT = 3.936026936026936; //(1169 / 297 = 3.936026936026936) - mxGraph defines A4 size as 826x1169 pixels, real A4 size is 210x297 mm
    public static APPEND_BETWEEN_X = 70;

    public static DISTANCE_NODE_X = 20;
    public static DISTANCE_NODE_X_ALT = 10;
    public static DISTANCE_NODE_Y = 80;
    public static DISTANCE_PADDING_TOP = 45;

    public static STYLE_IMAGE_SEARCH = "image=data:image/svg+xml,";

    public static CONSTRAINT_LINK_LABEL_X = 15;
    public static CONSTRAINT_LINK_LABEL_Y_UP = -13;
    public static CONSTRAINT_LINK_LABEL_Y_DOWN = 13;
}