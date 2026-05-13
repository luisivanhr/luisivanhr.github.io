(function () {
  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  async function writeClipboardText(value) {
    if (!navigator.clipboard || !window.isSecureContext) return false;
    try {
      await navigator.clipboard.writeText(value);
      return true;
    } catch (err) {
      console.error("Copy failed", err);
      return false;
    }
  }

  ready(function () {
    var shareBtn = document.getElementById("model-share-btn");
    var shareLinks = document.getElementById("model-share-links");

    if (shareBtn && shareLinks) {
      var url = encodeURIComponent(window.location.href);
      var titleEl = document.querySelector(".model-dossier-copy h1");
      var metaImage = document.querySelector('meta[property="og:image"]');
      var rawTitle = titleEl ? titleEl.textContent : document.title;
      var text = encodeURIComponent(rawTitle);
      var image = encodeURIComponent(metaImage ? metaImage.getAttribute("content") : "");
      var targets = {
        x: "https://twitter.com/intent/tweet?url=" + url + "&text=" + text,
        linkedin: "https://www.linkedin.com/shareArticle?mini=true&url=" + url + "&title=" + text + (image ? "&source=" + image : ""),
        facebook: "https://www.facebook.com/sharer/sharer.php?u=" + url + "&quote=" + text + (image ? "&picture=" + image : ""),
        gmail: "https://mail.google.com/mail/?view=cm&fs=1&su=" + text + "&body=" + url
      };

      Object.keys(targets).forEach(function (id) {
        var link = document.getElementById("model-share-" + id);
        if (link) {
          link.href = "#";
          link.dataset.href = targets[id];
        }
      });

      var nativeShare = document.getElementById("model-share-native");
      if (nativeShare) {
        if (navigator.share) {
          nativeShare.addEventListener("click", async function (event) {
            event.preventDefault();
            event.stopPropagation();
            try {
              await navigator.share({ title: rawTitle, text: rawTitle, url: window.location.href });
            } catch (err) {
              console.error("Share failed", err);
            }
            shareLinks.classList.remove("open");
            shareBtn.setAttribute("aria-expanded", "false");
          });
        } else {
          nativeShare.style.display = "none";
        }
      }

      shareBtn.addEventListener("click", function () {
        shareLinks.classList.toggle("open");
        shareBtn.setAttribute("aria-expanded", String(shareLinks.classList.contains("open")));
      });

      shareLinks.addEventListener("click", function (event) {
        var link = event.target.closest("a");
        if (link && link.dataset.href) {
          event.preventDefault();
          event.stopPropagation();
          window.open(link.dataset.href, "_blank", "noopener");
          shareLinks.classList.remove("open");
          shareBtn.setAttribute("aria-expanded", "false");
        }
      });
    }

    var shareCopy = document.getElementById("model-share-copy");
    if (shareCopy) {
      shareCopy.addEventListener("click", async function () {
        await writeClipboardText(window.location.href);
      });
    }

    var content = document.querySelector(".model-dossier-main");
    if (content && typeof renderMathInElement === "function") {
      renderMathInElement(content, {
        delimiters: [
          { left: "$$", right: "$$", display: true },
          { left: "$", right: "$", display: false },
          { left: "\\(", right: "\\)", display: false },
          { left: "\\[", right: "\\]", display: true }
        ],
        throwOnError: false
      });
    }
  });
})();
