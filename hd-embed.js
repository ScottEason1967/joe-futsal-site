/* ---------------------------------------------------------------------------
   hd-embed.js — stop YouTube embeds opening at 360p.

   YouTube chooses its opening resolution from the size of the player itself,
   not from anything you can put in the URL. A 760px-wide embed gets a 480p
   stream; a 620px one gets 360p. The old tricks for forcing quality
   (vq=hd1080, setPlaybackQuality) were pulled from the HTML5 player years ago
   and do nothing now.

   So this gives an embed a real 1920x1080 viewport — which is what YouTube
   measures — and then scales the rendered player back down into whatever slot
   it actually lives in. The stream is 1080p and the browser downsamples it,
   which is sharper than a 360p stream blown up, and carries several times the
   bitrate, which is most of what makes the difference.

   The one cost is that the player's own controls scale down with it, so:
     - touch devices are left alone (dense screens already get a decent
       rendition, and the controls need to stay thumb-sized)
     - it steps down to 720p or 480p rather than shrink the controls past
       a third of their normal size
     - a slot already big enough in real device pixels is left alone

   It picks up iframes already on the page and any added later by other
   scripts, so nothing else needs changing.

   Per-iframe override:
     data-hd="off"   leave this one alone entirely
     data-hd="720"   cap at 720p  (lighter — good for background loops)
     data-hd="480"   cap at 480p
--------------------------------------------------------------------------- */
(function () {
  'use strict';
  if (window.__hdEmbed) return;
  window.__hdEmbed = true;

  var YT = /(?:youtube|youtube-nocookie)\.com\/embed\//;
  var RUNGS = [{ w: 1920, h: 1080 }, { w: 1280, h: 720 }, { w: 854, h: 480 }];
  var MIN_SCALE = 0.33;   /* below this the player's own controls get fiddly */

  var css = document.createElement('style');
  css.textContent =
    '.hd-embed{position:relative;overflow:hidden;}' +
    'iframe.hd-frame{position:absolute!important;top:0!important;left:0!important;' +
      'right:auto!important;bottom:auto!important;max-width:none!important;' +
      'max-height:none!important;transform-origin:0 0;border:0;display:block;}' +
    'iframe.hd-frame:fullscreen,iframe.hd-frame:-webkit-full-screen{position:fixed!important;' +
      'top:0!important;left:0!important;width:100%!important;height:100%!important;' +
      'transform:none!important;}';
  (document.head || document.documentElement).appendChild(css);

  function ceiling(ifr) {
    var v = (ifr.getAttribute('data-hd') || '').toLowerCase();
    if (v === 'off' || v === 'no' || v === 'false') return null;
    if (v === '720') return 1;
    if (v === '480') return 2;
    return 0;
  }

  function targetSize(ifr, slotW) {
    var top = ceiling(ifr);
    if (top === null) return null;
    if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) return null;

    for (var i = top; i < RUNGS.length; i++) {
      if (slotW >= RUNGS[i].w) return null;              /* already this big */
      if (slotW / RUNGS[i].w >= MIN_SCALE) return RUNGS[i];
    }
    return null;   /* slot too small to carry even 480p at a sane scale */
  }

  /* The slot the player fills is the nearest ancestor that actually has a box.
     Some embeds are dropped into a bare, unsized wrapper inside the real
     frame, so parentElement on its own isn't safe. */
  function stageFor(ifr) {
    if (ifr.__stage && ifr.__stage.clientHeight) return ifr.__stage;
    var el = ifr.parentElement;
    for (var i = 0; i < 4 && el; i++) {
      if (el.clientWidth > 0 && el.clientHeight > 0) {
        if (ifr.__stage !== el) {
          ifr.__stage = el;
          el.classList.add('hd-embed');
          if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
        }
        return el;
      }
      el = el.parentElement;
    }
    return null;
  }

  function native(ifr) {
    if (ifr.__mode === 'native') return;
    ifr.__mode = 'native';
    ifr.removeAttribute('width');
    ifr.removeAttribute('height');
    ifr.style.width = '100%';
    ifr.style.height = '100%';
    ifr.style.transform = 'none';
  }

  function fit(ifr) {
    var box = stageFor(ifr);
    if (!box) return;
    var w = box.clientWidth, h = box.clientHeight;
    if (!w || !h) return;

    var t = targetSize(ifr, w);
    if (!t) { native(ifr); return; }

    if (ifr.__mode !== 'scaled' || ifr.__t !== t) {
      ifr.__mode = 'scaled';
      ifr.__t = t;
      ifr.setAttribute('width', t.w);
      ifr.setAttribute('height', t.h);
      ifr.style.width = t.w + 'px';
      ifr.style.height = t.h + 'px';
    }
    /* contain, not cover — a slot that isn't quite 16:9 should letterbox
       against its black background exactly as YouTube's own player does,
       rather than crop the picture and the controls off the edges */
    var s = Math.min(w / t.w, h / t.h);
    var dx = (w - t.w * s) / 2, dy = (h - t.h * s) / 2;
    ifr.style.transform = 'translate(' + dx + 'px,' + dy + 'px) scale(' + s + ')';
  }

  function prep(ifr) {
    if (ifr.__hdInit || !YT.test(ifr.src || '')) return;
    if (!ifr.parentElement || ceiling(ifr) === null) return;
    ifr.__hdInit = true;
    ifr.classList.add('hd-frame');

    fit(ifr);
    requestAnimationFrame(function () { fit(ifr); });

    if (window.ResizeObserver) {
      /* fires on first observe and again when a hidden slot becomes visible */
      var ro = new ResizeObserver(function () { fit(ifr); });
      ro.observe(ifr.parentElement);
      var st = stageFor(ifr);
      if (st && st !== ifr.parentElement) ro.observe(st);
    } else {
      var n = 0, poll = setInterval(function () {
        fit(ifr);
        if (++n > 20) clearInterval(poll);
      }, 150);
    }
  }

  function sweep(root) {
    if (!root || !root.querySelectorAll) return;
    var list = root.querySelectorAll('iframe');
    for (var i = 0; i < list.length; i++) prep(list[i]);
  }

  function refit() {
    var list = document.querySelectorAll('iframe.hd-frame');
    for (var i = 0; i < list.length; i++) fit(list[i]);
  }

  if (window.MutationObserver) {
    new MutationObserver(function (muts) {
      for (var i = 0; i < muts.length; i++) {
        var added = muts[i].addedNodes;
        for (var j = 0; j < added.length; j++) {
          var n = added[j];
          if (n.nodeType !== 1) continue;
          if (n.tagName === 'IFRAME') prep(n); else sweep(n);
        }
      }
    }).observe(document.documentElement, { childList: true, subtree: true });
  }

  window.addEventListener('resize', refit);
  window.addEventListener('orientationchange', refit);
  document.addEventListener('fullscreenchange', function () { setTimeout(refit, 50); });
  document.addEventListener('webkitfullscreenchange', function () { setTimeout(refit, 50); });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { sweep(document); });
  } else {
    sweep(document);
  }
  window.addEventListener('load', function () { sweep(document); refit(); });
})();
