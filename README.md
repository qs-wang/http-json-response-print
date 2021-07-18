# HTTP JSON Response parser

Firefox extension to print out JSON response.

## What it does

Listens to HTTP Responses from the host specified in manifest and print out 
the JSON response to console.

This is just a simple internal tools for myself to debug the web page with
http API

## Config
change the line under permission node of the manifest.json file
from "*://*.xxxx.com/*" to "*://*.yourdomain.com/*"

## Install the extension
Refer firefox [page](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Your_first_WebExtension)

## Output
For simplicity this extension only print out the json response to web browser console.
Tools => Browser Tools => Browser Console.

From the console it is possible to copy the output as json object, and save it to local file.