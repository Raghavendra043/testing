import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'clickableLinks',
})
export class ClickableLinksPipe implements PipeTransform {
  urls: any =
    /(https?:\/\/(?:www.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^ ]{2,}|www.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^ ]{2,}|https?:\/\/(?:www.|(?!www))[a-zA-Z0-9]+.[^ ]{2,}|www.[a-zA-Z0-9]+.[^ ]{2,})/g;

  transform(text: string) {
    return text ? this.parseUrl(text) : text;
  }

  private parseUrl(text: string) {
    if (text.match(this.urls)) {
      text = text.replace(this.urls, function replacer($1, $2) {
        const url: any = $1;
        const urlClean: any = url.replace('' + $2 + '://', '');
        return '<a href="' + url + '" target="_blank">' + urlClean + '</a>';
      });
    }
    return text;
  }
}
