$(function() {
    $("ul.navbar-nav li a").each(function() {
		var pathName = location.pathname.replace("/staging/", "");
		if ($(this).attr("href") === pathName || ($(this).attr("href") === "index.html" && pathName === ""))
		{
			$(this).parent().addClass("active");
		}
		else
		{
			$(this).parent().removeClass("active");
		}
	});
});