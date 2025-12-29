/*
 * @Author: June
 * @Description:
 * @Date: 2023-10-29 12:18:14
 * @LastEditors: June
 * @LastEditTime: 2023-11-01 12:01:24
 */
import { createI18n } from 'vue-i18n';
import zh from 'view-ui-plus/dist/locale/zh-CN';
import en from 'view-ui-plus/dist/locale/en-US';
import vi from 'view-ui-plus/dist/locale/vi-VN';
import US from './en.json';
import CN from './zh.json';
import VI from './vi.json';
import { getLocal, setLocal } from '@/utils/local';
import { LANG } from '@/config/constants/app';

const messages = {
  en: Object.assign(US, en),
  zh: Object.assign(CN, zh),
  vi: Object.assign(VI, vi),
};

function getLocalLang() {
  let localLang = getLocal(LANG);
  if (!localLang) {
    localLang = 'vi';
    setLocal(LANG, localLang);
  }
  return localLang;
}
const lang = getLocalLang();

const i18n = createI18n({
  allowComposition: true,
  globalInjection: true,
  legacy: false,
  locale: lang,
  fallbackLocale: 'en',
  messages,
});

export default i18n;
export const t = (key: any) => {
  return i18n.global.t(key);
};
