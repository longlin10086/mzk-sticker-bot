import { handleTexts } from "./components/handleTexts.js";
import TelegramBot from "node-telegram-bot-api";
// import imageDataURI from "image-data-uri";
import crypto from "crypto";
import sharp from "sharp";

const token = process.env.BOT_API;

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/help/, (msg, match) => {
  const chatId = msg.chat.id;
  const resp = `
咱 bot 事 mzk 激推，mzk 太可爱了 mzk！
仓库地址：https://github.com/longlin10086/mzk-sticker-bot
/help 查看帮助
`;

  bot.sendMessage(chatId, resp).then(() => {
    bot.sendSticker(
      chatId,
      "CAACAgUAAxkBAANeZy96lLeJcy8bndxmVegE1YLNxvsAAkgSAAKVPCBWagcusRx8Gxg2BA"
    );
  });
});

bot.onText(/\/quote (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const resp = match[1];

  console.log(msg);
  bot.sendMessage(chatId, resp, { reply_to_message_id: msg.message_id });
});

bot.onText(/\/quote/, (msg, match) => {
  const chatId = msg.chat.id;
  const context = msg.reply_to_message?.text;

  console.log(context);
  bot.sendMessage(chatId, context, { reply_to_message_id: msg.message_id });
});

bot.on("inline_query", async (query) => {
  const inlineQueryId = query.id;
  let text = query.query;
  const userId = query.from.id;

  // console.log(query);

  let promises = handleTexts(text);
  if (promises === null) return;

  try {
    const results = await Promise.all(promises);
    const botInfo = await bot.getMe();
    const stickerSetName = `stickers_by_${botInfo.username}`;

    // Process each image and create sticker results
    let stickerSet = [];
    try {
      stickerSet = await bot.getStickerSet(stickerSetName);
    } catch (e) {
      let buffer = results[1];
      // let buffer = await imageDataURI.decode(firstSticker).dataBuffer;

      buffer = await sharp(buffer)
        .resize(512, 512, {
          fit: "contain",
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .png({ compressionLevel: 9 })
        .toBuffer();

      // console.log(buffer);

      await bot.createNewStickerSet(
        userId,
        stickerSetName,
        `User ${userId}'s stickers`,
        buffer,
        "😊"
      );
    }

    const inlineResults = await Promise.all(
      results.map(async (buffer, index) => {
        try {
          if (!buffer) return null;

          // let buffer = await imageDataURI.decode(imageData).dataBuffer;
          buffer = await sharp(buffer)
            .resize(512, 512, {
              fit: "contain",
              background: { r: 0, g: 0, b: 0, alpha: 0 },
            })
            .png({ compressionLevel: 9 })
            .toBuffer();

          // console.log(userId, stickerSetName, buffer, "😊");
          await bot
            .addStickerToSet(userId, stickerSetName, buffer, "😊")
            .catch((e) => {
              console.log("Add sticker to set:", e);
            });

          console.log("sticker send ..........");

          stickerSet = await bot.getStickerSet(stickerSetName).catch((e) => {
            console.log("Get sticker set:", e);
          });
          const newSticker =
            stickerSet.stickers[stickerSet.stickers.length - 1];

          const resultId = crypto.randomBytes(16).toString("hex");
          return {
            type: "sticker",
            id: resultId,
            sticker_file_id: newSticker.file_id,
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: "",
                    callback_data: `sticker_${index}`,
                  },
                ],
              ],
            },
          };
        } catch (err) {
          console.error(`Error processing sticker ${index}:`, err);
          return null;
        }
      })
    );

    // Wait for all sticker uploads and result creation to complete
    const validResults = inlineResults.filter(
      (result) => result !== null && result !== undefined
    );

    if (validResults.length === 0) {
      throw new Error("No valid inline results generated");
    }

    // Answer the inline query with all successful sticker results
    await bot
      .answerInlineQuery(inlineQueryId, validResults, {
        cache_time: 2000,
        is_personal: true,
      })
      .catch((e) => {
        console.log("Answer inline query:", e);
      })
      .finally(async () => {
        let stickerSet = await bot.getStickerSet(stickerSetName);
        stickerSet.stickers.forEach((sticker) => {
          bot.deleteStickerFromSet(sticker.file_id);
        });
      });
  } catch (error) {
    console.error("Error processing inline query:", error);

    // Send an empty result if there's an error
    await bot
      .answerInlineQuery(inlineQueryId, [], {
        cache_time: 2000,
        is_personal: true,
      })
      .catch((e) => {
        console.log("Answer inline query:", e);
      });
  }
});
