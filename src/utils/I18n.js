import ReactNative from 'react-native';
import I18n from "i18n-js";
import * as RNLocalize from "react-native-localize";
import DeviceInfo from 'react-native-device-info'

import en from "./locales/en";
import de from "./locales/de";
import he from "./locales/he";
import vi from "./locales/vi";
import pt from "./locales/pt";
import zh from "./locales/zh";
import hi from "./locales/hi";
import uk from "./locales/uk";

const locales = RNLocalize.getLocales();

if (Array.isArray(locales)) {
  I18n.locale = locales[0].languageTag;
  I18n.languageCode = locales[0].languageCode
}

// Is it a RTL language?
I18n.isRTL = I18n.locale.indexOf('he') === 0 || I18n.locale.indexOf('ar') === 0;

// Allow RTL alignment in RTL languages
ReactNative.I18nManager.allowRTL(I18n.isRTL);

I18n.fallbacks = true;
I18n.translations = {
  en,
  de,
  hi,
  uk,
  he,
  vi,
  pt,
  zh
};

export default I18n;
