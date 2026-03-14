/**
 * @name CopyDisplayName
 * @author ChatGPT
 * @version 1.0.0
 * @description Adds a button to copy a user's display name.
 */

module.exports = class CopyDisplayName {
    start() {
        this.patch();
    }

    stop() {
        if (this.unpatch) this.unpatch();
    }

    patch() {
        const { Patcher, WebpackModules, DiscordModules } = BdApi;

        const UserContextMenu = WebpackModules.find(m =>
            m?.default?.displayName === "UserContextMenu"
        );

        this.unpatch = Patcher.after(
            "CopyDisplayName",
            UserContextMenu,
            "default",
            (_, [props], ret) => {
                const { React } = DiscordModules;

                const MenuItem = WebpackModules.find(
                    m => m?.default?.displayName === "MenuItem"
                )?.default;

                if (!MenuItem) return;

                ret.props.children.push(
                    React.createElement(MenuItem, {
                        id: "copy-display-name",
                        label: "Copy Display Name",
                        action: () => {
                            const name =
                                props.user.globalName ||
                                props.user.username;

                            navigator.clipboard.writeText(name);
                        }
                    })
                );
            }
        );
    }
};
