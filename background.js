// Look for JSON if the content type is "application/json",
// or "application/whatever+json" or "application/json; charset=utf-8"
const jsonContentType = /^application\/([a-z]+\+)?json($|;)/;

// Keep track globally of URLs that contain JSON content.
const jsonUrls = new Set();

function isRedirect(status) {
  return status >= 300 && status < 400;
}

/** Use the filterResponseData API to transform a JSON document to HTML. */
function transformResponseToJSON(url, details) {
  const filter = browser.webRequest.filterResponseData(details.requestId);

  const dec = new TextDecoder("utf-8");
  const enc = new TextEncoder();
  let content = "";

  filter.ondata = (event) => {
    content = content + dec.decode(event.data);
  };

  filter.onstop = (_event) => {
    try {
      contentObject = JSON.parse(content)
      if (contentObject.message && contentObject.message.length > 0) {
        contentObject.message =
          JSON.parse(contentObject.message.substring(0, contentObject.message.length - 2));
      }
      console.info({
        [url]: contentObject
      });
    } catch (e) {
      console.error(e);
    }

    filter.write(enc.encode(content));

    filter.disconnect();
  };
}

function detectJSON(event) {
  if (!event.responseHeaders || isRedirect(event.statusCode)) {
    return;
  }
  for (const header of event.responseHeaders) {
    if (header.name.toLowerCase() === "content-type" && header.value && jsonContentType.test(header.value)) {
      if (typeof browser !== 'undefined' && 'filterResponseData' in browser.webRequest) {
        transformResponseToJSON(event.url, event);
      }
    }
  }

  return { responseHeaders: event.responseHeaders };
}

// Listen for onHeaderReceived for the target page.
// Set "blocking" and "responseHeaders".
chrome.webRequest.onHeadersReceived.addListener(
  detectJSON,
  { urls: ["<all_urls>"], types: ["xmlhttprequest"] },
  ["blocking", "responseHeaders"]
);
