const { toMatchImageSnapshot } = require('jest-image-snapshot');
const customSnapshotsDir = `${process.cwd()}/__snapshots__`;

module.exports = {
  setup() {
    expect.extend({ toMatchImageSnapshot });
  },
  async postRender(page, context) {
    // If you want to take screenshot of multiple browsers, use
    // page.context().browser().browserType().name() to get the browser name to prefix the file name
    
    // const image = await page.screenshot();
    // const snapshot = await page.snapshot();
    // expect(snapshot).toMatchImageSnapshot({
    //   customSnapshotsDir,
    //   customSnapshotIdentifier: context.id,
    // });

    // the #root element wraps the story. From Storybook 7.0 onwards, the selector should be #storybook-root
    const elementHandler = await page.$('#storybook-root');
    const innerHTML = await elementHandler.innerHTML();
    expect(innerHTML).toMatchSnapshot();
  },
};