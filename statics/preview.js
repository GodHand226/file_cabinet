$("#copy").tooltip({
  trigger: "click",
  placement: "bottom",
});

function setTooltip(message) {
  $("#copy")
    .tooltip("hide")
    .attr("data-original-title", message)
    .tooltip("show");
}

function hideTooltip() {
  setTimeout(function () {
    $("#copy").tooltip("hide");
  }, 1000);
}

// Clipboard
var clipboard = new ClipboardJS("#copy");

clipboard.on("success", function (e) {
  setTooltip("Copied!");
  hideTooltip();
});

clipboard.on("error", function (e) {
  setTooltip("Failed!");
  hideTooltip();
});
