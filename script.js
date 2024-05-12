$(function () {
	$(".column").sortable({
		connectToSortable: ".column",
		helper: "clone",
		revert: "invalid",
		connectWith: ".column",
		items: ".tasks:not(.ui-state-disabled)",
		contain: ".container",
	});
});
$(".C_TODO, .C_TODO").disableSelection();

$(".doneBT").click(function () {
	$(this).parent().parent().appendTo(".c-done");
});

$(".deleteBT").click(function () {
	$(this)
		.parent()
		.parent()
		.fadeOut(500, function () {
			$(this).remove();
		});
});

$(".processBT").click(function () {
	$(".dialog").attr("open", true);
});
