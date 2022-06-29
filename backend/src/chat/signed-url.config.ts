import { UrlGeneratorModuleOptions } from 'nestjs-url-generator';

export function urlGeneratorModuleConfig(): UrlGeneratorModuleOptions {
  return {
    secret: process.env.URLGENSECRET,
    appUrl:  process.env.VUE_APP_BACKEND
  };
}
