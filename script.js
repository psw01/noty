function initUI() {
	$(".column").sortable({
		connectToSortable: ".column",
		helper: "clone",
		revert: "invalid",
		connectWith: ".column",
		items: ".tasks:not(.ui-state-disabled)",
		contain: ".container",
		change: (e, ui) => {
			// console.log(ui.sender);
		},
		stop: sortAndOrder,
	});
	$(".C_TODO, .C_TODO").disableSelection();

	$(".doneBT").click(function () {
		$(this).parent().parent().appendTo(".c-done");
	});

	$(".deleteBT").click(function () {
		deleteNote(this.parentNode.parentNode);
	});

	$(".processBT").click(function () {
		$(".dialog").attr("open", true);
	});

	$(".tasks").dblclick(openNote);

	$(".tasks").bind("contextmenu", function (e) {
		return false;
	});

	$("#switchToEditMode")
		.unbind("click")
		.click(function () {
			switchToEditMode(this.parentNode.parentNode.parentNode);
		});
}
initUI();
