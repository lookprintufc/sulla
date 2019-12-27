import { Page } from 'puppeteer';
import { ExposedFn } from './functions/exposed.enum';
import { Chat } from './model/chat';
import { Contact } from './model/contact';
import { Message } from './model/message';
import { Id } from './model/id';

declare module WAPI {
  const waitNewMessages: (rmCallback: boolean, callback: Function) => void;
  const sendMessage: (to: string, content: string) => void;
  const sendMessageToID: (to: string, content: string) => void;
  const sendLocation: (to: string, lat: any,lng: any,loc:string) => void;
  const sendSeen: (to: string) => void;
  const sendImage: (
    base64: string,
    to: string,
    filename: string,
    caption: string
  ) => void;
  const sendFile: (
    base64: string,
    to: string,
    filename: string,
    caption: string
  ) => void;
  const getAllContacts: () => Contact[];
  const getAllChats: () => Chat[];
  const getAllChatsWithNewMsg: () => Chat[];
  const getAllGroups: () => Chat[];
  const getGroupParticipantIDs: (groupId: string) => Id[];
  const getContact: (contactId: string) => Contact;
  const checkNumberStatus:  (contactId: string) => any;
  const getChatById: (contactId: string) => Chat;
  const deleteMessage: (contactId: string, messageId: [string] | string, revoke ?: boolean) => any;
  const sendContact: (to: string, contact: string | string[]) => any;
  const simulateTyping: (to: string, on: boolean) => void;
  const isConnected : () => Boolean;
  const getUnreadMessages:  (
    includeMe: boolean,
    includeNotifications: boolean,
    use_unread_count: boolean
  ) => any;
  const getAllMessagesInChat: (
    chatId: string,
    includeMe: boolean,
    includeNotifications: boolean,
   ) => [Message]
}

export class Whatsapp {
         constructor(public page: Page) {
           this.page = page;
         }

         /**
          * Listens to messages received
          * @returns Observable stream of messages
          */
         public onMessage(fn: (message: Message) => void) {
           this.page.exposeFunction(ExposedFn.OnMessage, (message: Message) =>
             fn(message)
           );
         }

         /**
          * Sends a text message to given chat
          * @param to chat id: xxxxx@us.c
          * @param content text message
          */
         public async sendText(to: string, content: string) {
           return await this.page.evaluate(
             ({ to, content }) => {
               WAPI.sendSeen(to);
               WAPI.sendMessage(to, content);
             },
             { to, content }
           );
         }


           /**
          * Sends a text message to id chat
          * @param to chat id: xxxxx@us.c
          * @param content text message
          */
         public async sendTextToId(to: string, content: string) {
           return await this.page.evaluate(
             ({ to, content }) => {
               //WAPI.sendSeen(to);
               WAPI.sendMessageToID(to, content);
             },
             { to, content }
           );
         }


         /**
          * Sends a location message to given chat
          * @param to chat id: xxxxx@c.us
          * @param lat latitude: '51.5074'
          * @param lng longitude: '0.1278'
          * @param loc location text: 'LONDON!'
          */
         public async sendLocation(to: string, lat: any,lng: any,loc: string) {
          return await this.page.evaluate(
            ({ to, lat, lng, loc }) => {
              WAPI.sendLocation(to, lat, lng, loc );
            },
            { to, lat, lng, loc }
          );
        }

         /**
          * Sends a image to given chat, with caption or not, using base64
          * @param to chat id xxxxx@us.c
          * @param base64 base64 data:image/xxx;base64,xxx
          * @param filename string xxxxx
          * @param caption string xxxxx
          */
         public async sendImage(
          to: string,
          base64: string,
          filename: string,
          caption: string
        ) {
          return await this.page.evaluate(
            ({ to, base64, filename, caption }) => {
              WAPI.sendImage(base64, to, filename, caption);
            },
            { to, base64, filename, caption }
          );
        }


         /**
          * Sends a file to given chat, with caption or not, using base64. This is exactly the same as sendImage
          * @param to chat id xxxxx@us.c
          * @param base64 base64 data:image/xxx;base64,xxx
          * @param filename string xxxxx
          * @param caption string xxxxx
          */
         public async sendFile(
          to: string,
          base64: string,
          filename: string,
          caption: string
        ) {
          return await this.page.evaluate(
            ({ to, base64, filename, caption }) => {
              WAPI.sendImage(base64, to, filename, caption);
            },
            { to, base64, filename, caption }
          );
        }


        /**
         * Sends contact card to given chat id
         * @param {string} to 'xxxx@c.us'
         * @param {string|array} contact 'xxxx@c.us' | ['xxxx@c.us', 'yyyy@c.us', ...]
         */
        public async sendContact(to: string, contactId: string | string[]) {
          return await this.page.evaluate(
            ({ to, contactId }) => WAPI.sendContact(to, contactId),
            { to, contactId }
          );
        }


