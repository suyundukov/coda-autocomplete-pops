# Coda Autocomplete Pops

## What's this thingie?

This is modified version of original `.codapop` files which comes with Coda 2. Original Pops works only in CSS, LESS and SCSS modes. Actually, this modified version add support of Sass mode. So you can use all Autocomplete-Pops with your files opened in Sass mode.

## What's this pops?

Pops help you to easily change some CSS properties, like `border-radius`, `border-width`, CSS colors, `margin`, etc.

![Color Pop][colorPop]

## Install

#### With git

```
cd /Applications/Coda\ 2.app/Contents/
git clone https://github.com/sumaxime/Coda-Autocomplete-Pops.git temp
cp -r temp/* PlugIns && rm -rf temp
```

#### Without git

```
cd /Applications/Coda\ 2.app/Contents/
curl -L https://github.com/sumaxime/Coda-Autocomplete-Pops/tarball/master | tar xz --strip 1 -C PlugIns
```

#### Manual

1. [Download][download] zip archive.
2. Unarchive it.
3. Go to Applications folder, right click on Coda 2.app and select "Show Package Contents", go to Contents folder.
4. Now just Copy & Paste all `.codapop` files from zip archive to PlugIns folder.

## Changelog

**Version 1.0**
- Added Sass mode support

## License

<p align="center">
  <a href="./LICENSE"><img src="https://i1.sumaxi.me/i/logo.svg" width="100%" height="128"></a>
  <a href="./LICENSE"><strong>MIT</strong></a>
</p>



[colorPop]: http://i.imgur.com/yk9mZIA.png
[download]: https://github.com/sumaxime/Coda-Autocomplete-Pops/archive/master.zip
