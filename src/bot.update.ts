import { Injectable } from '@nestjs/common';
import { Ctx, Start, Update, On } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import axios from 'axios';
import * as cheerio from 'cheerio';

@Injectable()
@Update()
export class BotUpdate {
  bot: any;
  @Start()
  async startCommand(@Ctx() ctx: Context) {
    await ctx.reply('Assalomu alaykum! Avtoelon havolasini yuboring:');
  }

  @On('text')
  async onText(@Ctx() ctx: Context) {
    const message = ctx.message;

    if ('text' in message) {
      const avtoelonUrl = this.extractUrl(message.text);

      if (avtoelonUrl) {
        const adDetails = await this.getAdDetails(avtoelonUrl);

        await ctx.reply(
          `Sarlavha: ${adDetails.title}\n` +
            `Ta'rif: ${adDetails.description}\n` +
            `Telefon raqami: ${adDetails.phoneNumber}\n` +
            `Narx: ${adDetails.price}\n` +
            `Ko'rishlar soni: ${adDetails.viewCount}\n`,
        );

        await ctx.reply("Necha ta ko'rish qo'shmoqchisiz?");
        this.bot.on('text', async (replyCtx: { message: { text: string; }; reply: (arg0: string) => any; }) => {
          if ('text' in replyCtx.message) {
            const count = parseInt(replyCtx.message.text);
            if (!isNaN(count) && count > 0) {
              await this.increaseViews(avtoelonUrl, count);
              await replyCtx.reply(`${count} ta ko'rish qo'shildi!`);
            } else {
              await replyCtx.reply("Noto'g'ri miqdor kiritildi.");
            }
          }
        });
      } 
      // else {
      //   await ctx.reply('Avtoelon havolasini yuboring.');
      // }
    }
  }

  extractUrl(text: string): string | null {
    const urlMatch = text.match(
      /https?:\/\/(www\.)?m\.avtoelon\.uz\/a\/show\/\d+/,
    );
    return urlMatch ? urlMatch[0] : null;
  }

  async getAdDetails(url: string): Promise<any> {
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299',
        Referer: 'https://www.avtoelon.uz/',
      },
    });
    const $ = cheerio.load(data);

    const title = $('.title_class_selector').text().trim(); // Replace with the correct selector for the title
    const description = $('.description_class_selector').text().trim(); // Replace with the correct selector for the description
    const phoneNumber = $('.phone_class_selector').text().trim(); // Replace with the correct selector for the phone number
    const price = $('.price_class_selector').text().trim(); // Replace with the correct selector for the price
    const viewCount = $('.view_count_selector').text().trim(); // Replace with the correct selector for the view count

    return {
      title,
      description,
      phoneNumber,
      price,
      viewCount,
    };
  }

  async increaseViews(url: string, count: number) {
    for (let i = 0; i < count; i++) {
      await axios.get(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299',
          Referer: 'https://www.avtoelon.uz/',
        },
      });
    }
  }
}