        /**
         * Simulate '...typing' in chat
         * @param {string} to 'xxxx@c.us'
         * @param {boolean} on turn on similated typing, false to turn it off you need to manually turn this off.
         */
        public async simulateTyping(to: string, on: boolean) {
          return await this.page.evaluate(
            ({ to, on }) => WAPI.simulateTyping(to, on),
            { to, on }
          );
        }

         /**
          * Retrieves all contacts
          * @returns array of [Contact]
          */
         public async getAllContacts() {
           return await this.page.evaluate(() => WAPI.getAllContacts());
         }

         /**
          * Retrieves if the phone is online. Please note that this may not be real time.
          * @returns Boolean
          */
         public async isConnected() {
           return await this.page.evaluate(() => WAPI.isConnected());
         }

         /**
          * Retrieves all chats
          * @returns array of [Chat]
          */
         public async getAllChats(withNewMessageOnly = false) {
           if (withNewMessageOnly) {
             return await this.page.evaluate(() =>
               WAPI.getAllChatsWithNewMsg()
             );
           } else {
             return await this.page.evaluate(() => WAPI.getAllChats());
           }
         }

         /**
          * Retrieve all groups
          * @returns array of groups
          */
         public async getAllGroups(withNewMessagesOnly = false) {
           if (withNewMessagesOnly) {
             // prettier-ignore
             const chats = await this.page.evaluate(() => WAPI.getAllChatsWithNewMsg());
             return chats.filter(chat => chat.isGroup);
           } else {
             const chats = await this.page.evaluate(() => WAPI.getAllChats());
             return chats.filter(chat => chat.isGroup);
           }
         }

         /**
          * Retrieves group members as [Id] objects
          * @param groupId group id
          */
         public async getGroupMembersId(groupId: string) {
           return await this.page.evaluate(
             groupId => WAPI.getGroupParticipantIDs(groupId),
             groupId
           );
         }

         /**
          * Returns group members [Contact] objects
          * @param groupId
          */
         public async getGroupMembers(groupId: string) {
           const membersIds = await this.getGroupMembersId(groupId);
           const actions = membersIds.map(memberId => {
             return this.getContact(memberId._serialized);
           });
           return await Promise.all(actions);
         }

         /**
          * Retrieves contact detail object of given contact id
          * @param contactId
          * @returns contact detial as promise
          */
         //@ts-ignore
         public async getContact(contactId: string) {
           return await this.page.evaluate(
             contactId => WAPI.getContact(contactId),
             contactId
           );
         }

         /**
          * Retrieves chat object of given contact id
          * @param contactId
          * @returns contact detial as promise
          */
         public async getChatById(contactId: string) {
          return await this.page.evaluate(
            contactId => WAPI.getChatById(contactId),
            contactId
          );
        }


        /**
         * Deletes message of given message id
         * @param messageId
         * @returns nothing
         */
        public async deleteMessage(contactId: string, messageId: [string] | string, revoke ?: boolean) {
          return await this.page.evaluate(
            ({contactId, messageId, revoke}) => WAPI.deleteMessage(contactId, messageId, revoke),
            {contactId, messageId, revoke}
          );
        }

         /**
          * Checks if a number is a valid whatsapp number
          * @param contactId, you need to include the @c.us at the end.
          * @returns contact detial as promise
          */
         public async checkNumberStatus(contactId: string) {
          return await this.page.evaluate(
            contactId => WAPI.checkNumberStatus(contactId),
            contactId
          );
        }
         
         /**
          * Retrieves all undread Messages
          * @param includeMe
          * @param includeNotifications
          * @param use_unread_count
          * @returns any
          */
         public async getUnreadMessages(includeMe: boolean, includeNotifications: boolean, use_unread_count: boolean) {
          return await this.page.evaluate(
            ({includeMe,includeNotifications,use_unread_count}) => WAPI.getUnreadMessages(includeMe,includeNotifications,use_unread_count),
            {includeMe,includeNotifications,use_unread_count}
          );
         }


         /**
          * Retrieves all Messages in a chat
          * @param chatId, the chat to get the messages from
          * @param includeMe, include my own messages? boolean
          * @param includeNotifications
          * @returns any
          */

         public async getAllMessagesInChat(chatId: string, includeMe: boolean, includeNotifications: boolean) {
          return await this.page.evaluate(
            ({chatId, includeMe,includeNotifications}) => WAPI.getAllMessagesInChat(chatId, includeMe,includeNotifications),
            {chatId, includeMe,includeNotifications}
          );
         }
       }