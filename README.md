# inspirobot_bot
Sprinkle motivational images from [InspiroBot](http://inspirobot.me/) all over your group chats.

## Inspire my day
[**Start a chat with InspiroBot**](https://telegram.me/inspirobot_bot) and enter `/inspireme`.

## Development
1. `git clone`
2. `cd inspirobot_bot`
3. `npm init`
4. Rename `.env-sample` to `.env`, create a new Bot with the [BotFather](https://telegram.me/BotFather), replace token with new token
5. `npm start` or `npm watch`

## Hosting on Heroku
When hosting on Heroku, you need to either enable the runtime-dyno-metadata labs, or manually set the config variable named `HEROKU_APP_NAME` with the value being the name of your Heroku app. The bot constructs the WebHook URL for the Telegram API from this variable.

## License
inspirobot_bot is licensed under the MIT license. See LICENSE for details.
