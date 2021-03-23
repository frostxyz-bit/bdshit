/**
* @name PlatformIndicators
* @displayName PlatformIndicators
* @authorId 415849376598982656
* @invite gvA2ree
*/
/*@cc_on
@if (@_jscript)
    
    // Offer to self-install for clueless users that try to run this directly.
    var shell = WScript.CreateObject("WScript.Shell");
    var fs = new ActiveXObject("Scripting.FileSystemObject");
    var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\BetterDiscord\plugins");
    var pathSelf = WScript.ScriptFullName;
    // Put the user at ease by addressing them in the first person
    shell.Popup("It looks like you've mistakenly tried to run me directly. \n(Don't do that!)", 0, "I'm a plugin for BetterDiscord", 0x30);
    if (fs.GetParentFolderName(pathSelf) === fs.GetAbsolutePathName(pathPlugins)) {
        shell.Popup("I'm in the correct folder already.", 0, "I'm already installed", 0x40);
    } else if (!fs.FolderExists(pathPlugins)) {
        shell.Popup("I can't find the BetterDiscord plugins folder.\nAre you sure it's even installed?", 0, "Can't install myself", 0x10);
    } else if (shell.Popup("Should I copy myself to BetterDiscord's plugins folder for you?", 0, "Do you need some help?", 0x34) === 6) {
        fs.CopyFile(pathSelf, fs.BuildPath(pathPlugins, fs.GetFileName(pathSelf)), true);
        // Show the user where to put plugins in the future
        shell.Exec("explorer " + pathPlugins);
        shell.Popup("I'm installed!", 0, "Successfully installed", 0x40);
    }
    WScript.Quit();

@else@*/
module.exports = (() => {
    const config = {
        info: {
            name: "PlatformIndicators",
            authors: [
                {
                    name: "Strencher",
                    discord_id: "415849376598982656",
                    github_username: "Strencher",
                    twitter_username: "Strencher3"
                }
            ],
            version: "0.0.1",
            description: "Enhances the status indicators and adds customization to it.",
            github: "https://github.com/Strencher/BetterDiscordStuff/blob/master/PlatformIndicators/PlatformIndicators.plugin.js",
            github_raw: "https://raw.githubusercontent.com/Strencher/BetterDiscordStuff/master/PlatformIndicators/PlatformIndicators.plugin.js"
        },
        changelog: [
            {
                title: "Yeah",
                type: "added",
                items: ["The plugin exist"]
            }
        ]
    };
    //@ts-ignore
    const BdApi = window.BdApi;
    // @ts-ignore
    return !global.ZeresPluginLibrary ? class {
        constructor() {
            this._config = config;
        }
        getName() { return config.info.name; }
        getAuthor() { return config.info.authors.map(a => a.name).join(", "); }
        getDescription() { return config.info.description; }
        getVersion() { return config.info.version; }
        load() {
            BdApi.showConfirmationModal("Library plugin is needed", [`The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`], {
                confirmText: "Download",
                cancelText: "Cancel",
                onConfirm: () => {
                    require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (error, response, body) => {
                        if (error)
                            return require("electron").shell.openExternal("https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js");
                        await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r));
                    });
                }
            });
        }
        start() { }
        stop() { }
    } : (([Plugin, Api]) => {
        const plugin = (Plugin, Api) => {
            const { Utilities, WebpackModules, PluginUtilities, DiscordModules, ReactComponents, Patcher, Logger, DiscordModules: { React, UserStatusStore, DiscordConstants: { StatusTypes } } } = Api;
            const Utils = Object.assign(Utilities, {
                joinClassNames: (...classNames) => classNames.filter(Boolean).join(" ")
            });
            const DesktopIcon = React.memo(props => (React.createElement("svg", Object.assign({ width: "24", height: "24" }, props, { viewBox: "0 0 24 24" }),
                React.createElement("path", { fill: "currentColor", d: "M4 2.5C2.897 2.5 2 3.397 2 4.5V15.5C2 16.604 2.897 17.5 4 17.5H11V19.5H7V21.5H17V19.5H13V17.5H20C21.103 17.5 22 16.604 22 15.5V4.5C22 3.397 21.103 2.5 20 2.5H4ZM20 4.5V13.5H4V4.5H20Z" }))));
            const WebIcon = React.memo(props => (React.createElement("svg", Object.assign({ width: "24", height: "24" }, props, { viewBox: "0 0 24 24" }),
                React.createElement("path", { fill: "currentColor", d: "M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM11 19.93C7.05 19.44 4 16.08 4 12C4 11.38 4.08 10.79 4.21 10.21L9 15V16C9 17.1 9.9 18 11 18V19.93ZM17.9 17.39C17.64 16.58 16.9 16 16 16H15V13C15 12.45 14.55 12 14 12H8V10H10C10.55 10 11 9.55 11 9V7H13C14.1 7 15 6.1 15 5V4.59C17.93 5.78 20 8.65 20 12C20 14.08 19.2 15.97 17.9 17.39Z" }))));
            const MobileIcon = React.memo(props => (React.createElement("svg", Object.assign({ width: "24", height: "24" }, props, { viewBox: "0 0 24 24" }),
                React.createElement("g", { fill: "none" },
                    React.createElement("path", { fill: "currentColor", d: "M15.5 1h-8C6.12 1 5 2.12 5 3.5v17C5 21.88 6.12 23 7.5 23h8c1.38 0 2.5-1.12 2.5-2.5v-17C18 2.12 16.88 1 15.5 1zm-4 21c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4.5-4H7V4h9v14z" })))));
            const Icons = {
                mobile: MobileIcon,
                web: WebIcon,
                desktop: DesktopIcon
            };
            const getClass = (props, item, exclude = []) => {
                const module = WebpackModules.getModule(m => m && props.every(prop => m[prop] !== undefined) && exclude.every(e => m[e] == undefined));
                if (!module || !module[item])
                    return '';
                return "." + module[item].split(" ").join(".");
            };
            const { TooltipContainer: Tooltip } = WebpackModules.getByProps("TooltipContainer");
            const StatusModule = WebpackModules.getByProps("Status", "getStatusMask");
            const Flux = WebpackModules.getByProps("connectStores");
            const MessageTimestamp = WebpackModules.getByProps("MessageTimestamp");
            const { Messages } = WebpackModules.getByProps("Messages", "setLocale");
            const StatusIndicators = function StatusIndicators(props) {
                if (!props)
                    return null;
                return (React.createElement("div", { className: Utils.joinClassNames("PI-indicatorContainer", "PI-type_" + props.type) }, Object.keys(props).map(e => {
                    if (e == "type")
                        return null;
                    const color = StatusModule.getStatusColor(props[e]);
                    const Icon = Icons[e];
                    return React.createElement(Tooltip, { text: Messages[`STATUS_${(props[e] == "mobile" ? "mobile_online" : props[e]).toUpperCase()}`], position: "top" },
                        React.createElement(Icon, { style: { color }, width: "18", height: "18" }));
                })));
            };
            return class PlatformIndicators extends Plugin {
                constructor() {
                    super();
                    this.css = `
                    .PI-indicatorContainer {
                        display: inline-flex;
                    }

                    .header-23xsNx {
                        display: flex !important;
                        flex-direction: row !important;
                    }
                `;
                }
                getClients(userId) {
                    const status = UserStatusStore.getState().clientStatuses[userId];
                    return status ? status : {};
                }
                onStart() {
                    PluginUtilities.addStyle(config.info.name, this.css);
                    this.patchMessageHeader();
                    this.patchMemberListItem();
                    this.patchUserPopout();
                }
                async patchMemberListItem() {
                    const Item = await ReactComponents.getComponentByName("MemberListItem", getClass(["member"], "member"));
                    Patcher.after(Item.component.prototype, "render", ({ props }, _, returnValue) => {
                        try {
                            const tree = returnValue.props.decorators;
                            if (!tree)
                                return;
                            const FluxWrapper = Flux.connectStores([UserStatusStore], () => this.getClients(props.user.id));
                            tree.props.children.unshift(React.createElement(FluxWrapper(clients => React.createElement(StatusIndicators, Object.assign(clients, { type: "memberlist" })))));
                        }
                        catch (error) {
                            Logger.error("Error while patching MemberListItem:", error);
                        }
                    });
                    Item.forceUpdateAll();
                }
                async patchUserPopout() {
                    const ConnectedUserPopout = WebpackModules.getModule(m => Object(m.default).displayName === "ConnectedUserPopout");
                    const unpatch = Patcher.after(ConnectedUserPopout, "default", (_, args, ret) => {
                        unpatch();
                        ReactComponents.push(ret.type, getClass(["userPopout"], "userPopout"), m => m.displayName === name);
                    });
                    const UserPopout = await ReactComponents.getComponentByName("UserPopout", getClass(["userPopout"], "userPopout"));
                    Patcher.after(UserPopout.component.prototype, "renderHeader", (_this, _, returnValue) => {
                        try {
                            const tree = Utils.getNestedProp(returnValue, "props.children.0.props.children.1.props.children");
                            if (!Array.isArray(tree))
                                return returnValue;
                            const FluxWrapper = Flux.connectStores([UserStatusStore], () => this.getClients(_this.props.userId));
                            tree.unshift(React.createElement(FluxWrapper(clients => React.createElement(StatusIndicators, Object.assign(clients, { type: "userPopout" })))));
                        }
                        catch (error) {
                            Logger.error("Error while patching UserPopout:", error);
                        }
                    });
                    UserPopout.forceUpdateAll();
                }
                patchMessageHeader() {
                    Patcher.after(MessageTimestamp, "default", (_, [props], returnValue) => {
                        try {
                            const tree = Utils.getNestedProp(returnValue, "props.children.1.props.children");
                            if (!Array.isArray(tree))
                                return;
                            const FluxWrapper = Flux.connectStores([UserStatusStore], () => this.getClients(props.message.author.id));
                            tree.splice(2, 0, React.createElement(FluxWrapper(clients => React.createElement(StatusIndicators, Object.assign(clients, { type: "chat" })))));
                        }
                        catch (error) {
                            Logger.error("Error while patching MessageTimestammp:", error);
                        }
                    });
                }
                onStop() {
                    Patcher.unpatchAll();
                    PluginUtilities.removeStyle(config.info.name);
                }
            };
        };
        return plugin(Plugin, Api);
        //@ts-ignore
    })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/ 
