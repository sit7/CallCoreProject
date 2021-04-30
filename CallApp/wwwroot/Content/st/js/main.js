



$(document).ready(function() {

  $(".form .checkbox label input").on("change",function() {
    $(this).closest("label").toggleClass("active");
  });

  $(".st-section-home .links .item").on("click",function(e) {
    if ($(this).hasClass("disabled"))
      return;
    if (typeof($(this).attr("href"))!="undefined" && $(this).attr("href")!="")
      return;
    e.preventDefault();
    $(this).find("form").submit();
  });
});
