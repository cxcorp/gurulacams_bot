# gurulacams_bot
Spam [gurulacams](http://gurula.wtf/cams) into your Telegram chats.

## Using the bot
[**Start a chat with GurulaCamsBot**](https://telegram.me/gurulacams_bot) and enter `/cams`.

## Development
1. `git clone`
2. `cd gurulacams_bot`
3. `npm install` / `yarn`
4. Rename `.env-sample` to `.env`, create a new Bot with the [BotFather](https://telegram.me/BotFather), replace token with new token
5. `npm watch` / `yarn watch`

## Hosting on Heroku
When hosting on Heroku, you need to either enable the runtime-dyno-metadata labs (`heroku labs:enable runtime-dyno-metadata -a <app name>`), or manually set the config variable named `HEROKU_APP_NAME` with the value being the name of your Heroku app. The bot constructs the WebHook URL for the Telegram API from this variable.

## License
gurulacams_bot is licensed under the MIT license. See LICENSE for details.
