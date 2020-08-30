
const allHandlers = async (f: (h: BaseHandler) => Promise<boolean>, fName: string) => {
    if (!loaded.done) return

    for (const Handler of handlers) {
        const handler = new Handler(client, loaded)
        try {
            const res = await f(handler)
            if (res) break
        } catch (error) {
            console.log(`> ${handler._name} errored in ${fName}!`)
            console.log(error)
        }
    }
}

client.on('ready', async () => {
    console.log(`$ Logged in as ${client.user.tag}`)
    client.user.setActivity('waves.', { type: 'WATCHING' })
})

client.on('guildMemberAdd', async (member) => {
    await allHandlers(async (handler) => await handler.onJoin(member), 'onJoin')
})

client.on('guildMemberRemove', async (member) => {
    await allHandlers(async (handler) => await handler.onLeave(member), 'onLeave')
})

client.on('message', async (message: Message) => {
    if (!loaded.done) return

    const users = message.mentions.users
    const members = await Promise.all(users.map((user) => loaded.guild?.fetchMember(user))) as GuildMember[]

    await allHandlers(async (handler) => await handler.onMessage(message, { members, users }), 'onMessage')
})

client.login(process.env.BOT_TOKEN)