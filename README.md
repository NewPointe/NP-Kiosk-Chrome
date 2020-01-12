Rock-Checkin-Chrome
===================

**Rock-Checkin-Chrome** is a [Chromebook](https://www.google.com/chromebook/) app for the [Rock RMS](https://www.rockrms.com/) Check-in system. It is based off of the official [Rock Check-in](https://apps.apple.com/us/app/rock-check-in/id879253336) iOS app and aims to maintain feature parity.

While it should work on any chromebook device, this app was designed to work with the [Acer Chromebook Tab 10](https://www.acer.com/ac/en/US/content/series/acerchromebooktab10) - a cheaper and easier to manage alternative to the iPad with a very similar form factor (It even fits in our old iPad stands! ...with some minor modifications).

## Building

```sh
git checkout https://github.com/NewPointe/Rock-Checkin-Chrome.git
cd Rock-Checkin-Chrome
npm i
npm run build
```

Unpackaged build results will be in `./dist`. You can add this folder as an unpackaged app inside of Chrome for testing. A packaged .zip will be in `./build`. This can be uploaded to the Chrome Web Store for your organization.