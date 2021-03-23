/**
* @name CollapseGifs
* @displayName CollapseGifs
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
			name: "CollapseGifs",
			authors: [{
				name: "Strencher",
				discord_id: "415849376598982656",
				github_username: "Strencher",
				twitter_username: "Strencher3"
			}],
			version: "0.0.1",
			description: "Allows you to collapse gifs."
		},
		changelog: [{
			title: "Yeah",
			type: "added",
			items: ["The plugin exist"]
		}]
	};
	return !global.ZeresPluginLibrary ? class {
		constructor() {
			this._config = config;
		}

		getName() {
			return config.info.name;
		}

		getAuthor() {
			return config.info.authors.map(a => a.name).join(", ");
		}

		getDescription() {
			return config.info.description;
		}

		getVersion() {
			return config.info.version;
		}

		load() {
			BdApi.showConfirmationModal("Library plugin is needed", [`The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`], {
				confirmText: "Download",
				cancelText: "Cancel",
				onConfirm: () => {
					require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (error, response, body) => {
						if (error) return require("electron").shell.openExternal("https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js");
						await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r));
					});
				}
			});
		}

		start() { }

		stop() { }

	} : (([Plugin, Api]) => {
		const plugin = (Plugin, Api) => {
			const {
				WebpackModules,
				PluginUtilities,
				DiscordModules,
				ReactComponents,
				Patcher,
				Utilities
			} = Api;
			const {
				React
			} = DiscordModules;
			const classes = new Proxy(WebpackModules.getByProps("flexCenter", "imageWrapper", "imageWrapperBackground"), {
				set() {
					return null;
				},
				get(target, key) {
					return "." + target[key].split(' ').join('.');
				}
			});
			return class extends Plugin {
				constructor() {
					super();

					this.saveSettings = () => PluginUtilities.saveSettings(config.info.name, this.settings);

					this.settings = PluginUtilities.loadSettings(config.info.name, {
						gifs: {}
					});
					this.css = `.displayNone {
						filter: blur(100px);
					}

					.animated {
						transition: ease .4s;
					}

					.CG-btn {
					  	height: 25px;
					  	opacity: .7;
					  	background-color: black;
					  	color: white;
					  	position: relative;
					  	right: 7px;
					  	margin: 0px -5px 5px 0px;
					  	border-radius: 4px;
					}
					  
					.CG-btn + .gifFavoriteButton-2SKrBk {
					  	position: relative;
					  	right: 6px;
					}`;
				}

				async onStart() {
					PluginUtilities.addStyle(config.info.name, this.css);
					const img = await ReactComponents.getComponentByName("Image", classes.imageWrapper);
					this.unpatch = Patcher.after(img.component.prototype, "render", (e, _, ret) => {
						const children = Utilities.getNestedProp(ret, "props.children.0.props.children");
						if (!children) return;
						ret.props.children[1].props.className += this.settings.gifs[ret.props.href] ? " animated displayNone" : " animated";
						ret.props.children[0].props.children = [React.createElement("button", {
							className: "CG-btn",
							onClick: r => {
								r.preventDefault();
								r.stopPropagation();
								this.settings.gifs[ret.props.href] ? delete this.settings.gifs[ret.props.href] : this.settings.gifs[ret.props.href] = true;
								this.saveSettings();
								e.forceUpdate();
							}
						}, this.settings.gifs[ret.props.href] ? "Show" : "Hide"), ret.props.children[0].props.children];
					});
					img.forceUpdateAll();
				}

				onStop() {
					PluginUtilities.removeStyle(config.info.name);
					this.unpatch();
				}

			};
		};

		return plugin(Plugin, Api);
	})(global.ZeresPluginLibrary.buildPlugin(config));
})();
