import { Guild, GuildMember, Message, User, Collection, Client } from 'discord.js'

export interface OnMessageExtras {
    users: Collection<string, User>,
    members: GuildMember[]
}

export abstract class BaseHandler {
    client: Client

    abstract _name: string

    constructor(client: Client) {
        this.client = client
    }

    abstract async onGuildJoin(guild: Guild): Promise<boolean>
    abstract async onMemberJoin(member: GuildMember): Promise<boolean>
    abstract async onMemberLeave(member: GuildMember): Promise<boolean>
    abstract async onMessage(message: Message, extras: OnMessageExtras): Promise<boolean>
}