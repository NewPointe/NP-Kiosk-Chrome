<div align="center">

# Rock-Checkin-Chrome


[![Discord Server][chat-badge]][chat-link]
[![License][license-badge]][license-link]
[![Discord Server][dependencies-badge]][dependencies-link]
[![Discord Server][dev-dependencies-badge]][dev-dependencies-link]
[![Build][build-badge]][build-link]
[![Release][release-badge]][release-link]

</div>

Rock-Checkin-Chrome is a [Chromebook](https://www.google.com/chromebook/) app for the [Rock RMS](https://www.rockrms.com/) Check-in system. It is based off of the official [Rock Check-in](https://apps.apple.com/us/app/rock-check-in/id879253336) iOS app and aims to maintain feature parity.

While it should work on any chromebook device, this app was designed for the [Acer Chromebook Tab 10](https://www.acer.com/ac/en/US/content/series/acerchromebooktab10) - a cheaper and easier to manage alternative to the iPad with a very similar form factor (It even fits in our old iPad stands! ...with some minor modifications).

## Building

```sh
git checkout https://github.com/NewPointe/Rock-Checkin-Chrome.git
cd Rock-Checkin-Chrome
npm i
npm run build
```

Unpackaged build results will be in `./dist`. You can add this folder as an unpackaged app inside of Chrome for testing. A packaged .zip will be in `./build`. This can be uploaded to the Chrome Web Store for your organization.

## License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

[chat-badge]: https://chat.rockrms.com/api/v1/shield.svg?type=online&name=Rock%20RMS%20Chat%20%20
[chat-link]: https://chat.rockrms.com

[dependencies-badge]: https://img.shields.io/david/NewPointe/Rock-Checkin-Chrome
[dependencies-link]: https://david-dm.org/NewPointe/Rock-Checkin-Chrome

[dev-dependencies-badge]: https://img.shields.io/david/dev/NewPointe/Rock-Checkin-Chrome
[dev-dependencies-link]: https://david-dm.org/NewPointe/Rock-Checkin-Chrome?type=dev

[license-badge]: https://img.shields.io/github/license/NewPointe/Rock-Checkin-Chrome
[license-link]: https://github.com/NewPointe/Rock-Checkin-Chrome/blob/master/LICENSE

[release-badge]: https://img.shields.io/github/v/release/NewPointe/Rock-Checkin-Chrome?label=latest%20release
[release-link]: https://github.com/NewPointe/Rock-Checkin-Chrome/releases/latest

[build-badge]: https://img.shields.io/github/workflow/status/NewPointe/Rock-Checkin-Chrome/build
[build-link]: https://github.com/NewPointe/Rock-Checkin-Chrome/actions
