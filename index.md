---
layout: default
title: "Welcome"
---

<script>
  var userLang = navigator.language || navigator.userLanguage;
  if (userLang.startsWith('ja')) {
    window.location.href = "/jp/";
  } else {
    window.location.href = "/en/";
  }
</script>

<p>Redirecting...</p>
