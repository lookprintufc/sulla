import { Page } from 'puppeteer';
import { Chat } from './model/chat';
import { Contact } from './model/contact';
import { Message } from './model/message';
import { Id } from './model/id';
export declare class Whatsapp {
    page: Page;
    constructor(page: Page);
    onMessage(fn: (message: Message) => void): void;
    sendText(to: string, content: string): Promise<void>;
    sendTextToId(to: string, content: string): Promise<void>;
    sendLocation(to: string, lat: any, lng: any, loc: string): Promise<void>;
    sendImage(to: string, base64: string, filename: string, caption: string): Promise<void>;
    sendFile(to: string, base64: string, filename: string, caption: string): Promise<void>;
    sendContact(to: string, contactId: string | string[]): Promise<any>;
    simulateTyping(to: string, on: boolean): Promise<void>;
    getAllContacts(): Promise<Contact[]>;
    isConnected(): Promise<Boolean>;
    getAllChats(withNewMessageOnly?: boolean): Promise<Chat[]>;
    getAllGroups(withNewMessagesOnly?: boolean): Promise<Chat[]>;
    getGroupMembersId(groupId: string): Promise<Id[]>;
    getGroupMembers(groupId: string): Promise<Contact[]>;
    getContact(contactId: string): Promise<Contact>;
    getChatById(contactId: string): Promise<Chat>;
    deleteMessage(contactId: string, messageId: [string] | string, revoke?: boolean): Promise<any>;
    checkNumberStatus(contactId: string): Promise<any>;
    getUnreadMessages(includeMe: boolean, includeNotifications: boolean, use_unread_count: boolean): Promise<any>;
    getAllMessagesInChat(chatId: string, includeMe: boolean, includeNotifications: boolean): Promise<[Message]>;
}
