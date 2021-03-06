/**
* @name BetterStreaming
* @displayName BetterStreaming
* @authorId 415849376598982656
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

@else@*/
module.exports = (() => {
    const config = {
        info: {
            name: "BetterStreaming",
            authors: [
                {
                    name: "Strencher",
                    discord_id: "415849376598982656",
                    github_username: "Strencher",
                    twitter_username: "Strencher3"
                }
            ],
            version: "0.0.1",
            description: "Shows the true amount of users watching your stream.",
        },
        changelog: [
            {
                title: "BetterStreaming",
                type: "added",
                items: ["woo!"]
            }
        ]
    };



patch(w.getDefault("ParticipantsForSelectedParticipant"), "default", (_this, args, ret) => {
    const old = ret.type;

    ret.type = function (e) {
        const ret = old.apply(this, arguments);
        ret.props.text = React.createElement("div", {
            style: {display: "flex", justifyContent: "space-between"},
            children: e.users.map(e => React.createElement("div", {
                key: e.id,
                children: e.username,
                style: {marginRight: 2}
            }))
        })
        return ret;
    }
})
