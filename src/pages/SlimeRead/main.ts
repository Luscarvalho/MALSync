import { pageInterface } from '../pageInterface';

export const SlimeRead: pageInterface = {
  name: 'SlimeRead',
  domain: 'https://slimeread.com/',
  languages: ['Portuguese'],
  type: 'manga',
  isSyncPage(url) {
    if (url.split('/')[3] === 'ler') {
      return true;
    }
    return false;
  },
  isOverviewPage(url) {
    if (url.split('/')[3] === 'manga') {
      return true;
    }
    return false;
  },
  sync: {
    getTitle(url) {
      return j.$('h1.Navigation-module_title_180OT').first().text();
    },
    getIdentifier(url) {
      const identifierHref = j.$('h1.Navigation-module_title_180OT').first().parent().attr('href');

      if (!identifierHref || identifierHref.length < 3) return '';

      return identifierHref.split('/')[2];
    },
    getOverviewUrl(url) {
      return j.$('.media-title').attr('href') || '';
    },
    getEpisode(url) {
      const episodeText = j.$('p.Navigation-module_chapterTitle_20juD').first().text();

      if (!episodeText) return NaN;

      const temp = episodeText.match(/#(\d+)/i);

      if (!temp) return NaN;

      return Number(temp[1]);
    },
  },
  overview: {
    getTitle(url) {
      return j.$('[class="mt-4 sm:ml-4 sm:mt-0  "] > p').text();
    },
    getIdentifier(url) {
      return url.split('/')[4];
    },
    uiSelector(selector) {
      j.$('[class="mt-4 sm:ml-4 sm:mt-0  "] > p').after(j.html(selector));
    },
  },
  init(page) {
    api.storage.addStyle(
      // eslint-disable-next-line global-require
      require('!to-string-loader!css-loader!less-loader!./style.less').toString(),
    );
    if (page.url.split('/')[3] === 'manga' || page.url.split('/')[3] === 'ler') {
      utils.waitUntilTrue(
        () => {
          if (j.$('[class="mt-4 sm:ml-4 sm:mt-0  "] > p').text()) {
            return true;
          }
          return false;
        },
        () => {
          page.handlePage();
        },
      );
    }
    utils.urlChangeDetect(() => {
      page.reset();
      if (page.url.split('/')[3] === 'viewer' || page.url.split('/')[3] === 'titles') {
        utils.waitUntilTrue(
          () => {
            if (j.$('[class="mt-4 sm:ml-4 sm:mt-0  "] > p').text()) {
              return true;
            }
            return false;
          },
          () => {
            page.handlePage();
          },
        );
      }
    });
  },
};
