# Codebot
Codebot is a Discord bot that allows you to compile and format C and C++ code directly in your Discord channels. It uses GNU Make and Clang internally, so it is compatible with any project built using these tools.

![Maintenance](https://img.shields.io/maintenance/no/2021?style=flat-square)

### Features
- Compiles and formats code for C and C++ projects
- Can handle multiple projects simultaneously, one per channel
- Allows you to send code either in the message contents or as a zip archive that can include multiple files, including headers
- Provides configuration options through !codebot commands for administrators

### Installation and usage
Codebot is written for Node.js and can be easily deployed through Docker. The included one-line setup script will take care of the installation process.

To use Codebot, simply invite it to your Discord server and assign it to the channels where you want it to operate. The bot will reply to every message with compilation results and formatted code.

### Contribute
We welcome contributions to Codebot. If you have an idea for a new feature or have found a bug, please open an issue or submit a pull request.
